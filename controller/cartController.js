const { ApiResponse } = require('../config/ApiResponse');
const Cart = require('../models/cart');
const CartProduct = require('../models/cartProduct');
const Product = require('../models/product');
const User = require('../models/user');
const APIError = require('../config/APIError');


module.exports.addProductToCart =async (req,res,next)=>{

    try {
        const {userId} = req.params;
        const { productId} = req.query;
        
        const user = await User.findByPk(userId);
        if(!user){
            return next( new APIError(401, "Unauthorised User"));

           
        }

        const product = await Product.findByPk(productId);
        if(!product){
            return next( new APIError(404, "Product Not Found"));


        }

        const isAlreadyInCart = await CartProduct.findOne({
            where:{
                productId:product.id,
                CartId:user.CartId,
                OrderId:null

            }
        });
        if(isAlreadyInCart){
            return next( new APIError(400, "Product already added in cart"));

        }

        const addedTocartProduct = await CartProduct.create({
            productId:product.id,
            CartId:user.CartId
        });

        if(!addedTocartProduct){
            return next( new APIError(500, "Due to some reason product not added in cart"));

        }

        const cart = await Cart.findOne({
            where:{
                id:user.CartId
            }
        });

        cart.totalPrice = Number(cart.totalPrice) + Number(product.price);
        cart.totalQty = (Number)(cart.totalQty) + 1;
        const updatedCart = await cart.save();


        if(!updatedCart){
            return next( new APIError(500, "Due to some reason cart not updated"));

        }
        return res.status(201).json(ApiResponse(true,{
            id:updatedCart.id,
            totalPrice:updatedCart.totalPrice,
            totalQty:updatedCart.totalQty
        },"Product added in cart successfully"))


    } catch (error) {
        return next( new APIError(500, "Something went wrong while adding product to the cart"));

    }
}

module.exports.viewCart = async(req,res,next)=>{
    try {
        const {userId} = req.params;
        const user = await User.findByPk(userId);
        if(!user){
            return next( new APIError(401, "Unauthorised User"));

        }

        const cart = await Cart.findOne({
            where:{
                id:user.CartId
            }
        });

        const allCartProducts = await productDetailInCart(user.CartId);
        if( !Cart || ! allCartProducts){
            return next( new APIError(500, "Due to some reason cart details not fetched"));

        }

        
        return res.status(200).json(ApiResponse(true,{
            id:cart.id,
            totalPrice:cart.totalPrice,
            totalQty:cart.totalQty,
            cartProducts:allCartProducts
        },"Cart detail fetched successfully"));


    } catch (error) {
        return next( new APIError(500, "something went wrong while fetching cart detail"));

        
    }
}

async function productDetailInCart (CartId){
    const cart_products = await CartProduct.findAll({
        where:{
            CartId,
            OrderId:null
        }
    });
    const res = [];
    cart_products.forEach((product)=>{
        res.push(product.productId);
    })

    const allCartProducts = await Product.findAll({
        where:{
            id:res
        }
    });


    return allCartProducts;

}



module.exports.removeCartProduct = async(req,res,next)=>{

    const {userId} = req.params;
    const { productId} = req.query;


    try {
        const user = await User.findByPk(userId);
            if(!user){
            return next( new APIError(401, "Unauthorised User"));

        }
        const product = await Product.findByPk(productId);
        if(!product){
            return next( new APIError(404, "Product not found"));


        }
        const productToBeUpdated= await CartProduct.findOne({
            where:{
                productId,
                CartId:user.CartId,
                OrderId:null
            }
        });

        if( !productToBeUpdated){
            return next( new APIError(404, "Product not found in cart"));

    
        }

        const cart = await Cart.findOne({
            where:{
                id:user.CartId
            }
        });
        cart.totalPrice = Number(cart.totalPrice) - (Number(product.price) * (Number)(productToBeUpdated.qty));
        cart.totalQty = (Number)(cart.totalQty)  - (Number)(productToBeUpdated.qty);
        const updatedCart = await cart.save();
        if(!updatedCart){
            return next( new APIError(500, "something went wrong while removing product from cart"));

        }
    
        const deletedProduct= await CartProduct.destroy({
            where:{
                productId,
                CartId:user.CartId,
                OrderId:null
            }
        });
        
    
        if(!deletedProduct){
            return next( new APIError(500, "something went wrong while removing product from cart"));

    
        }
    
        return res.status(200).json(ApiResponse(true,productToBeUpdated,"Product removed from cart successfully"));
    } catch (error) {
        return next( new APIError(500, "something went wrong while removing product from cart"));

    }
    
}

module.exports.updateQuantities = async(req,res,next)=>{
    const {userId} = req.params;
    const {productId, incr} = req.query;

    try {
        const user = await User.findByPk(userId);
            if(!user){
            return next( new APIError(401, "Unauthorised User"));

        }

        const product = await Product.findOne({
            where:{
                id:productId
            }
        })


        const productToBeUpdated= await CartProduct.findOne({
            where:{
                productId,
                CartId:user.CartId,
                OrderId:null
            }
        });


        if( !productToBeUpdated){
            return next( new APIError(404, "Product not found in cart"));
        }


        if(incr === 'true'){

            productToBeUpdated.qty = Number( productToBeUpdated.qty) + 1;
        }else{
            if(productToBeUpdated.qty==1){
                const deletedProduct= await CartProduct.destroy({
                    where:{
                        productId,
                        CartId:user.CartId,
                        OrderId:null
                    }
                });
                
            }else{
                
                productToBeUpdated.qty = Number( productToBeUpdated.qty) - 1;
            }
        }
        const updatedCartProductList = productToBeUpdated.save();
        if(!updatedCartProductList){
            return next( new APIError(500, "something went wrong while updating quantity"));

        }
      
        const cart = await Cart.findOne({
            where:{
                id:user.CartId
            }
        });
        if(incr === 'true'){

            cart.totalPrice = Number(cart.totalPrice) + Number(product.price);
            cart.totalQty = (Number)(cart.totalQty)  + 1;
        }else{
            cart.totalPrice = Number(cart.totalPrice) - Number(product.price);
            cart.totalQty = (Number)(cart.totalQty)  - 1;

        }
        const updatedCart = await cart.save();
        if(!updatedCart){
            return next( new APIError(500, "something went wrong while updating quantity"));

            
        }
    
        return res.status(200).json(ApiResponse(true,updatedCartProductList,`Quantity ${incr==='true'? "increases": "decreases"} successfully`));
        


    } catch (error) {
        return next( new APIError(500, "something went wrong while updating quantity"));  
    }
}

