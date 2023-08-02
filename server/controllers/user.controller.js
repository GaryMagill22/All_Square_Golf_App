// const User = require("../models/user.model")
const { User } = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


module.exports.index = (req, res) => {
    User.find()
        .then(users => res.cookie("test", "test", { httpOnly: true }).json(users))
        .catch(err => res.json(err))
}

module.exports.login = async (req, res) => {
    //find via email
    const user = await User.findOne({ email: req.body.email });
    //if no users return a 400
    if (user === null) {
        return res.status(400).json({ msg: "Invalid login attempt" });
    }
    //is from bcryp which compares the pass youre passing in to the HASHED pw on the model
    const correctPassword = await bcrypt.compare(req.body.password, user.password);
    //deny
    if (!correctPassword) {
        return res.sendStatus(400);
    }
    //create TOKEN, this token is unique, and the id
    const userToken = jwt.sign({ id: user._id }, process.env.STRIPE_SECRET_KEY);
    //you ship that token in the response.cookie
    //cookie that gets stored on your browser, with the id value and the unique identifier
    res
        .cookie("usertoken", userToken, { httpOnly: true })
        .json({ msg: "success!" });
}

module.exports.logout = (req, res) => {
    res.clearCookie('usertoken')
    res.sendStatus(200)
}

module.exports.getUser = (req, res) => {
    const decodedJwt = jwt.decode(req.cookies.usertoken, { complete: true })
    User.findOne({ _id: decodedJwt.payload.id })
        .then(oneUser => res.json(oneUser))
        .catch(err => res.status(500).json(err))
}


// Testing connection
module.exports.apiTest = (req, res) => {
    res.json({ message: "succesful wooot woooot!" })
}

// Create new User //not using this one
module.exports.createUser = (req, res) => {
    User.create(req.body)
        .then(user => res.json(user))
        .catch(err => res.status(400).json(err))


}


// GeT all Users
module.exports.getAllUsers = (req, res) => {
    User.find({})
        .then(user => res.json(user))
        .catch(err => res.json(err))
}


// Read One User
module.exports.getOneUser = (req, res) => {
    // const idFromParams = req.params.id
    User.findById(req.params.id)
        .then((oneUser) => { res.json(oneUser) })
        .catch((err) => { res.json({ err: err }) })
}


//Update one User
module.exports.updateUser = (req, res) => {
    User.findOneAndUpdate({ _id: req.params.id }, req.body, { runValidators: true })
        .then(updatedUser => res.json(updatedUser))
        .catch((err) => res.status(400).json(err))
}



// Delete one User
module.exports.deleteUser = (req, res) => {
    User.deleteOne({ _id: req.params.id })
        .then(deleteUser => res.json(deleteUser))
        .catch(err => res.json(err))
}





// ===================  STRIPE CONTROLLER ROUTES TO CREATE USER   ==========================


module.exports.register = async (req, res) => {
    // Validate and sanitize req.body here as necessary
    const user = new User(req.body);
    try {
        const doc = await user.save();
        //creating that user token
        const userToken = jwt.sign({ id: doc._id }, process.env.SECRET_KEY);
        try {
            // Create the Stripe customer
            const customer = await stripe.customers.create({
                email: req.body.email,
            });
            // Save the Stripe customer ID to the user document in the database
            const result = await User.findByIdAndUpdate(
                doc._id,
                { stripeCustomerId: customer.id },
                { new: true }
            );
            //sending it back, it stores the user credentials, NOT the cookie
            res
                .cookie("usertoken", userToken, { httpOnly: true })
                .json({ msg: "success", user: result });
        } catch (stripeErr) {
            console.log("Stripe error:", stripeErr);
            res.status(400).json({ error: "Stripe customer creation failed" });
        }
    } catch (err) {
        console.log("User save error:", err);
        res.status(400).json({ error: "User registration failed" });
    }
};



// Method to charge user account and hold money in stripe account
module.exports.chargeUser = async (req, res) => {
    const userId = req.body.userId;
    const amount = req.body.amount;

    const user = await User.findById(userId);

    if (!user) {
        return res.status(400).json({ error: "User not found" });
    }

    // Make sure to convert the amount to cents as Stripe expects amounts to be in the smallest currency unit
    const charge = await stripe.charges.create({
        amount: amount * 100,
        currency: 'usd',
        customer: user.stripeCustomerId,
    });

    // Save the charge id to the database for reference

    res.json({ msg: "Charge created successfully", charge });
};


// Medthod to dsitrubute and pay out winners
module.exports.distributeWinnings = async (req, res) => {
    const userId = req.body.userId;
    const amount = req.body.amount;

    const user = await User.findById(userId);

    if (!user) {
        return res.status(400).json({ error: "User not found" });
    }

    const transfer = await stripe.transfers.create({
        amount: amount * 100,
        currency: 'usd',
        destination: user.stripeAccountId,
    });

    res.json({ msg: "Winnings distributed successfully", transfer });
};
