const { ApiResponse } = require('../config/ApiResponse');
const Cart = require('../models/cart');
const CartProduct = require('../models/cartProduct');
const Product = require('../models/product');
const User = require('../models/user');

module.exports.addProductToCart =async (req,res)=>{

    try {
        const {userId} = req.params;
        const { productId} = req.query;
        
        const user = await User.findByPk(userId);
        if(!user){
            return res.status(401).json(ApiResponse(false,401,{},"Unauthorised User",null))
           
        }

        const product = await Product.findByPk(productId);
        if(!product){
            return res.status(200).json(ApiResponse(false,200,{},"No such product found",null))

        }

        const isAlreadyInCart = await CartProduct.findOne({
            where:{
                productId:product.id,
                CartId:user.CartId,
                OrderId:null

            }
        });
        if(isAlreadyInCart){
            return res.status(200).json(ApiResponse(true,200,{},"Product already added in cart",null))
        }

        const addedTocartProduct = await CartProduct.create({
            productId:product.id,
            CartId:user.CartId
        });

        if(!addedTocartProduct){
            return res.status(502).json(ApiResponse(false,502,{},"Product not added in Cart",null))
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
            return res.status(502).json(ApiResponse(false,502,{},"Cart not updated",null))
        }
        return res.status(201).json(ApiResponse(true,201,{
            id:updatedCart.id,
            totalPrice:updatedCart.totalPrice,
            totalQty:updatedCart.totalQty
        },"Product added in cart successfully",null))


    } catch (error) {
        return res.status(500).json(ApiResponse(false,500,null,"Something went wrong while adding product to the cart",error));
    }
}

module.exports.viewCart = async(req,res)=>{
    try {
        const {userId} = req.params;
        const user = await User.findByPk(userId);
        if(!user){
            return res.status(401).json(ApiResponse(false,401,{},"Unauthorised user",null))
        }

        const cart = await Cart.findOne({
            where:{
                id:user.CartId
            }
        });

        const allCartProducts = await productDetailInCart(user.CartId);
        if( !Cart || ! allCartProducts){
            return res.status(502).json(ApiResponse(false,502,{},"something went wrong while fetching cart products",null));
        }

        
        return res.status(200).json(ApiResponse(true,200,{
            id:cart.id,
            totalPrice:cart.totalPrice,
            totalQty:cart.totalQty,
            cartProducts:allCartProducts
        },"Cart detail fetched successfully",null));


    } catch (error) {
        return res.status(500).json(ApiResponse(false,500,null,"something went wrong while fetching cart detail",error))
        
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



module.exports.removeCartProduct = async(req,res)=>{

    const {userId} = req.params;
    const { productId} = req.query;


    try {
        const user = await User.findByPk(userId);
            if(!user){
                return res.status(401).json(ApiResponse(false,401,{},"Unauthorised user",null))
        }
        const product = await Product.findByPk(productId);
        if(!product){
            return res.status(200).json(ApiResponse(false,200,{},"No such product found",null))

        }
        const productToBeUpdated= await CartProduct.findOne({
            where:{
                productId,
                CartId:user.CartId,
                OrderId:null
            }
        });

        if( !productToBeUpdated){
            return res.status(502).json(ApiResponse(false,502,{},"No such product in cart",null))
    
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
            return res.status(502).json(ApiResponse(false,502,{},"Cart not updated",null))
        }
    
        const deletedProduct= await CartProduct.destroy({
            where:{
                productId,
                CartId:user.CartId,
                OrderId:null
            }
        });
        
    
        if(!deletedProduct){
            return res.status(502).json(ApiResponse(false,502,{},"Product not removed",null))
    
        }
    
        return res.status(200).json(ApiResponse(true,200,productToBeUpdated,"Product removed from cart successfully",null));
    } catch (error) {
        return res.status(500).json(ApiResponse(false,500,null,"something went wrong while removing product from cart",error))
    }
    
}

module.exports.updateQuantities = async(req,res)=>{
    const {userId} = req.params;
    const {productId, incr} = req.query;

    try {
        const user = await User.findByPk(userId);
            if(!user){
                return res.status(401).json(ApiResponse(false,401,{},"Unauthorised user",null))
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
            return res.status(502).json(ApiResponse(false,502,{},"No such product in cart",null))
    
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
            return res.status(502).json(ApiResponse(false,502,{},"Cart not updated",null))
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
            return res.status(502).json(ApiResponse(false,502,{},"Cart not updated",null))
        }
    
        return res.status(200).json(ApiResponse(true,200,updatedCartProductList,`Quantity ${incr==='true'? "increases": "decreases"} successfully`,null));
        


    } catch (error) {
        return res.status(500).json(ApiResponse(false,500,null,"something went wrong while updating quantity",error))
        
    }
}

// write a function that loop over cartProduct and give total price and total quantity;
// write a function that give all cartProduct detail instead of productId and also gives the quantity of every cartProduct
