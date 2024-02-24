// importing required express
const express = require('express');
const { getAllProductsOfACategory, getAllCategory } = require('../controller/categoryController');
const router = express.Router();


router.get('/:id',getAllProductsOfACategory);
router.get('/',getAllCategory);



module.exports = router;