const Product = require("../models/product");
const Category = require("../models/category");
const { ApiResponse } = require("../config/ApiResponse");


module.exports.getAllProductsOfACategory = async (req, res) => {
  const { id } = req.params;

  try {
    const categoryInDB = await Category.findOne({ where: { id } });
    if (!categoryInDB) {
      return res.status(200).json(ApiResponse(true,200,{},"No such Category created",null));
    }

    const products = await Product.findAll({
      where: { CategoryId : id },
    });

    if (!products) {
      return res.status(200).json(ApiResponse(true,200,{},`No products belong to category ${categoryInDB.title}`,null));

    }

    return res.status(200).json(ApiResponse(true,200,products,`All product belongs to the ${categoryInDB.title} category`,null));

  } catch (error) {
    return res.status(500).json(ApiResponse(false,500,null,"Internal Server Error",error));   
  }
};

module.exports.getAllCategory = async(req,res)=>{

    try {

        const categories = await Category.findAll({});
        if (!categories) {
          return res.status(200).json(ApiResponse(true,200,{},"No Category Found",null));
        }
        
        return res.status(200).json(ApiResponse(true,200,categories,"All Categories",null));
        
    } catch (error) {
      return res.status(500).json(ApiResponse(false,500,null,"Internal Server Error",error));

    }
}
