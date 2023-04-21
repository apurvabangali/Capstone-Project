const status = require('http-status');
const date = require('date-and-time')
const APIResponse = require("../helpers/APIResponse");
const commentData = require("../model/comment.model");

// Add Comment //
exports.addComment = async (req, res) => {
    try {
        const now = new Date();
        const value = date.format(now, 'YYYY/MM/DD HH:mm:ss');
        const data = commentData({
            name: req.body.name,
            comment: req.body.comment,
            date: value,
            blog_id: req.params.id,
            source_id: req.params.sid

        })
        await data.save();
        return res.status(status.OK).json(new APIResponse("Comment Add", false, 200, data));
    } catch (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).json(new APIResponse("Comment Not Add", true, 400, error.message))
    }
}

// View Comment //
exports.viewComment = async (req, res) => {
    try {
        blog_id = req.params.id
        const data = await commentData.find({ blog_id: blog_id }).sort({ "date": -1 }).limit(3);
        return res.status(status.OK).json(new APIResponse("Comment Add", false, 200, data));
    } catch (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).json(new APIResponse("Comment Not Add", true, 400, error.message))
    }
}

// Delete Comment //
exports.deleteComment = async (req, res) => {
    try {
        blog_id = req.params.id
        const findVal = await commentData.findOne({ blog_id: blog_id });
        
        _id = findVal._id.toString();
        const data = await commentData.findByIdAndDelete({ _id });
        return res.status(status.OK).json(new APIResponse("Comment Delete", false, 200));
    } catch (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).json(new APIResponse("Comment Not Add", true, 400, error.message))
    }
}

