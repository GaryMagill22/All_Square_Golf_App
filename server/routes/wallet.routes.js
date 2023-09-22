const express = require('express');
const { authenticate } = require('../config/jwt.config');
const { 
    fundWallet, 
    fetchWalletBalance, 
    stripePaymentWebhook, 
    initiateWithdrawal, 
    generateStripeAuthorizationLink 
} = require('../controllers/wallet.controller');
const walletRoutes = express.Router();

// Route to fund wallet
walletRoutes.post('/fund-wallet', authenticate, fundWallet);

// Route to retrieve wallet balance
walletRoutes.get('/wallet-balance', authenticate, fetchWalletBalance);

// Webhook route to manage payment from stripe
walletRoutes.post('/payment-webhook', stripePaymentWebhook);

// Route to withdraw funds from wallet
walletRoutes.post('/withdraw', authenticate, initiateWithdrawal);

// Route to request new authorization link
walletRoutes.get('/new-link', authenticate, generateStripeAuthorizationLink);

module.exports = { walletRoutes };