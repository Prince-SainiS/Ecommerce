const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async(req ,res ,next) => {
    try{
        let token;

        // 1. get token from header
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1];
        }

        // 2. If no token
        if(!token){
            return res.status(401).json({
                status : "fail",
                message : "You are not logged in"
            });
        }

        // 3. verify token
        const decoded = jwt.verify(token , process.env.JWT_SECRET);

        // 4. check if user still exists

        const currentUser = await User.findById(decoded.id)

        if(!currentUser){
            return res.status(401).json({
                status : "fail",
                message : "User no longer exist"
            })
        }

        // 5. Attach user to request
        req.user = currentUser;

        next();
    }catch(err){
        res.status(401).json({
            status : "fail",
            message : "Invalid Token"
        })
    }
};

exports.restrictTo = (...roles) => {
    return (req, res , next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                status:"fail",
                message : "You do not have permission"
            })
        }

        next();
    }
}