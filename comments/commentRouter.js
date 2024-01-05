const express = require('express');
var commentRouter = express.Router();

var commentController = require('./commentController');
var authController = require('../users/AuthController');

commentRouter.post('/',authController.protectSystem, commentController.createComment);
commentRouter.get('/', commentController.getAllComments);

module.exports = commentRouter;