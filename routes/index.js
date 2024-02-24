// importing required express
const express = require('express');
const router = express.Router();

// importing user controller
const {createUser, login} = require('../controller/userController');
const { addProduct } = require('../controller/productController');



router.use('/product',require('./product'));
router.use('/categories', require('./category'));
router.use('/cart', require('./cart'));

// route for Creating user / SignUp
router.post('/create-user',createUser);

// route for Authenticating user / Login
router.post('/login',login)

router.post('/add-product',addProduct);



module.exports = router;