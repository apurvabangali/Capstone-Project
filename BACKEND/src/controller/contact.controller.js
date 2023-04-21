const status = require('http-status');
const date = require('date-and-time');
const APIResponse = require("../helpers/APIResponse");
const contactData = require("../model/contact.model");
const validator = require("validator");

// Add Contact //
exports.addContact = async (req, res) => {
    try {
        const now  =  new Date();
        const value = date.format(now,'YYYY/MM/DD HH:mm:ss');
        const data = contactData({
            name:req.body.name,
            email:req.body.email,
            subject:req.body.subject,
            message:req.body.message,
            createDate:value,
        })

        if (!validator.isEmail(req.body.email)) {
            return res.json({
                message: "Please Give Email In Propper Formate"
            })
        }
        await data.save();
        return res.status(status.OK).json(new APIResponse("Record Inserted", false, 200, data))
    } catch (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).json(new APIResponse("Record Not Inserted", true, 400, error.message))
    }
};

// View Contact //
exports.viewAllContact = async (req, res) => {
    try {
        const data = await contactData.find({}).sort({"createDate":-1});
        return res.status(status.OK).json(new APIResponse("Record Display", false, 200, data))
    } catch (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).json(new APIResponse("Record Not Display", true, 400, error.message))
    }
};

// View By Id Contact //
exports.viewContact = async (req, res) => {
    try {
        const data = await contactData.findById({ _id: req.params.id });
        return res.status(status.OK).json(new APIResponse("Record Display", false, 200, data))
    } catch (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).json(new APIResponse("Record Not Display", true, 400, error.message))
    }
};

// Delete Contact //
exports.deleteContact = async (req, res) => {
    try {
        const data = await contactData.findByIdAndDelete({ _id: req.params.id });
        return res.status(status.OK).json(new APIResponse("Record Delete", false, 200))
    } catch (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).json(new APIResponse("Record Not Delete", true, 400, error.message))
    }
};