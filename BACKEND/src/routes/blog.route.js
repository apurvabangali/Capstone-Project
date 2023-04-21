const router = require("express").Router();
const blogController = require("../controller/blog.controller");
const utils = require("../utils/image");

// Insert Blog //
router.post("/insert/:id", utils.upload, blogController.blogInsert);

// View Blog //
router.get("/view", blogController.ViewAll);
router.get("/pending", blogController.viewPending);
router.get("/verified", blogController.viewVerify);
router.get("/unverified", blogController.viewUnverify);
router.get("/viewAll/:id", blogController.viewUserBlog);
router.get("/views/:id", blogController.viewBlog);

// View Blog Categories Wise //
router.get("/news", blogController.viewNews);
router.get("/sport", blogController.viewSport);
router.get("/coding", blogController.viewCoding);
router.get("/other", blogController.viewOther);

// View Blog Categories Wise Search //
router.post("/nSearch", blogController.searchNews);
router.post("/sSearch", blogController.searchSport);
router.post("/cSearch", blogController.searchCodding);
router.post("/oSearch", blogController.searchOther);

// View Blog Categories Wise Short For Slide Bar//
router.get("/nSort", blogController.sortNews);
router.get("/sSort", blogController.sortSport);
router.get("/cSort", blogController.sortCoding);
router.get("/oSort", blogController.sortOther);

// Delete Blog //
router.post("/delete/:id", blogController.blogDelete);

// Update Blog //
router.post("/update/:id", utils.upload, blogController.blogUpdate);

// Like Blog //
router.post("/likeBlog/:id", blogController.likeBlog);

// Top 5 Blog //
router.get("/top", blogController.topBlog);

// Search API For Top 5 Blog //
router.post("/topSearch", blogController.topSearch);

// Top 5 Blog Short For SideBar //
router.get("/short", blogController.topShortBlog);

// Search Blog //
router.post("/search", blogController.searchBlog);

// Profile Blog Short For SideBar//
router.get("/profileBlog/:id", blogController.profileShort);

// Blog Status //
router.post("/status/:id",blogController.blogStatus);

module.exports = router;