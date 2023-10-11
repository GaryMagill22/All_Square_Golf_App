const { Wallet } = require('../models/wallet.model');
const { Payment } = require('../models/payment.model');
const { UserAccount } = require('../models/userAccounts.model');
const { User } = require('../models/user.model');
const { Withdrawal } = require('../models/withdrawal.model');
const { v4 } = require('uuid');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports.fundWallet = async (req, res) => {
    try {
        const { amount } = req.body;
        const paymentId = v4();

        // Create a payment entry in database
        await Payment.create({
            amount,
            paymentRef: paymentId,
        });

        // Create payment intent on stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.ceil(amount * 100),
            currency: 'usd',
            automatic_payment_methods: { enabled: true },
            metadata: {
                paymentId,
                user: req.user.id,
                paymentDescription: 'Wallet funding',
            },
        });

        return res.status(200).json({
            status: true,
            message: "Payment intent created successfully",
            client_secret: paymentIntent.client_secret,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: false,
            message: "Unable to process wallet funding.",
        });
    }
}

module.exports.fetchWalletBalance = async (req, res) => {
    try {
        const walletDetails = await Wallet.findOne({
            user: req.user.id
        });

        return res.status(200).json({
            status: true,
            message: "Wallet Balance retrieved successfully",
            walletDetails,
        });
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Unable to retrieve wallet balance.",
        });
    }
}

const connectAccount = async (userDetails) => {
    try {
        const account = await stripe.accounts.create({
            type: 'express',
            country: 'US',
            email: userDetails.email,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
            business_type: 'individual',
            individual: {
                email: userDetails.email,
                first_name: userDetails.firstName,
                last_name: userDetails.lastName,
            },
        });

        return {
            status: true,
            data: account,
        }
    } catch (err) {
        console.log(err)
        return {
            status: false,
            data: null,
        }
    }
}

const createAuthorizationLink = async (payload) => {
    try {
        const accountLink = await stripe.accountLinks.create({
            account: payload.accountId,
            refresh_url: process.env.STRIPE_ACCOUNT_LINK_REFRESH_URL,
            return_url: process.env.STRIPE_ACCOUNT_LINK_RETURN_URL,
            type: 'account_onboarding',
        });

        return {
            stat: true,
            accountLink,
        }
    } catch (err) {
        console.log(err);
        return {
            stat: false,
            accountLink: null,
        }
    }
}

const checkOnboardingStatus = async (accountId) => {
    try {
        const account = await stripe.accounts.retrieve(accountId);
        return {
            isOnboardingComplete: account.details_submitted
        }
    } catch (err) {
        return {
            isOnboardingComplete: false
        }
    }
}

