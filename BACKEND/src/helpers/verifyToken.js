// const userData = require("../module/user.modul");
// const jwt = require("jsonwebtoken");

// // Verify Token //
// exports.verifyToken = async (req, res, next) => {
//     try {
//         let data = {time: Date()};
//         const token = jwt.sign(data,process.env.TOKEN_KEY);
//         console.log(token);
//         const verifyToken = jwt.verify(token, process.env.TOKEN_KEY);
//         // // console.log(verifyToken);
//         // const User = await userData.findOne({ _id: verifyToken._id });
        
//         req.token = token;
//         // req.User = User;
//         next();
//     } catch (error) {
//         return res.status(400).json({message:"Pleas Login"})
//     }
// };