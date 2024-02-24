// importing required express
const express = require('express');
const { getProductDetail } = require('../controller/productController');
const router = express.Router();


// router.get('/:id',getProductDetail);
router.get('/',getProductDetail);



module.exports = router;