const { User } = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

module.exports.register = async (req, res) => {
    try {
        const isEmailExists = await User.findOne({
            email: req.body.email,
        });
        if (isEmailExists) {
            return res.status(409).json("Email already exist");
        }

        const user = await User.create(req.body);
        const userToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
        res
            .cookie("usertoken", userToken,
                {
                    maxAge: 18000 * 60 * 10,
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true
                }
            )
            .json({ msg: "success!", user: user });
    } catch (err) {
        res.status(500).json('Internal server error');
    }
}

// module.exports.register = (req, res) => {
//     User.create(req.body)
//         .then(user => {
//             res.json({ msg: "success!", user: user });
//         })
//         .catch(err => res.json(err));
// }


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
        return res.status(400).json({ msg: "Invalid login attempt: User not found." });
    }
    //is from bcryp which compares the pass youre passing in to the HASHED pw on the model
    const correctPassword = await bcrypt.compare(req.body.password, user.password);
    //deny
    if (!correctPassword) {
        return res.status(400).json({ msg: "Invalid login attempt: Incorrect password." });
    }
    //create TOKEN, this token is unique, and the id
    const userToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
    //you ship that token in the response.cookie
    //cookie that gets stored on your browser, with the id value and the unique identifier
    res
        .cookie("usertoken", userToken,
            {
                maxAge: 18000 * 60 * 10,
                httpOnly: true,
                sameSite: 'none',
                secure: true
            }
        )
        .json({ msg: "success!" });
}

module.exports.logout = (req, res) => {
    res.clearCookie('usertoken');
    res.sendStatus(200);
}

// module.exports.getUser = (req, res) => {
//     const decodedJwt = jwt.decode(req.cookies.usertoken, { complete: true })
//     User.findOne({ _id: decodedJwt.payload.id })
//         .then(oneUser => res.json(oneUser))
//         .catch(err => res.status(500).json(err))
// }

// Read One User
module.exports.getOneUser = (req, res) => {
    const decodedJwt = jwt.decode(req.cookies.usertoken, { complete: true })
    // const idFromParams = req.params.id
    User.findOne({ _id: decodedJwt.payload.id })
        .then((oneUser) => { res.json(oneUser) })
        .catch((err) => { res.json({ err: err }) })
}


