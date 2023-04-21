const fs = require("fs");
var db = require("../model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const validator = require("validator");
const status = require("http-status");
const APIResponse = require("../helpers/APIResponse");
const userData = require("../model/user.model");
const blogData = require("../model/blog.model");
const commentData = require("../model/comment.model");
const smtpTransport = require('nodemailer-smtp-transport');
const url = "http://127.0.0.1:8000";

// User Register //
exports.userRegister = (req, res) => {
    try {
        const data = new userData(req.body);
        email = req.body.email;
        username = req.body.username;

        if (!validator.isEmail(req.body.email)) {
            return res.json({
                message: "Please Give Email In Propper Formate",
            });
        } else {
            if (email) {
                userData.findOne({ email: email }).then((useremail) => {
                    if (useremail) {
                        return res
                            .status(status.INTERNAL_SERVER_ERROR)
                            .json(new APIResponse("Email Is Already Save", true, 208));
                    } else {
                        if (username) {
                            userData.findOne({ username: username }).then((usern) => {
                                if (usern) {
                                    return res
                                        .status(status.INTERNAL_SERVER_ERROR)
                                        .json(new APIResponse("Username Is Already Save", true, 208));
                                } else {
                                    data.save();
                                    return res
                                        .status(status.OK)
                                        .json(
                                            new APIResponse("User Register Successfully", false, 200, data)
                                        );
                                }
                            });
                        }
                    }
                });
            } else {
                return res
                    .status(status.INTERNAL_SERVER_ERROR)
                    .json(new APIResponse("Email Is Undefined", true, 404));
            }
        }
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("User Data Is Not Save", true, 400, error.message));
    }
};

// User Login //
exports.userLogin = async (req, res) => {
    try {
        username = req.body.username;
        password = req.body.password;

        const data = await userData.findOne({ username });
        const match = await bcrypt.compare(password, data.password);
        if (!data.tokens[0]) {
            const token = await data.generate();
        }
        if (match && username === data.username) {
            return res.status(200).json({
                message: "User Login Successfully",
                status: 200,
                id: data._id,
                token: data.tokens[0].token,
            });
        } else {
            return res
                .status(status.INTERNAL_SERVER_ERROR)
                .json(new APIResponse("Enter Valid Username Or Password", true, 400));
        }
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("User Not Login", true, 400, error.message));
    }
};

//View All User//
exports.ViewAllUser = async (req, res) => {
    try {
        // const data = await userData.find().sort({ updatedAt: -1 });
        const data = await userData.find({ username: { $not: { $eq: 'admin' } } }).sort({ updatedAt: -1 });
        return res
            .status(status.OK)
            .json(new APIResponse("Record Display", false, 200, data));
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Record Not Display", true, 400, error.message));
    }
};

// View User By Id //
exports.ViewUserById = async (req, res) => {
    try {
        const data = await userData.findById({ _id: req.params.id });
        return res
            .status(status.OK)
            .json(new APIResponse("Record Display", false, 200, data));
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Record Not Display", true, 400, error.message));
    }
};

// Update User //
exports.updateUser = async (req, res) => {
    try {
        _id = req.params.id;
        const update = await userData.find({
            _id: { $not: { $eq: _id } },
            email: req.body.email,
        });

        if (update.length > 0) {
            return res
                .status(status.INTERNAL_SERVER_ERROR)
                .json(new APIResponse("Email Already Exist", true, 400, error.message));
        } else {
            const data = await userData.findByIdAndUpdate({ _id: req.params.id },
                req.body, { new: true }
            );
            return res
                .status(status.OK)
                .json(new APIResponse("Record Update", false, 200, data));
        }
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Record Not Update", true, 400, error.message));
    }
};

let otp = 999999;

