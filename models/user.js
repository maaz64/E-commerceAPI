const { DataTypes } = require("sequelize");
const sequelize = require("../config/db-config");
const Cart = require("./cart");

const User = sequelize.define("User", {

  id:{
    type: DataTypes.BIGINT,
    allowNull: false,
    autoIncrement:true,
    primaryKey:true,
    unique:true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Cart.hasOne(User);
User.belongsTo(Cart);




module.exports = User;
