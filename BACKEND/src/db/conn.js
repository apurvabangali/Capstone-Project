const mongoose = require("mongoose");

mongoose.connect(process.env.CONNECT_KEY)
    .then(() => {
        console.log("Database Connected");
    }).catch((err) => {
        console.log(err);
    })