// Send Otp //
exports.sendEmail = async (req, res) => {
    try {
        email = req.body.email;
        const data = await userData.findOne({ email });
        const match = email === data.email;
        if (match) {
            const transport = nodemailer.createTransport(smtpTransport({
                service: 'gmail',
                auth: {
                    // user: process.env.USER_EMAIL, // please enter your email address.//
                    // pass: process.env.EMAIL_PASS, // please enter your email address password.//
                    user: "apurvabangali@gmail.com",
                    pass: "ROH@N2002"

                },
            }));

            const mailoption = {
                // from: process.env.USER_EMAIL, // please enter your email address.//
                from: "rjdhanani57@gmail.com",
                to: req.body.email,
                subject: "send otp in your mail",
                text: `Your otp is :- ${otp}, please don't give other person for your safety.`,
            };

            transport.sendMail(mailoption);
            return res
                .status(status.OK)
                .json(new APIResponse("OTP Send", false, 200));
        } else {
            return res
                .status(status.INTERNAL_SERVER_ERROR)
                .json(new APIResponse("Email Not Register", true, 404));
        }
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("OTP Not Send", true, 400, error.message));
    }
};

// User Can Forgot Password //
exports.forgotPassword = async (req, res) => {
    try {
        email = req.body.email;
        otp1 = req.body.otp;
        const data = await userData.findOne({ email });

        const com = otp1 === otp;

        if (com && email == data.email) {
            password = req.body.password;
            confirmPassword = req.body.confirmPassword;

            if (password === confirmPassword) {
                req.body.password = await bcrypt.hash(password, 10);
                console.log(req.body.password);
                const datas = await userData.findByIdAndUpdate({ _id: data._id },
                    req.body, { new: true }
                );
                return res
                    .status(status.OK)
                    .json(new APIResponse("Password Forgoted", false, 200, data));
            } else {
                return res
                    .status(status.INTERNAL_SERVER_ERROR)
                    .json(
                        new APIResponse(
                            "Password and ConfirmPassword Does Not Match",
                            true,
                            400
                        )
                    );
            }
        } else {
            return res
                .status(status.INTERNAL_SERVER_ERROR)
                .json(new APIResponse("OTP Does Not Match", true, 400));
        }
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Password Not Forgoted", true, 400, error.message));
    }
};

// User Upload Image //
exports.uploadImage = async (req, res) => {
    try {
        _id = req.params.id;
        if (req.file == undefined) {
            return res
                .status(status.INTERNAL_SERVER_ERROR)
                .json(new APIResponse("File Is Undefined", true, 404));
        } else {
            const data = await userData.findByIdAndUpdate(
                _id, {
                $set: {
                    image: `${url}/image/${req.file.filename}`,
                    path: req.file.path,
                },
            }, { new: true }
            );
            return res
                .status(status.OK)
                .json(new APIResponse("Image Uploaded Successfully", false, 200, data));
        }
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Image Not Uploaded", true, 400, error.message));
    }
};

//update image//
// exports.updateImage = async(req, res) => {
//     try {
//         _id = req.params.id;
//         if (req.file == undefined) {
//             return res
//                 .status(status.INTERNAL_SERVER_ERROR)
//                 .json(new APIResponse("File Is Undefined", true, 404));
//         } else {
//             const deleteImage = await userData.findById({ _id });
//             const ImagePath = deleteImage.path;

//             fs.unlink(ImagePath, (err) => {
//                 if (err) {
//                     console.error("Image Path Error In Delete ==>", err);
//                     return;
//                 }
//             });

