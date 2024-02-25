const { DataTypes } = require("sequelize");
const sequelize = require("../config/db-config");
const Cart = require("./cart");
const Order = require("./order");

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



Order.hasMany(CartProduct);
CartProduct.belongsTo(Order);






module.exports = CartProduct;
