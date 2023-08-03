const express = require('express');
const UserController = require("../controllers/user.controller");
//authenticate is a function that runs on every request you put it on
const { authenticate } = require('../config/jwt.config');
const userRoutes = express.Router()
const { check, validationResult } = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
userRoutes.get(`/allUsers`, authenticate, UserController.index)
// app.get(`/api/cookie`, UserController.cookie)
// /login endpoint is hte endpoint the frontend will hit
//http://localhost:8000/aoi/login, that will trigger the login func
userRoutes.post(`/login`, UserController.login)
userRoutes.delete(`/logout`, UserController.logout)
userRoutes.get(`/getUser`, authenticate, UserController.getUser)
userRoutes.get('/testingAuthFunc', authenticate, (req, res) => res.json('hi'))






// Create User and Stripe Customer
userRoutes.post('/register/new', [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').isLength({ min: 6 })
], async (req, res) => {
    // Handle the validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // If validation is successful, proceed to user registration
    UserController.register(req, res);
});



// Create User and Stripe Customer
userRoutes.post('/login', [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').isLength({ min: 6 })
], async (req, res) => {
    // Handle the validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // If validation is successful, proceed to user registration
    UserController.login(req, res);
});

userRoutes.post("/charge", UserController.chargeUser);





// Get All Users
userRoutes.get('/', UserController.getAllUsers)



// Create User
userRoutes.post('/register/new', UserController.register)






// All Routes






// Get One User
userRoutes.get(`/:id`, UserController.getOneUser)



// Update User
userRoutes.put('/:id', UserController.updateUser)



// Delete User
userRoutes.delete('/:id', UserController.deleteUser);




module.exports = { userRoutes }