//             const data = await userData.findByIdAndUpdate(
//                 _id, {
//                     $set: {
//                         image: `${url}/image/${req.file.filename}`,
//                         path: req.file.path,
//                     },
//                 }, { new: true }
//             );
//             return res
//                 .status(status.OK)
//                 .json(new APIResponse("Image Update Successfully", false, 200, data));
//         }
//     } catch (error) {
//         return res
//             .status(status.INTERNAL_SERVER_ERROR)
//             .json(new APIResponse("Image Not Updated", true, 400, error.message));
//     }
// };
exports.updateImage = async (req, res) => {
    try {
        _id = req.params.id;

        const user = await userData.findById({ _id });
        console.log(user.image)

        if (user.image === undefined && user.path === undefined) {
            if (req.file == undefined) {
                return res
                    .status(status.INTERNAL_SERVER_ERROR)
                    .json(new APIResponse("File Is Undefined", true, 404));
            } else {

                const data = await userData.findByIdAndUpdate(
                    _id, {
                    $set: {
                        image: `${url}/image/${req.file.filename}`,
                        path: req.file.path,
                    },
                }, { new: true }
                );
                return res
                    .status(status.OK)
                    .json(new APIResponse("Image Update Successfully", false, 200, data));
            }
        } else {
            if (req.file == undefined) {
                return res
                    .status(status.INTERNAL_SERVER_ERROR)
                    .json(new APIResponse("File Is Undefined", true, 404));
            } else {
                const deleteImage = await userData.findById({ _id });
                const ImagePath = deleteImage.path;

                fs.unlink(ImagePath, (err) => {
                    if (err) {
                        console.error("Image Path Error In Delete ==>", err);
                        return;
                    }
                });

                const data = await userData.findByIdAndUpdate(
                    _id, {
                    $set: {
                        image: `${url}/image/${req.file.filename}`,
                        path: req.file.path,
                    },
                }, { new: true }
                );
                return res
                    .status(status.OK)
                    .json(new APIResponse("Image Update Successfully", false, 200, data));
            }
        }
    } catch (error) {
        console.log(error)
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Image Not Updated", true, 400, error.message));
    }
};

// User Delete Image//
exports.deleteImage = async (req, res) => {
    try {
        _id = req.params.id;
        const deleteImage = await userData.findById({ _id });
        const ImagePath = deleteImage.path;

        fs.unlink(ImagePath, (err) => {
            if (err) {
                console.error("Image Path Error In Delete ==>", err);
                return;
            }
        });

        const data = await userData.findByIdAndUpdate(
            _id, { $unset: { image: "", path: "" } }, { new: true }
        );
        return res
            .status(status.OK)
            .json(new APIResponse("Image Deleted", false, 200, data));
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Image Not Deleted", true, 400, error.message));
    }
};

// User Profile //
exports.profile = async (req, res) => {
    try {
        source_id = req.params.id;
        const check = await blogData.findOne({ source_id: source_id });

        if (check === null) {
            const user = await userData.find({ _id: source_id });
            detail = [];
            detail.push({
                _id: {
                    blog: 0,
                    name: user[0].name,
                    email: user[0].email,
                    image: user[0].image,
                    phone: user[0].phone,
                    username: user[0].username,
                },
                total: 0
            });

            const data = [];
            data.push(Object.assign({}, ...detail));

            return res
                .status(status.OK)
                .json(new APIResponse("User Didn't Have Any blog", false, 200, data));
        } else {
            const detail = await blogData.aggregate([{
                $lookup: {
                    from: "users",
                    localField: "source_id",
                    foreignField: "_id",
                    as: "userdata",
                },
            },
            { $unwind: "$userdata" },
            {
                $match: {
                    source_id: ObjectId(req.params.id),
                },
            },
            {
                $group: {
                    _id: {
                        blog: {
                            $cond: {
                                if: { $isArray: "$blog" },
                                then: { $size: "$blog" },
                                else: "NA",
                            },
                        },
                        name: "$userdata.name",
                        email: "$userdata.email",
                        image: "$userdata.image",
                        phone: "$userdata.phone",
                        username: "$userdata.username",
                    },
                },
            },
            ]);
            // const detail = [];

            // datas.map((ele) => {
            //     detail.push(ele);
            // });

            const comment = await commentData.find({ source_id: req.params.id }).count();
            detail.push({ total: comment });

            const data = [];
            data.push(Object.assign({}, ...detail));

            return res
                .status(status.OK)
                .json(new APIResponse("Profile Display", false, 200, data));
        }
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Profile Not Display", true, 400, error.message));
    }
};

