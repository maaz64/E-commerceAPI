// importing required express
const express = require('express');
const { addProductToCart, viewCart, removeCartProduct, updateQuantities } = require('../controller/cartController');
const router = express.Router();

router.get('/:userId', viewCart);
router.post('/add-to-cart/:userId',addProductToCart);
router.delete('/remove/:userId',removeCartProduct);
router.put('/update-qty/:userId',updateQuantities);

module.exports = router;