const jwt = require("jsonwebtoken");
//just a func
//it's using a JWT method callled verify, 

//check the usertoken and id to  see if it exists
module.exports.authenticate = (req, res, next) => {
    jwt.verify(req.cookies.usertoken, process.env.SECRET_KEY, (err, payload) => {
        if (err) {
            res.status(401).json({ verified: false });
        } else {
            next();
        }
    });
}
