const { DataTypes } = require("sequelize");
const sequelize = require("../config/db-config");

const Product = sequelize.define("Product", {

  id:{
    type: DataTypes.BIGINT,
    allowNull: false,
    autoIncrement:true,
    primaryKey:true,
    unique:true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  desc: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  availabilty:{
    type: DataTypes.BOOLEAN,
    defaultValue:true
  },

});




module.exports = Product;