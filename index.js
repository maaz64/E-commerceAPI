require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./config/db-config')
const passport = require('passport');
const passportJWT = require('./config/passport-jwt');
const Category = require('./models/category');
const Product = require('./models/product');
const errorMiddleware = require('./config/errorMiddleware');

// defining port 
const port  = 8080 || process.env.port;

// using this middleware to decode forms data if its urlencode
app.use(express.urlencoded({extended:true}));

// using this middleware to decode forms data if the data is in json format
app.use(express.json());


Category.hasMany(Product);
Product.belongsTo(Category);


// creating tables in database
(async () => {
    await sequelize.sync();
    console.log("Connected to Database")
})();


// using routes
app.use('/api/',require('./routes/index'));
app.use(errorMiddleware);

// listening the server at port 8000
app.listen(port,(err)=>{

    if(err){
        console.log('Something went wrong while running server',err);
        return;
    }

    console.log("Server is up and running on port ",port);

})