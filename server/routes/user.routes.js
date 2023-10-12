const express = require('express');
const UserController = require("../controllers/user.controller");
//authenticate is a function that runs on every request you put it on
const { authenticate } = require('../config/jwt.config');
const userRoutes = express.Router()



userRoutes.get(`/allUsers`, authenticate, UserController.index)
// app.get(`/api/cookie`, UserController.cookie)
// /login endpoint is hte endpoint the frontend will hit
//http://localhost:8000/aoi/login, that will trigger the login func
userRoutes.post(`/login`, UserController.login)
userRoutes.delete(`/logout`, authenticate, UserController.logout)
// userRoutes.get(`/getUser`, authenticate, UserController.getUser)


// Get All Users
userRoutes.get('/', UserController.getAllUsers)

// Create User
userRoutes.post('/register/new', UserController.register)




// Get One User
userRoutes.get(`/getUser`, authenticate, UserController.getOneUser)


// Update User
userRoutes.put('/:id', UserController.updateUser)


// Delete User
userRoutes.delete('/:id', UserController.deleteUser);



module.exports = { userRoutes }



