require('dotenv').config();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ApiResponse } = require('../config/ApiResponse');
const Cart = require('../models/cart');
const APIError = require('../config/APIError');

module.exports.createUser =  async (req, res,next) => {
  try {

  
    const { username, email, password, confirm_password } = req.body;

    if(!username  || !email || !password){
        return next( new APIError(400, "All fields are required"))
    }

    if (password != confirm_password) {
        return next( new APIError(400, "password doesn't match")
)
    }

    const checkUserExisted = await User.findOne({ where: { email} });

    if(checkUserExisted){
      return next( new APIError(409, "User with email already exists"))
    }


    const cart = await Cart.create({})
    const saltRounds = 10;
    const hashPassword = await bcrypt.hashSync(password, saltRounds);
    const user = await User.create({
        username,
        email,
        password : hashPassword,
        CartId:cart.id
    });

    if(!user){
      return next( new APIError(500, "Something went wrong while registering the user"));
    }


    return res.status(201).json(ApiResponse(true,
    {
      id:user.id,
      username:user.username,
      email:user.email
    },
    "User created successfully"));
  } catch (error) {
    return next( new APIError(500, "Something went wrong while registering the user"));

  }

 
};

module.exports.login = async (req, res,next) => {
    try {
      const { email, password } = req.body;
      if(!email || !password){
        return next( new APIError(400, "All fields are required"))
      }

      const user = await User.findOne({ where: { email} })
      if (!user) {
        return next( new APIError(401, "Invalid Credentials"));
      }
      
      const isPassMatch = await bcrypt.compare(password, user.password);
  
      if (!isPassMatch) {
        return next( new APIError(401, "Email/Password doesn't match"));
      }
  
      const token = jwt.sign({ email }, process.env.SECRETKEY, {
        expiresIn: "1h",
      });
  
      if(!token){
        return next( new APIError(500, "Token Not Created"));

      }
      return res.status(200).json(ApiResponse(true,
        {
          id:user.id,
          username: user.username,
          userId: user.userId,
          token,
        },"Sign In Successfull"));


    } catch (error) {
      return next( new APIError(500, "Internal Server Error",error));
    }
  };


 


