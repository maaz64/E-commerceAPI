
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db-config");
const CartProduct = require("./cartProduct");
const Order = require("./order");


const Cart = sequelize.define("Cart", {

  id:{
    type: DataTypes.BIGINT,
    allowNull: false,
    autoIncrement:true,
    primaryKey:true,
  },
  totalQty: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:0
  },
  totalPrice:{
    type:DataTypes.DOUBLE,
    allowNull:false,
    defaultValue:0
  },
  
 
});


Cart.hasOne(Order);
Order.belongsTo(Cart);

Cart.hasMany(CartProduct);
CartProduct.belongsTo(Cart);


module.exports = Cart;
