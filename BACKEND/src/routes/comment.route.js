const router = require("express").Router();
const commentController = require("../controller/comment.controller");

// Comment Routes //
router.post("/add/:id/:sid", commentController.addComment);
router.get("/view/:id", commentController.viewComment);
router.delete("/delete/:id", commentController.deleteComment);

module.exports = router;