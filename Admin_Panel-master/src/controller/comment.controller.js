const status = require('http-status');
const date = require('date-and-time')
const commentData = require("../module/comment.model");

// Add Comment //
exports.addComment = async (req, res) => {
    try {
        admin = req.adminUser;
        blog_ids = req.params.id;

        const now = new Date();
        const value = date.format(now, 'YYYY/MM/DD HH:mm:ss');
        const data = commentData({
            name: req.body.name,
            comment: req.body.comment,
            date: value,
            blog_id: req.params.id,
            source_id:admin._id
        })
        await data.save();
        return res.status(200).redirect(`/views/${blog_ids}`)
    } catch (error) {
        
        blog_ids = req.params.id;
        req.session.message = {
            type: "danger",
            intro: "Something Went Wrong!",
            message: "Comment Not Added.",
          };
         return res.status(400).redirect(`/views/${blog_ids}`);
       
    }
}

// Delete Comment //
exports.deleteComment = async (req, res) => {
    try {
        blog_id = req.params.bid
        _id = req.params.id //Comment Id//
        const data = await commentData.findByIdAndDelete({ _id });
        return res.status(200).redirect(`/views/${blog_id}`)
    } catch (error) {
        blog_id = req.params.bid;
        req.session.message = {
            type: "danger",
            intro: "Something Went Wrong!",
            message: "Comment Not Deleted.",
          };
         return res.status(400).redirect(`/views/${blog_id}`);
    }
}