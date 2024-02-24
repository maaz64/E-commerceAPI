const { DataTypes } = require("sequelize");
const sequelize = require("../config/db-config");

const Category = sequelize.define("Category", {

  id:{
    type: DataTypes.BIGINT,
    allowNull: false,
    autoIncrement:true,
    primaryKey:true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
 
});





module.exports = Category;
