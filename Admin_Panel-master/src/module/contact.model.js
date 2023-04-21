const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    subject: {
        type: String
    },
    message: {
        type: String
    },
    createDate:{
        type:String,
    }
})

module.exports = mongoose.model("Contact", contactSchema)