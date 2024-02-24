const { DataTypes } = require("sequelize");
const sequelize = require("../config/db-config");

const CartProduct = sequelize.define("CartProduct", {

  id:{
    type: DataTypes.BIGINT,
    allowNull: false,
    autoIncrement:true,
    primaryKey:true,
    unique:true,
  },
  qty: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:1,
  },
  productId:{
    type:DataTypes.BIGINT,
    allowNull:false
  },

 
});






module.exports = CartProduct;
