const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    name: {
        type: String
    },
    comment: {
        type: String
    },
    date:{
        type:String
    },
    blog_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    },
    source_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }
});

module.exports = mongoose.model("Comment", commentSchema)