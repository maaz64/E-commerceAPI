// importing required express
const express = require('express');
const { placeOrder, getAllOrder, getOrderDetail } = require('../controller/orderController');
const router = express.Router();


router.post('/:userId',placeOrder);
router.get('/all-order/:userId',getAllOrder);
router.get('/:userId',getOrderDetail);

module.exports = router;