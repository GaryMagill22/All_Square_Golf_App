const jwt = require("jsonwebtoken");
//just a func
//it's using a JWT method callled verify, 

//check the usertoken and id to  see if it exists
module.exports.authenticate = async (req, res, next) => {
    try {
        const decoded = await jwt.verify(req.cookies.usertoken, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ verified: false });
    }
}
