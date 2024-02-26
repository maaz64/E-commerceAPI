const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('ecommerce_data', 'root', 'Abumaaz64@', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
  });

module.exports = sequelize;