module.exports.initiateWithdrawal = async (req, res) => {
    try {
        const { amount } = req.body;
        // Check if user exist in userAccount collection in DB
        const userAccountData = await UserAccount.findOne({ user: req.user.id });
        if (!userAccountData) {
            const userDetails = await User.findOne({ _id: req.user.id });

            // Create connected account for user
            const { status, data } = await connectAccount(userDetails);
            if (status) {
                // Create UserAccount for user
                const newUserAccount = await UserAccount.create({
                    user: req.user.id,
                    accountId: data.id,
                });

                const { stat, accountLink } = await createAuthorizationLink(newUserAccount);
                if (stat) {
                    return res.status(200).json({
                        status: 200,
                        message: 'Kindly complete stripe onboarding process to enable withdrawal',
                        data: {
                            isOnboarded: false,
                            url: accountLink.url,
                        }
                    });
                }
            }
        }

        const { isOnboardingComplete } = await checkOnboardingStatus(userAccountData.accountId);
        if (!isOnboardingComplete) {
            // User hasn't finished onboarding. Prompt uset to do so
            const { stat, accountLink } = await createAuthorizationLink(userAccountData);
            if (stat) {
                return res.status(200).json({
                    status: 200,
                    message: 'Kindly complete stripe onboarding process to enable withdrawal',
                    data: {
                        isOnboarded: false,
                        url: accountLink.url,
                    }
                });
            }
        }

        // Check user wallet balance
        const walletDetails = await Wallet.findOne({ user: req.user.id });
        if (amount > walletDetails.amount) {
            return res.status(400).json({
                status: 400,
                message: 'Your wallet balance is low',
            });
        }

        // Create new withdrawal instance
        const ref = v4();
        await Withdrawal.create({
            user: req.user.id,
            amount: amount,
            reference: ref,
        });

        // Process payout to user bank account
        const payout = await stripe.payouts.create(
            {
                amount: Math.ceil(amount),
                currency: 'usd',
                method: 'instant',
                metadata: {
                    withdrawalRef: ref,
                    user: req.user.id,
                },
            },
            {
                stripeAccount: userAccountData.accountId,
            }
        );

        // Deduct amount from user wallet
        const userData = await Wallet.findOne({ user: req.user.id });
        if (!userData) {
            return res.status(400).json({
                status: 400,
                message: 'No user found...Unable to process withdrawal.',
            });
        }

        userData.amount -= amount;
        await userData.save();

        return res.status(200).json({
            status: 200,
            message: 'Withdrawal request received successfully...Payout will be sent shortly.',
            data: {
                isOnboarded: true,
                payout,
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 500,
            message: "Error creating test connect account",
        });
    }
}

module.exports.deleteAccount = async (req, res) => {
    try {
        const deleted = await stripe.accounts.del(
            'acct_1NsCAuHKKc5TWlPl'
        );
        res.status(200).json({
            deleted,
            status: true,
            message: "Successfully created",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: false,
            message: "Error creating test connect account",
        });
    }
}

module.exports.generateStripeAuthorizationLink = async (req, res) => {
    try {
        const user = await UserAccount.findOne({ user: req.user.id });
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found",
            });
        }

        const { stat, accountLink } = await createAuthorizationLink(user);
        if (stat) {
            return res.status(200).json({
                status: 200,
                message: 'Kindly complete stripe onboarding process to enable withdrawal',
                data: {
                    isOnboarded: false,
                    url: accountLink.url,
                }
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "Unable to generate stripe authorization link",
        });
    }
}

module.exports.stripePaymentWebhook = async (req, res) => {
    const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    } catch (err) {
        console.log('error', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    const paymentIntentData = event.data.object;
    const { paymentId, user, withdrawalRef } = paymentIntentData.metadata;

    switch (event.type) {
        case 'payment_intent.created':
            const paymentIntentCreated = event.data.object;
            console.log('Payment intent created');
            break;

        case 'payment_intent.failed':
            // update payment status to failed
            await Payment.findOneAndUpdate({
                paymentRef: paymentId
            }, { $set: { status: 'failed' } });
            console.log(`Payment status updated to failed`);
            break;

        case 'payment_intent.succeeded':
            // update order status to success
            await Payment.findOneAndUpdate({
                paymentRef: paymentId
            }, { $set: { status: 'success' } });

            // Update user wallet balance
            const userData = await Wallet.findOne({ user });
            if (!userData) {
                console.log('No user found. Amount cannot be added to wallet');
            }

            userData.amount += (paymentIntentData.amount / 100);
            await userData.save();
            console.log(`Wallet funded and payment status updated to success`);
            break;

        case 'payout.paid':
            await Withdrawal.findOneAndUpdate({
                reference: withdrawalRef
            }, { $set: { isPaid: true } });
            console.log(`Withdrawal status for reference ${withdrawalRef} updated to paid`);
            break;

        case 'payout.cancelled':
            const __userData = await Wallet.findOne({ user });
            if (!__userData) {
                console.log('No user found. Amount cannot be added to wallet');
            }

            __userData.amount += (paymentIntentData.amount / 100);
            await __userData.save();
            console.log(`Payout cancelled...Withdrawal status for reference ${withdrawalRef} updated to unpaid and wallet amount added back to wallet balance.`);
            break;

        case 'payout.failed':
            const ___userData = await Wallet.findOne({ user });
            if (!___userData) {
                console.log('No user found. Amount cannot be added to wallet');
            }

            ___userData.amount += (paymentIntentData.amount / 100);
            await ___userData.save();
            console.log(`Payout failed...Withdrawal status for reference ${withdrawalRef} updated to unpaid and wallet amount added back to wallet balance.`);
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.send().end();
} 