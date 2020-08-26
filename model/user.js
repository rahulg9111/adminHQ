const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const levels = require("config").get("levels")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

let userSchema = new mongoose.Schema({
    email:{
        required: [true,'Email is required.'],
        unique: true,
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        trim: true,
        required: [true,'Password is required'],
        minlength: 6,
        select: false
    },
    level:{
        type: Number,
        required: true,
        default: levels.BASIC
    },
    created_at:{
        type: Date,
        default: Date.now
    }
});

userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.generateToken = function(res){
    const token = jwt.sign({ _id: this._id, level: this.level }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    const options = {
        expires: new Date( Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 ),
        httpOnly: true,
        // secure: process.env.NODE_ENV=='production' ? true : false
        secure: false
    }
    res.cookie('jwtToken',token,options)
	return token;
}

userSchema.methods.comparePassword = async function(enteredPassword,password){
    return await bcrypt.compare(enteredPassword,password); 
}

userSchema.methods.encryptPassword = async function(password){
    return await bcrypt.hash(password,10);
}

const User = mongoose.model(require("config").get("tables")['TABLE_1'], userSchema);

exports.User = User;