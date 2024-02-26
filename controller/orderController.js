const { ApiResponse } = require('../config/ApiResponse');
const Cart = require('../models/cart');
const CartProduct = require('../models/cartProduct');
const Order = require('../models/order');
const User = require('../models/user');
const Product = require('../models/product');
const APIError = require('../config/APIError');

async function productDetailInOrder (CartId,OrderId){
    const cart_products = await CartProduct.findAll({
        where:{
            CartId,
            OrderId
        }
    });
    const res = [];
    cart_products.forEach((product)=>{
        res.push(product.productId);
    })
    const allOrderedProduct = await Product.findAll({
        where:{
            id:res
        }
    });

    return allOrderedProduct;

}

module.exports.placeOrder = async(req,res,next)=>{

    try {
        const {userId} = req.params;
        const user = await User.findByPk(userId);
        if(!user){
            return next( new APIError(401, "Unauthorised User"));  
        }

        const cart = await Cart.findByPk(user.CartId);

        if(cart.totalPrice == 0 || cart.totalQty==0){
            return next( new APIError(400, "Cart is Empty!!! Add product before placing order"));
        }

        const order = await Order.create({
            totalPrice: cart.totalPrice,
            totalQty:cart.totalQty,
            CartId:user.CartId,
            UserId : user.id

        });
        cart.totalPrice = 0;
        cart.totalQty = 0;
        const clearCart = await cart.save();

        if(!order || !clearCart){
            return next( new APIError(502, "something went wrong while placing order"));

        }

        const updated = await CartProduct.update({
            OrderId: order.id
        },{
            where:{
                CartId:user.CartId,
                OrderId:null
            }
        });

        
        if(!updated){ 
            return next( new APIError(502, "something went wrong while placing order"));

        }
        const orderedProducts =await productDetailInOrder(cart.id, order.id);
        if(!orderedProducts){
            return next( new APIError(502, "something went wrong while placing order"));

        }

        return res.status(200).json(ApiResponse(true,{orderDetails:order,orderedProducts},"Order placed successfully"));
        
    } catch (error) {
        return next( new APIError(500, "something went wrong while placing order"));
    }
}

module.exports.getAllOrder = async(req,res,next)=>{

    try {

        const {userId} = req.params;
        const user = await User.findByPk(userId);

        if(!user){
            return next( new APIError(401, "Unauthorised User"));
        }

        const orders = await Order.findAll({
            where:{
                UserId : user.id
            }
        });

        if(!orders){
        return next( new APIError(500, "something went wrong while fetching orders"));

        }

        return res.status(200).json(ApiResponse(true,orders,"Orders fetched successfully"))
        
    } catch (error) {
        return next( new APIError(500, "something went wrong while fetching orders"));

        
    }
}


module.exports.getOrderDetail = async(req,res,next)=>{

    try {
        const {userId} = req.params;
        const {id} = req.query;
        const user = await User.findByPk(userId);

        if(!user){
            return next( new APIError(401, "Unauthorised User"));
        } 

        const order = await Order.findOne({
            where:{
                id,
                userId
            }
        });

        if(!order){
            return next( new APIError(404, "No such order recorded"));
        }

        const allOrderProducts = await productDetailInOrder(order.CartId,order.id);

        if(!allOrderProducts){
            return next( new APIError(500, "Something went wrong while fetching ordered products"));
        }



        return res.status(200).json(ApiResponse(true,{

            totalPrice:order.totalPrice,
            totalQty:order.totalQty,
            products:allOrderProducts
        },"Ordered Detail fetched successfully"))




    } catch (error) {
        return next( new APIError(500, "Something went wrong while fetching ordered products"));
    }
}