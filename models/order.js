const { DataTypes } = require("sequelize");
const sequelize = require("../config/db-config");
const User = require('../models/user');
const Cart = require("./cart");

const Order = sequelize.define("Order", {

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





module.exports = Order;