// Top 10 User //
exports.topUser = async (req, res) => {
    try {
        // const data = await userData.find({}).sort({ updatedAt: -1 }).limit(10);
        const data = await userData.find({ username: { $not: { $eq: 'admin' } } }).sort({ updatedAt: -1 }).limit(10);
        return res
            .status(status.OK)
            .json(new APIResponse("Profile Display", false, 200, data));
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(
                new APIResponse("TOP 10 User Not Display", true, 400, error.message)
            );
    }
};

//  Search User Blog //
exports.searchBlog = async (req, res) => {
    try {
        keyword = req.body.keyword;

        if (keyword == "") {
            return res
                .status(status.INTERNAL_SERVER_ERROR)
                .json(new APIResponse("Please Write Something", true, 400));
        } else {
            const datas = await blogData.aggregate([{
                $lookup: {
                    from: "users",
                    localField: "source_id",
                    foreignField: "_id",
                    as: "userdata",
                },
            },
            { $unwind: "$blog" },
            { $unwind: "$userdata" },
            {
                $match: {
                    source_id: ObjectId(req.params.id),
                    'blog.status': 'verified',
                    $or: [{
                        "blog.title": { $regex: `${keyword}` },
                    },
                    {
                        "blog.discription": { $regex: `${keyword}` },
                    },
                    {
                        "blog.category": { $regex: `${keyword}` },
                    },
                    {
                        "userdata.name": { $regex: `${keyword}` },
                    },
                    ],
                },
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "blog._id",
                    foreignField: "blog_id",
                    as: "comment",
                },
            },
            {
                $group: {
                    _id: { blog: "$blog", user: "$userdata.name", comment: { $cond: { if: { $isArray: "$comment" }, then: { $size: "$comment" }, else: "NA" } } },
                },
            },
            ]);

            const data = [];

            datas.map((ele) => {
                data.push(ele._id);
            });

            return res
                .status(status.OK)
                .json(new APIResponse("Blog Search", false, 200, data));
        }
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Something Went Wrong", true, 400, error.message));
    }
};

// Highest Blogs Top 10 User //
exports.highestUser = async (req, res) => {
    try {
        const data = await blogData.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "source_id",
                    foreignField: "_id",
                    as: "userdata",
                },
            },
            { $unwind: "$blog" },
            { $unwind: "$userdata" },
            {
                $match: {
                    "userdata.name": { $not: { $eq: "admin" } },
                    "blog.status": 'verified'
                },
            },
            {
                $group: {
                    _id: {
                        // blog: { $sum: { $cond: { "if": { "$eq": ["$blog.status", "verified"] }, then: 1, else: 0 } } },
                        blog: { $cond: { "if": { "$eq": ["$blog.status", "verified"] }, then: { $sum: 1 }, else: 0 } },
                        name: "$userdata.name",
                        image: "$userdata.image",
                        phone: "$userdata.phone",
                        username: "$userdata.username",
                    },
                    // "blog":{$sum:{$cond:{"if":{"$eq":["$blog.status","verified"]},then:1,else:0}}},
                    // "name": "$userdata.name",
                    // "email": "$userdata.email",
                    // "image": "$userdata.image",
                    // "phone": "$userdata.phone",
                    // "username": "$userdata.username",
                },
            },
            // {
            //     "$group": {
            //         "_id": "$name",
            //         "ups": { $sum: { $cond: { "if": { "$eq": ["$votes.action", "up"] }, then: 1, else: 0 } } },
            //         "not_ups": { $sum: { $cond: { "if": { "$ne": ["$votes.action", "up"] }, then: 1, else: 0 } } },
            //         "score": { $sum: { $cond: { "if": { "$eq": ["$votes.action", "up"] }, then: 1, else: -1 } } }
            //     }
            // }
        ]);
        // const detail = [];
        // huserblog.map((ele) => {
        //     detail.push(ele._id);
        // });

        // function custom_sort(a, b) {
        //     return b.blog - a.blog;
        // }
        // const new_data = detail.sort(custom_sort);
        // const data = detail.slice(0, 10);
        return res
            .status(status.OK)
            .json(new APIResponse("Profile Display", false, 200, data));
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(
                new APIResponse("TOP 10 User Not Display", true, 400, error.message)
            );
    }
};