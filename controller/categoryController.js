const Product = require("../models/product");
const Category = require("../models/category");
const { ApiResponse } = require("../config/ApiResponse");
const APIError = require('../config/APIError');


module.exports.getAllProductsOfACategory = async (req, res,next) => {
  const { id } = req.params;

  try {
    const categoryInDB = await Category.findOne({ where: { id } });
    if (!categoryInDB) {
      return next( new APIError(404, "Category not found "));

    }

    const products = await Product.findAll({
      where: { CategoryId : id },
    });

    if (!products) {
      return next( new APIError(404, "No Product Found"));
      

    }

    return res.status(200).json(ApiResponse(true,products,`All product belongs to the ${categoryInDB.title} category`));

  } catch (error) {
    return next( new APIError(500, "Something went wrong while fetching category products"));

  }
};

module.exports.getAllCategory = async(_,res,next)=>{

    try {

        const categories = await Category.findAll({});
        if (!categories) {
          return next( new APIError(404, "No Category Found "));

        }
        
        return res.status(200).json(ApiResponse(true,categories,"All Categories"));
        
    } catch (error) {
        return next( new APIError(500, "Something went wrong while fetching all categories"));
    }
}
