const express = require('express');
var userRouter = express.Router();
var userController = require ('./UserController');
var authController = require ('./AuthController');

userRouter.post('/signup', authController.signUp);
userRouter.post('/login', authController.login);
userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.put('/resetPassword/:token', authController.resetPassword);
userRouter.put('/updateMyPassword', authController.protectSystem, authController.updatePassword);
userRouter.put('/deleteMe', authController.protectSystem, authController.deleteMe)

userRouter.post('/', userController.CreateUser);
userRouter.get('/:id', userController.getUserById);
userRouter.put('/:id', userController.updateUserByID);
userRouter.delete('/:id', userController.deleteUserById);

module.exports = userRouter;