const router = require("express").Router();
const contactController = require("../controller/contact.controller");

// Contact Routers //
router.post("/insert",contactController.addContact);
router.get("/view",contactController.viewAllContact)
router.get("/view/:id",contactController.viewContact)
router.delete("/delete/:id",contactController.deleteContact)

module.exports = router;