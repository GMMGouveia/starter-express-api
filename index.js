const express = require ('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const commentRouter = require('./comments/commentRouter');
const userRouter = require('./users/UserRouter');
const productRouter = require('./products/ProductsRouter');
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/comments', commentRouter);

const conection = "mongodb+srv://goncalomGouveia:Gouveia12345@techof.00ekxg0.mongodb.net/Armazem?retryWrites=true&w=majority"

mongoose.connect(conection,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const port = 3000
//routes

app.listen(port);