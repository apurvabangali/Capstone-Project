const router = require("express").Router();
const userController = require("../controller/user.controller");
const utils = require("../utils/image");

// Routes Auth //
router.post("/register", userController.userRegister);
router.post("/login", userController.userLogin);

// Routes Forgot Password //
router.post("/sendEmail", userController.sendEmail);
router.post("/forgotPass", userController.forgotPassword);

// Routes CRUD //
router.get("/view", userController.ViewAllUser);
router.get("/view/:id", userController.ViewUserById)
router.post("/update/:id", utils.upload, userController.updateUser);

// Routes Image //
router.post("/uploadImage/:id", utils.upload, userController.uploadImage);
router.post("/updateImage/:id", utils.upload, userController.updateImage);
router.post("/deleteImage/:id", userController.deleteImage);

// Routes Profile //
router.get("/profile/:id", userController.profile)

// Routes Top 10 User //
router.get("/top", userController.topUser);

// Routes Search User Blog //
router.post("/search/:id", userController.searchBlog);

// Routes Highest Blogs Top 10 User //
router.get("/highest", userController.highestUser);

module.exports = router;