// Testing connection
module.exports.apiTest = (req, res) => {
    res.json({ message: "successfull wooot woooot!" })
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



// // const User = require("../models/user.model")
// const { User } = require("../models/user.model")
// const bcrypt = require("bcrypt")
// const jwt = require("jsonwebtoken")




// module.exports.register = (req, res) => {
//     User.create(req.body)
//         .then(user => {
//             //creating that usertoken
//             const userToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
//             // console.log(userToken)
//             //sending it back, it stores the user credentials, NOT the cookie
//             res
//                 .cookie("usertoken", userToken, { httpOnly: true })
//                 .json({ msg: "success", user: user });
//         })
//         .catch(err => {
//             console.log("in err")
//             console.log(err)
//             res.status(400).json(err)
//         });
// }




// module.exports.index = (req, res) => {
//     User.find()
//         .then(users => res.cookie("test", "test", { httpOnly: true }).json(users))
//         .catch(err => res.json(err))
// }

// module.exports.login = async (req, res) => {
//     //find via email
//     const user = await User.findOne({ email: req.body.email });
//     //if no users return a 400
//     if (user === null) {
//         return res.status(400).json({ msg: "Invalid login attempt" });
//     }
//     //is from bcryp which compares the pass youre passing in to the HASHED pw on the model
//     const correctPassword = await bcrypt.compare(req.body.password, user.password);
//     //deny
//     if (!correctPassword) {
//         return res.sendStatus(400);
//     }
//     //create TOKEN, this token is unique, and the id
//     const userToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
//     //you ship that token in the response.cookie
//     //cookie that gets stored on your browser, with the id value and the unique identifier
//     res
//         .cookie("usertoken", userToken, { httpOnly: true })
//         .json({ msg: "success!" });
// }

// module.exports.logout = (req, res) => {
//     res.clearCookie('usertoken')
//     res.sendStatus(200)
// }

// module.exports.getUser = (req, res) => {
//     const decodedJwt = jwt.decode(req.cookies.usertoken, { complete: true })
//     User.findOne({ _id: decodedJwt.payload.id })
//         .then(oneUser => res.json(oneUser))
//         .catch(err => res.status(500).json(err))
// }


// // Testing connection
// module.exports.apiTest = (req, res) => {
//     res.json({ message: "succesful wooot woooot!" })
// }

// // Create new User //not using this one
// module.exports.createUser = (req, res) => {
//     User.create(req.body)
//         .then(user => res.json(user))
//         .catch(err => res.status(400).json(err))


// }


// // GeT all Users
// module.exports.getAllUsers = (req, res) => {
//     User.find({})
//         .then(user => res.json(user))
//         .catch(err => res.json(err))
// }


// // Read One User
// // module.exports.getOneUser = (req, res) => {
// //     // const idFromParams = req.params.id
// //     User.findById(req.params.id)
// //         .then((oneUser) => { res.json(oneUser) })
// //         .catch((err) => { res.json({ err: err }) })
// // }


// //Update one User
// module.exports.updateUser = (req, res) => {
//     User.findOneAndUpdate({ _id: req.params.id }, req.body, { runValidators: true })
//         .then(updatedUser => res.json(updatedUser))
//         .catch((err) => res.status(400).json(err))
// }



// // Delete one User
// module.exports.deleteUser = (req, res) => {
//     User.deleteOne({ _id: req.params.id })
//         .then(deleteUser => res.json(deleteUser))
//         .catch(err => res.json(err))
// }



// ======================================================================================== //



// const { User } = require("../models/user.model");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const { SECRET_KEY } = require("../config/jwt.config");





// module.exports.index = (req, res) => {
//     User.find()
//         .then(users => res.cookie("test", "test", { httpOnly: true }).json(users))
//         .catch(err => res.json(err))
// }

// // 

// module.exports.logout = (req, res) => {
//     res.clearCookie('usertoken')
//     res.sendStatus(200)
// }

// module.exports.getUser = (req, res) => {
//     const decodedJwt = jwt.decode(req.cookies.usertoken, { complete: true })
//     User.findOne({ _id: decodedJwt.payload.id })
//         .then(oneUser => res.json(oneUser))
//         .catch(err => res.status(500).json(err))
// }


// // Testing connection
// module.exports.apiTest = (req, res) => {
//     res.json({ message: "succesful wooot woooot!" })
// }

// // Create new User
// // Create new User //not using this one
// module.exports.createUser = (req, res) => {
//     User.create(req.body)
//         .then(user => res.json(user))
//         .catch(err => res.status(400).json(err))


// }


// // GeT all Users
// module.exports.getAllUsers = (req, res) => {
//     User.find({})
//         .then(user => res.json(user))
//         .catch(err => res.json(err))
// }


// // Read One User
// module.exports.getOneUser = (req, res) => {
//     // const idFromParams = req.params.id
//     User.findById(req.params.id)
//         .then((oneUser) => { res.json(oneUser) })
//         .catch((err) => { res.json({ err: err }) })
// }


// //Update one User
// module.exports.updateUser = (req, res) => {
//     User.findOneAndUpdate({ _id: req.params.id }, req.body, { runValidators: true })
//         .then(updatedUser => res.json(updatedUser))
//         .catch((err) => res.status(400).json(err))
// }



// // Delete one User
// module.exports.deleteUser = (req, res) => {
//     User.deleteOne({ _id: req.params.id })
//         .then(deleteUser => res.json(deleteUser))
//         .catch(err => res.json(err))
// }



// ===================  STRIPE CONTROLLER ROUTES TO CREATE USER   ==========================


// module.exports.login = async (req, res) => {
//     //find via email
//     const user = await User.findOne({ email: req.body.email });
//     //if no users return a 400
//     if (user === null) {
//         return res.status(400).json({ msg: "Invalid login attempt" });
//     }
//     //is from bcryp which compares the pass youre passing in to the HASHED pw on the model
//     const correctPassword = await bcrypt.compare(req.body.password, user.password);
//     //deny
//     if (!correctPassword) {
//         return res.sendStatus(400);
//     }
//     //create TOKEN, this token is unique, and the id
//     const userToken = jwt.sign({ id: user._id }, process.env.STRIPE_SECRET_KEY);
//     const userToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
//     //you ship that token in the response.cookie
//     //cookie that gets stored on your browser, with the id value and the unique identifier
//     res
//         .cookie("usertoken", userToken, { httpOnly: true })
//         .json({ msg: "success!" });
// }

// LOGIN and REGISTER using stripe - not using it yet dont need



// module.exports.index = (req, res) => {
//     User.find()
//         .then(users => res.cookie("test", "test", { httpOnly: true }).json(users))
//         .catch(err => res.json(err))
// }

// module.exports.login = async (req, res) => {
//     //find via email
//     const user = await User.findOne({ email: req.body.email });
//     //if no users return a 400
//     if (user === null) {
//         return res.status(400).json({ msg: "Invalid login attempt" });
//     }
//     //is from bcryp which compares the pass youre passing in to the HASHED pw on the model
//     const correctPassword = await bcrypt.compare(req.body.password, user.password);
//     //deny
//     if (!correctPassword) {
//         return res.sendStatus(400);
//     }
//     //create TOKEN, this token is unique, and the id
//     const userToken = jwt.sign({ id: user._id }, process.env.STRIPE_SECRET_KEY);
//     //you ship that token in the response.cookie
//     //cookie that gets stored on your browser, with the id value and the unique identifier
//     res
//         .cookie("usertoken", userToken, { httpOnly: true })
//         .json({ msg: "success!" });
// }

// module.exports.register = async (req, res) => {
//     // Validate and sanitize req.body here as necessary
//     const user = new User(req.body);
//     try {
//         const doc = await user.save();
//         //creating that user token
//         const userToken = jwt.sign({ id: doc._id }, process.env.SECRET_KEY);
//         try {
//             // Create the Stripe customer
//             const customer = await stripe.customers.create({
//                 email: req.body.email,
//             });
//             // Save the Stripe customer ID to the user document in the database
//             const result = await User.findByIdAndUpdate(
//                 doc._id,
//                 { stripeCustomerId: customer.id },
//                 { new: true }
//             );
//             //sending it back, it stores the user credentials, NOT the cookie
//             res
//                 .cookie("usertoken", userToken, { httpOnly: true })
//                 .json({ msg: "success", user: result });
//         } catch (stripeErr) {
//             console.log("Stripe error:", stripeErr);
//             res.status(400).json({ error: "Stripe customer creation failed" });
//         }
//     } catch (err) {
//         console.log("User save error:", err);
//         res.status(400).json({ error: "User registration failed" });
//     }
// };
// module.exports.logout = (req, res) => {
//     res.clearCookie('usertoken')
//     res.sendStatus(200)
// }

module.exports.getUser = (req, res) => {
    const decodedJwt = jwt.decode(req.cookies.usertoken, { complete: true })
    User.findOne({ _id: decodedJwt.payload.id })
        .then(oneUser => res.json(oneUser))
        .catch(err => res.status(500).json(err))
}


// Method to charge user account and hold money in stripe account
// module.exports.chargeUser = async (req, res) => {
//     const userId = req.body.userId;
//     const amount = req.body.amount;
// // Testing connection
// module.exports.apiTest = (req, res) => {
//     res.json({ message: "succesful wooot woooot!" })
// }

// const user = await User.findById(userId);
// // Create new User //not using this one
// module.exports.createUser = (req, res) => {
//     User.create(req.body)
//         .then(user => res.json(user))
//         .catch(err => res.status(400).json(err))

//     if (!user) {
//         return res.status(400).json({ error: "User not found" });
//     }
// }
// Make sure to convert the amount to cents as Stripe expects amounts to be in the smallest currency unit
// const charge = await stripe.charges.create({
//     amount: amount * 100,
//     currency: 'usd',
//     customer: user.stripeCustomerId,
// });
// }

// Save the charge id to the database for reference

//     res.json({ msg: "Charge created successfully", charge });
// };


// GeT all Users
// module.exports.getAllUsers = (req, res) => {
//     User.find({})
//         .then(user => res.json(user))
//         .catch(err => res.json(err))
// }





//Update one User
// module.exports.updateUser = (req, res) => {
//     User.findOneAndUpdate({ _id: req.params.id }, req.body, { runValidators: true })
//         .then(updatedUser => res.json(updatedUser))
//         .catch((err) => res.status(400).json(err))
// }



// Delete one User
// module.exports.deleteUser = (req, res) => {
//     User.deleteOne({ _id: req.params.id })
//         .then(deleteUser => res.json(deleteUser))
//         .catch(err => res.json(err))
// }






// class UserController {


//     register = (req, res) => {
//         const user = new User(req.body)
//         user.save()
//             .then(() => {
//                 const payload = {
//                     id: user._id
//                 };
//                 //creating that usertoken
//                 res.cookie("usertoken", jwt.sign({ _id: user._id }, process.env.SECRET_KEY), { httpOnly: true })
//                     .json({ msg: "Successfully created user!", user: user })
//                 //sending it back, it stores the user credentials, NOT the cookie

//             })
//             .catch(err => res.json(err));
//     }

//     async function login(req, res) => {
//     const user = await User.findOne({ email: req.body.email });

//     if (user === null) {
//         // email not found in users collection
//         return res.sendStatus(400);
//     }

//     // if we made it this far, we found a user with this email address
//     // let's compare the supplied password to the hashed password in the database
//     const correctPassword = await bcrypt.compare(req.body.password, user.password);

//     if (!correctPassword) {
//         // password wasn't a match!
//         return res.sendStatus(400);
//     }

//     // if we made it this far, the password was correct
//     const userToken = jwt.sign({
//         id: user._id
//     }, process.env.SECRET_KEY);

//     // note that the response object allows chained calls to cookie and json
//     res
//         .cookie("usertoken", userToken, secret, {
//             httpOnly: true
//         })
//         .json({ msg: "success!" });
// }




// // login(req, res) {
// //     User.findOne({ email: req.body.email })
// //         .then(user => {
// //             if (user === null) {
// //                 return res.json({ msg: "Invalid login attempt- user not found!" });
// //             } else {
// //                 bcrypt.compare(req.body.password, user.password)
// //                     .then(passwordIsValid => {
// //                         if (passwordIsValid) {
// //                             res.cookie("usertoken", jwt.sign({ _id: user._id }, process.env.SECRET_KEY), { httpOnly: true })
// //                                 .json({ msg: "Success!" })
// //                         } else {
// //                             res.json({ msg: "Invalid login attempt- password incorrect!" });
// //                         }
// //                     })
// //                     .catch(err => res.json({ msg: "Invalid Login attempt!", err }));
// //             }
// //         })
// //         .catch(err => res.json(err));
// // }

// getLoggedInUser(req, res) {
//     const decodedJwt = jwt.decode(req.cookies.usertoken, { complete: true });

//     User.findById(decodedJwt.payload._id)
//         .then(user => res.json(user))
//         .catch(err => res.json(err))
// }


// index = (req, res) => {
//     User.find()
//         .then(users => res.cookie("test", "test", { httpOnly: true }).json(users))
//         .catch(err => res.json(err))
// }

// logout = (req, res) => {
//     res.clearCookie('usertoken')
//     res.sendStatus(200)
// }

// // getUser = (req, res) => {
// //     if (!req.cookies.usertoken) {
// //         return res.status(400).json({ error: "No token provided" });
// //     }

// //     let decodedJwt;
// //     try {
// //         decodedJwt = jwt.verify(req.cookies.usertoken, process.env.SECRET_KEY);
// //     } catch (err) {
// //         return res.status(401).json({ error: "Invalid token" });
// //     }






// getUser = (req, res) => {
//     const decodedJwt = jwt.decode(req.cookies.usertoken, { complete: true })
//     User.findOne({ _id: decodedJwt.payload.id })
//         .then(oneUser => res.json(oneUser))
//         .catch(err => res.status(500).json(err))
// }



// // Testing connection
// apiTest = (req, res) => {
//     res.json({ message: "succesful wooot woooot!" })
// }


// // GeT all Users
// getAllUsers = (req, res) => {
//     User.find({})
//         .then(user => res.json(user))
//         .catch(err => res.json(err))
// }
// // Read One User
// getOneUser = (req, res) => {
//     // const idFromParams = req.params.id
//     User.findById(req.params.id)
//         .then((oneUser) => { res.json(oneUser) })
//         .catch((err) => { res.json({ err: err }) })
// }
// //Update one User
// updateUser = (req, res) => {
//     User.findOneAndUpdate({ _id: req.params.id }, req.body, { runValidators: true })
//         .then(updatedUser => res.json(updatedUser))
//         .catch((err) => res.status(400).json(err))
// }
// // Delete one User
// deleteUser = (req, res) => {
//     User.deleteOne({ _id: req.params.id })
//         .then(deleteUser => res.json(deleteUser))
//         .catch(err => res.json(err))
// }


// }




// // Export instance of Class UserController 
// module.exports = new UserController();




