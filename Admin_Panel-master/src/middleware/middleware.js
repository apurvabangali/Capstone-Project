const userData = require("../module/user.modul");
const jwt = require("jsonwebtoken");


//verify Token
exports.verifyToken = async (req, res, next) => {
    try {
        
        const token = req.cookies.jwt;
        const verifyToken = jwt.verify(token, process.env.TOKEN_KEY);
        const adminUser = await userData.findOne({ _id: verifyToken._id });

        req.token = token;
        req.adminUser = adminUser;
        next();
    } catch (error) {
        res.status(400).render("login")
    }
};




