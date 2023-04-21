const multer = require("multer");

// set storage engine//
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./src/public/image");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
})

exports.upload = multer({
    storage: storage,
    limits: { fileSize: 6000000 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
            cb(null, true)
        } else {
            cb(null, true)
            return cb(new Error('Only JPG,JPEG and PNG File Is Aloud'));
        }
    }
}).single('image');