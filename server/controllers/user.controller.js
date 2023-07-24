// const User = require("../models/user.model")
const { User } = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")




module.exports.register = (req, res) => {
    User.create(req.body)
        .then(user => {
            //creating that usertoken
            const userToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
            // console.log(userToken)
            //sending it back, it stores the user credentials, NOT the cookie
            res
                .cookie("usertoken", userToken, { httpOnly: true })
                .json({ msg: "success", user: user });
        })
        .catch(err => {
            console.log("in err")
            console.log(err)
            res.status(400).json(err)
        });
}




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
    const userToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
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

// Create new User
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
