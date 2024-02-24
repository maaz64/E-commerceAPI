
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db-config");
const CartProduct = require("./cartProduct");


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

// id , product_id ,user_id , order_id (unique) , qty  ,created_at , updated_at , total_price


Cart.hasMany(CartProduct);
CartProduct.belongsTo(Cart);



module.exports = Cart;
