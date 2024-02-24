const Product = require("../models/product");
const Category = require("../models/category");
const { ApiResponse } = require("../config/ApiResponse");

module.exports.addProduct = async (req, res) => {
  try {
    const { title, price, desc, category } = req.body;
    if (!title || !price || !desc || !category) {
      
      return res.status(409).json(ApiResponse(false,409,{},"All fields are required",null));

    }

    const [categoryData, created] = await Category.findOrCreate({
      where: {
        title:category
      },
    });

    if (!categoryData) {
      return res.status(502).json(ApiResponse(false,502,{},"Something went wrong while creating category",null));
      
    }

    const addedProduct = await Product.create({
      title,
      price,
      desc,
      CategoryId:categoryData.id
    });

    if (!addedProduct) {
      return res.status(502).json(ApiResponse(false,502,{},"Product Not Added",null));

    }
    return res.status(201).json(ApiResponse(true,201,addedProduct,"product added successfully",null));
  } catch (error) {
    return res.status(500).json(ApiResponse(false,500,null,"Internal Server Error",error));
    
  }
};

module.exports.getProductDetail = async(req,res)=>{

  try {
    const {productId} = req.query;
    
    const product = await Product.findByPk(productId);
    if(!product){

      return res.status(200).json(ApiResponse(true,200,{},"No Product Found",null));

    }
    return res.status(200).json(ApiResponse(true,200,product,"Product detail fetched succesfully",null))

  } catch (error) {
    return res.status(500).json(ApiResponse(false,500,null,"Internal Server Error", error))
  }
}
