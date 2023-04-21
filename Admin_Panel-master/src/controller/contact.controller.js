
const date = require('date-and-time')
const userData = require("../module/user.modul")
const contactData = require("../module/contact.model");

// View Contact //
exports.viewAllContact = async (req, res) => {
    try {
        admin = req.adminUser
        const admindata = await userData.findById({ _id: admin._id });
        const data = await contactData.find({}).sort({"createDate":-1});
        return res.status(200).render("ContectUs",{records: data,admin: admindata})
    } catch (error) {
        req.session.message = {
            type: "danger",
            intro: "Something Went Wrong!",
            message: "Can Not View Expert Page.",
          };
          res.status(400).redirect("/Error");
        
    }
};

// View By Id Contact //
exports.viewContact = async (req, res) => {
    try {
        admin = req.adminUser
        const admindata = await userData.findById({ _id: admin._id });

        const data = await contactData.findById({ _id: req.params.id });
        return res.status(200).render("Contectview",{records: data,admin: admindata})
    } catch (error) {
        req.session.message = {
            type: "danger",
            intro: "Something Went Wrong!",
            message: "Can Not View Expert Message.",
          };
        return res.status(400).redirect("/viewAllcontect");
        
    }
};

// Delete Contact //
exports.deleteContact = async (req, res) => {
    try {
        
        const data = await contactData.findByIdAndDelete({ _id: req.params.id });
        return res.status(200).redirect("/viewAllcontect")
    } catch (error) {
        let _id=req.params.id
        req.session.message = {
            type: "danger",
            intro: "Something Went Wrong!", 
            message: "Message Not Deleted.",
          };
        return res.status(400).redirect(`/viewmessage/${_id}`);
        
    }
};