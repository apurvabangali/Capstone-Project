const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// User Schema //
const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    gender: {
        type: String
    },
    phone: {
        type: String,
      
    },
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    image: {
        type: String,
    },
    path: {
        type: String,
    },
    tokens: [{
        token: {
            type: String
        }
    }]
}, {
    timestamps: true
});
userSchema.methods.generate = async function() {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.TOKEN_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error) {
        res.status(400).json({
            message: "token not generated..",
            status: 400
        })
    }
}

userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


module.exports = mongoose.model("User", userSchema);