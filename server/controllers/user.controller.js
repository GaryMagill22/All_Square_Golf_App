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
                    // setting how long coooke will be alive for.
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


module.exports.getUser = (req, res) => {
    const decodedJwt = jwt.decode(req.cookies.usertoken, { complete: true })
    User.findOne({ _id: decodedJwt.payload.id })
        .then(oneUser => res.json(oneUser))
        .catch(err => res.status(500).json(err))
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


