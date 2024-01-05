const express = require('express');

const productRouter = express.Router();
const productController = require('./ProductsController');

const authController = require ('../users/AuthController')

productRouter.get('/', authController.protectSystem, authController.idAdmin , productController.getAllProducts);
productRouter.get('/:id', productController.getProductByID);
productRouter.post('/', productController.createProduct);
productRouter.put('/:id', productController.updateProduct);
productRouter.delete('/:id', productController.deleteProductById);

module.exports = productRouter;