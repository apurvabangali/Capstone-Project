const mongoose = require("mongoose");

// Blog Schema //
const blogSchema = new mongoose.Schema({
    source_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    blog:[{
        title: {
            type: String
        },
        image: {
            type: String
        },
        path:{
            type:String,    
        },
        category:{
            type:String,
            default:'other'
        },
        discription: {
            type: String
        },
        like:{
            type: Number,
            default: 0
        },
        status:{
            type:String,
            default:'pending'
        },
        createDate:{
            type:String,
        }
    }]
});

module.exports = mongoose.model("Blog", blogSchema);