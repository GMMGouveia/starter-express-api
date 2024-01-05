const mongoose = require('mongoose');
var CurrentUser = require ('./UserModel');


//create user
exports.CreateUser = async function(req, res, next){
    try{
        let p1 = req.body;
        let newItem = await CurrentUser.create(p1);
        res.status(201).json({
            status:"succes",
            data: newItem
        })
    }
    catch(err){
        res.status(400).json({
            status:"fail",
            message: "error: " + err
        });
    }
};

//get user by id
exports.getUserById = function(req,res, next){
    let id = req.params.id;
    CurrentUser.find({_id:id}).then((data)=>{
        res.status(200).json({
            status:"success",
            data:data
        })
    }).catch((err)=>{
        res.status(404).json({
            status:"fail",
            message:"error: "+ err
        })
    })
};

//update user
exports.updateUserByID = function(req, res, next){
    let id = req.params.id;
    CurrentUser.findByIdAndUpdate(id, req.body, {new:true, runValidators:true})
    .then((data)=>{
        res.status(200).json({
            status:"succes",
            data: data
        })
    })
    .catch((err)=>{
        res.status(404).json({
            status:"fail",
            message: "error: " + err
        })
    })
}

//delete user
exports.deleteUserById = function(req, res, next){
    let id = req.params.id;
    CurrentUser.findByIdAndDelete(id).then((data)=>{
        res.status(404).json({
            status:"success",
            data: null
        })
    }) .catch((err)=>{
        res.status(404).json({
            status:"fail",
            message:"error: " + err
        })
    })
}

//get all users
exports.getUsers = async function(req, res, next){
    //filtering
    let queryObj = {...req.query};
    let withOutFields = ['page', 'sort', 'limit', 'fields'];
    withOutFields.forEach(el=>{
        delete queryObj[el];
    });

    //phase 2
    let strQuery = JSON.stringify(queryObj);
    strQuery = strQuery.replace(/\b(gte|gt|lte|lt)\b/g, match =>`$${match}`);
    queryObj = JSON.parse(strQuery);
    console.log(queryObj);
    let sort = "";
    let selected = "";

    if (req.query.sort){
        sort = req.query.sort.split(',').join(' ')//add mor sorts
    }

    if (req.query.sort){
        selected = req.query.fields.split(',').join(' ')//show fields
    }

    let limit = req.query.limit ||100;
    let page = req.query.page ||1;
    let skip = (page-1)*limit;
    let documents = await CurrentUser.countDocuments();
    if (skip>=documents){
        res.status(404).json({
            status:"fails",
            data:"no data on this page and limit"
        })
        return
    }

    CurrentUser.find(queryObj).skip(skip).limit(limit).select(selected).sort(sort).then((data)=>{
        res.status(200).json({
            status:"success",
            data:data
        })
    }).catch((err)=>{
        res.status(404).json({
            status:"fial",
            message:"error: " + err
        })
    })
}