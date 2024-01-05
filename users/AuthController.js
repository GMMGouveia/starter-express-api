const mongoose = require('mongoose');
const User = require('./UserModel');
let jwt = require ('jsonwebtoken');
let config = require ('../config');
const {promisify} = require ('util');
const sendEmail = require ('./email')

exports.signUp = function(req, res, next){
    var newUser = new User(req.body);
    newUser.created = new Date();
    newUser.modified = new Date();
    newUser.save().then((user)=>{
        let token = jwt.sign({id:user_id}, config.secrets.jwt,{expiresIn:config.expireTime})
        res.status(201).json({
            status:"success",
            token,
            user:user
        })
    }).catch( (err)=>{
        res.status(400).json({
            status:"fail",
            message:"error: " + err
        })
    })
};

exports.login = function (req, res, next){
    let {email, password} = req.body;
    if (!email || !password){
        res.status(400).send('you need email and password');
        return;
    }

    User.findOne({email:email}).then((user)=>{
        if (!user){
            res.status(401).send('No user with the given username');
            return;
        } else {
            if(!user||!user.authenticate(password)){
                res.status(401).send('wrong password');
                return;
            } else{
                let token = signToken(user._id);
                res.status(200).json({
                    status:"success",
                    token: token
                });
            }
        }
    })
};

let signToken = id =>{
    return jwt.sign({
        id:id
    },
    config.secrets.jwt,{
        expiresIn: config.expireTime
    })
};

exports.protectSystem = async function (req,res,next){
    let token = "";
    arrAuthorization = req.headers.authorization.split(' ');
    if (arrAuthorization[0] == 'Bearer' && arrAuthorization[1]){
        token = arrAuthorization[1];
        console.log(token)
        if (!token){
            res.status(401).json({
                fail:"you are not login again"
            })
        }
    }

    let decoded = "";
    try {
        decoded = await promisify(jwt.verify)(token, config.secrets.jwt)
        console.log(decoded)
    } catch(err){
        console.log(err);
        res.status(401).json({
            fail:"verification token failed please login again" + err
        })
        return
    }

    const CurrentUser = await User.findById(decoded.id)
    console.log(CurrentUser);
    if(!CurrentUser){
        res.status(401).json({
            fail:"User not login please login again"
        });
        return
    }

    if(CurrentUser.changePasswordAfter(decoded.iat)){
        res.status(401).json({
            fail:"User changed passwords, please login again"
        });
        return;
    }
    req.user = CurrentUser;
    next();
};

exports.idAdmin = function(req, res, next){
    if(req.user && req.user.permission && req.user.permission == 'admin'){
        next();
    } else {
        res.status(401).json({
            message:"you don't have permission"
        });
    }
}

exports.forgotPassword = async function(req, res, next){
    let user = await User.findOne({
        email:req.body.email
    })
    if(!user){
        res.status(404).json({
            message:"please send email"
        })
        return
    }

    try {
        let resetToken = user.createNewPasswordToken()
        await user.save({validateBeforeSave:false})
        let resetUrl = req.protocol + "://" + req.get('host') + "/api/users/resetPassword/" + resetToken;
        let message = "click here to make new password: " + resetUrl;
        await sendEmail ({
            email:user.email, 
            subject:'your password reset token',
            message
        })
        res.status(200).json({
            status:"success",
            message:"token sent to your email"
        })
    }
    catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false})
        res.status(500).json({
            status:"failed",
            message:"error sending email",
        })
    }
}

exports.resetPassword = async function(req, res, next){
    let user = await User.findOne({
        passwordResetToken:req.params.token,
        passwordResetExpires:{$gt:Date.now()}
    })
    if(!user){
        res.status(404).json({
            status:"failed",
            message:"invalid token"
        })
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    let token = signToken(user._id)
    res.status(200).json({
        status:"success",
        message: token
    });
}

exports.updatePassword = async function (req, res, next){
    let user = await User.findById(req.user._id);
    if(!(await user.matchPassword(req.body.currentPassword))){
        res.status(401).json({
            status:"failed",
            message:"password not correct"
        })
        return
    }
    user.password = req.body.password
    await user.save()
    let token = signToken(user._id);
    res.status(200).json({
        status:"success",
        token: token
    });
}

exports.updateMe = async function(req, res, next){
    if (req.body.password){
        res.status(400).json({
            status:"failed",
            message:"can't update password from here"
        });
        return
    }

    let filterBody = allowedObj(req.body, 'firstName', 'lastName', 'email');
    let user = await User.findByIdAndUpdate(req.user._id, filterBody, {new:true, runValidators:true})
    res.status(200).json({
        status:"success",
        user: user
    });
};

let allowedObj = function(obj,...allowedFields){
    let newObj = {};
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)){
            newObj[el] = obj[el]
        }
    });
    return newObj;
}

exports.deleteMe = async function( req, res, next){
    let user = await User.findByIdAndUpdate(req.user._id, {active:false})
    res.status(204).json({
        status:"success",
        user: null
    });
}