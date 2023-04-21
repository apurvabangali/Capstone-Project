const router = require("express").Router();
const middleware = require("../middleware/middleware");
const userData =require("../module/user.modul");
const blogController = require("../controller/blog.controller");
const userController = require("../controller/user.controller");
const commentController = require("../controller/comment.controller")
const contactController = require("../controller/contact.controller");
const utils = require("../utils/multer");

// ---------------------------------------- Admin Authentication ---------------------------------------- //

router.post("/login", userController.adminLogin);
router.get("/logout", middleware.verifyToken, userController.adminLogout);
router.get("/viewprofile/:id",middleware.verifyToken,userController.viewprofile);
router.post("/updateadmin/:id",userController.UpdateAdmin);
router.post("/updateAdminimage/:id",utils.upload, userController.AdminUpdateImage);
router.get("/deleteAdminImage/:id", userController.AdminDeleteImage);

// -----------------------------------Admin Manage User Authentication -----------------------------------//

router.post("/insertUser", userController.insertUser);
router.get("/viewUser", middleware.verifyToken,userController.viewUser);
router.get("/editUserProfile/:id", userController.editUserProfile);
router.post("/updateUser/:id", userController.updateUser);
router.get("/deleteUser/:id", userController.deleteUser);

// Admin User Imgae Routers //
router.post("/updateUserimage/:id",utils.upload, userController.updateImage);
router.get("/deleteuserImage/:id", userController.deleteImage);

// ---------------------------------------------- Dashboard --------------------------------------------- //
 
router.get("/dashboard", middleware.verifyToken,userController.dashdBoard)
router.get("/chartdashboard", middleware.verifyToken,userController.chartdashdBoard)
//Total Blog 
// Total User 
// Total Expert
// Top 10 Latest User
//Top 10 user whose uploaded most

// ------------------------------------------ Admin Mange Blogs ----------------------------------------- //

router.post("/insertBlog", middleware.verifyToken, utils.upload, blogController.blogInsert);
router.get("/viewVerifyBlog",middleware.verifyToken, blogController.ViewAllVerifyBlog);
router.get("/unverify", middleware.verifyToken,blogController.viewUnverify);

router.get("/viewAll/:id",middleware.verifyToken, blogController.blogViewAll);
router.get("/views/:id",middleware.verifyToken, blogController.blogView);
router.get("/editBlog/:id",middleware.verifyToken, blogController.ViewupdateBlog);//For update
router.post("/updateBlog/:id", utils.upload,blogController.blogUpdate);
router.post("/updatestatus/:id",blogController.blogStatus);
// Delete Blog //
router.get("/delete/:id", blogController.blogDelete);
// Top 10 Blog //
router.get("/top",middleware.verifyToken, blogController.topBlog);
// Search Verify Blog //
router.post("/search", middleware.verifyToken,blogController.searchBlog)
// Routes Search User Blog //
router.post("/searchUserAllBlogs", blogController.searchUserAllBlog);

// -----------------------------------View Blog Categorie Wise & Search ----------------------------------//

router.get("/news",middleware.verifyToken, blogController.viewNews);
router.get("/sport",middleware.verifyToken, blogController.viewSport);
router.get("/coding",middleware.verifyToken, blogController.viewCoding);
router.get("/other",middleware.verifyToken, blogController.viewOther);

router.post("/nSearch",middleware.verifyToken, blogController.searchNews);
router.post("/sSearch", middleware.verifyToken,blogController.searchSport);
router.post("/cSearch",middleware.verifyToken, blogController.searchCoding);
router.post("/oSearch",middleware.verifyToken, blogController.searchOther);

// ------------------------------------- Admin Mange Comment Routers -------------------------------------//
 
router.post("/addcomment/:id",middleware.verifyToken, commentController.addComment);
router.get("/deletecomment/:id/:bid", commentController.deleteComment);

// ------------------------------------------- Contact Routers ------------------------------------------ //

router.get("/viewAllcontect",middleware.verifyToken,contactController.viewAllContact)
router.get("/viewmessage/:id",middleware.verifyToken,contactController.viewContact)
router.get("/deletemessage/:id",contactController.deleteContact)

// --------------------------------------------- HBS Router --------------------------------------------- //

router.get("/", (req, res) => {
    res.render("login.hbs");
});

router.get("/All_blogs", middleware.verifyToken, (req, res) => {
    res.render("All_blogs.hbs");
});

router.get("/register", middleware.verifyToken, (req, res) => {
    res.render("register.hbs");
});

router.get("/CreateBlog", middleware.verifyToken, async(req, res) => {
    admin =  req.adminUser      
    const admindata = await userData.findById({_id:admin._id});

    res.render("CreateBlog.hbs",{admin:admindata});
});

router.get("/userprofile", middleware.verifyToken, (req, res) => {
    res.render("userprofile.hbs");
});

router.get("/Error", middleware.verifyToken,async (req, res) => {
    admin =  req.adminUser      
    const admindata = await userData.findById({_id:admin._id});
    res.render("ErrorPage.hbs",{admin:admindata});
});


module.exports = router;