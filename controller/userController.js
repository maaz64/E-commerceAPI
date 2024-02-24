require('dotenv').config();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ApiResponse } = require('../config/ApiResponse');
const Cart = require('../models/cart');

// function to create user in database
module.exports.createUser = async (req, res) => {
  try {

    // destructuring the forms data from req.body
    const { username, email, password, confirm_password } = req.body;

    //  checking if username or phone number or password is not null
    if(!username  || !email || !password){
        return res.status(401).json(ApiResponse(false,401,{},"All fields are required",null));
    }

    // checking password and confirm password are same or not
    if (password != confirm_password) {
        return res.status(401).json(ApiResponse(false,401,{},"password doesn't match",null));

      }

    // checking if the user with given email is already registered or not
    const checkUserExisted = await User.findOne({ where: { email} });

    if(checkUserExisted){
      return res.status(409).json(ApiResponse(false,409,{},"User already registered",null));
    }

    // encrypting the password before storing it in database using bcrypt
    const cart = await Cart.create({})
    const saltRounds = 10;
    const hashPassword =await bcrypt.hashSync(password, saltRounds);
    const user = await User.create({
        username,
        email,
        password : hashPassword,
        CartId:cart.id
    });

    if(!user){
      return res.status(401).json(ApiResponse(false,401,{},"User not created",null));

    }


    return res.status(201).json(ApiResponse(true,201,
    {
      id:user.id,
      username:user.username,
      email:user.email
    },
    "User created successfully",null));
  } catch (error) {
    return res.status(500).json(ApiResponse(false,500,null,"Internal Server Error",error));
  }

 
};


// function to authenticate user using passport-jwt strategy 
module.exports.login = async (req, res) => {
    try {
      // destructuring the forms data from req.body
      const { email, password } = req.body;
      if(!email || !password){
        return res.status(401).json(ApiResponse(false,401,{},"All fields are required",null));

      }
      
      // checking user with the given phone number existed or not in database
      const user = await User.findOne({ where: { email} })
      if (!user) {
        return res.status(401).json(ApiResponse(false,401,{},"Invalid Credentials",null));

      }
      
      // compairing password
      const isPassMatch = await bcrypt.compare(password, user.password);
  
      if (!isPassMatch) {
        return res.status(401).json(ApiResponse(false,401,{},"Email/Password doesn't match",null));

      }
  
      //  generating token using jsonwebtoken(jwt)
      const token = jwt.sign({ email }, process.env.SECRETKEY, {
        expiresIn: "1h",
      });
  
      if(!token){
        return res.status(500).json(ApiResponse(false,500,{},"Token Not Created",null));
      }
      return res.status(200).json(ApiResponse(true,200,
        {
          id:user.id,
          username: user.username,
          userId: user.userId,
          token,
        },"Sign In Successfull",null));


    } catch (error) {
      return res.status(500).json(ApiResponse(false,500,null,"Internal Server Error",error));
    }
  };


 


