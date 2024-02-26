const Product = require("../models/product");
const Category = require("../models/category");
const { ApiResponse } = require("../config/ApiResponse");
const APIError = require("../config/APIError");

module.exports.addProduct = async (req, res,next) => {
  try {
    const { title, price, desc, category } = req.body;
    if (!title || !price || !desc || !category) {
      return next( new APIError(409, "All fields are required"));
    }

    const [categoryData, created] = await Category.findOrCreate({
      where: {
        title:category
      },
    });

    if (!categoryData) {
      return next( new APIError(502, "Something went wrong while creating category")); 
    }

    const addedProduct = await Product.create({
      title,
      price,
      desc,
      CategoryId:categoryData.id
    });

    if (!addedProduct) {
      return next( new APIError(502, "Product Not Added"));
    }
    return res.status(201).json(ApiResponse(true,addedProduct,"product added successfully"));
  } catch (error) {
    return next( new APIError(500, "Something went wrong while creating category"));
  }
};

module.exports.getProductDetail = async(req,res,next)=>{

  try {
    const {productId} = req.query;
    
    const product = await Product.findByPk(productId);
    if(!product){
      return next( new APIError(400, "Product Not Found"));
    }
    return res.status(200).json(ApiResponse(true,product,"Product detail fetched succesfully"))

  } catch (error) {
    return next( new APIError(500, "Something went wrong while fetching product detail"));
  }
}
