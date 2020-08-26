const catchAsync = require("./../utils/catchAsync")
const {User} = require('./../model/user');
const _ = require("lodash");
const AppError = require("../utils/appError");
const levels = require("config").get("levels")

exports.loginByCredentials = catchAsync(async(req, res, next) => {
    if(_.isEmpty(req.body) || !req.body.email || !req.body.password) {
        return next(new AppError("Parameters missing", 402));
    }

    const user = await User.findOne({ email: req.body.email }).select("+password")
    if(!_.isEmpty(user)) {
        const checkPassword = await user.comparePassword(req.body.password,user.password)
        if(checkPassword) {
            const token = user.generateToken(res);
            return res.status(200).json({
                status: "success",
                data: {..._.pick(user, ["email","_id"])},
                token
            })
        }
        else {
            return res.status(401).json({
                status: "failure",
                reason: "Incorrect password"
            })
        }
    }
    else {
        return res.status(404).json({
            status: "failure",
            reason: "User doesn't exist"
        })
    }
})

exports.createUser = catchAsync(async(req, res, next) => {
    if(_.isEmpty(req.body) || !req.body.email || !req.body.password) {
        return next(new AppError("Parameters missing", 402));
    }

    const user = await User({
        email: req.body.email,
        password: req.body.password,
        level: Object.values(levels).indexOf(req.body.level*1) > -1 ? req.body.level : levels.BASIC 
    }).save()
    
    if(!_.isEmpty(user)) {
        const token = user.generateToken(res);
        return res.status(200).json({
            status: "success",
            data: {..._.pick(user, ["email","_id"])},
            token
        })
    }
    else {
        return next(new AppError(user, 400))
    }
})