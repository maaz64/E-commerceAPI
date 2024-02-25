const { ApiResponse } = require('../config/ApiResponse');
const Cart = require('../models/cart');
const CartProduct = require('../models/cartProduct');
const Order = require('../models/order');
const User = require('../models/user');
const Product = require('../models/product');

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

module.exports.placeOrder = async(req,res)=>{

    try {
        const {userId} = req.params;
        const user = await User.findByPk(userId);
        if(!user){
            return res.status(401).json(ApiResponse(false,401,{},"Unauthorised User",null))
           
        }

        const cart = await Cart.findByPk(user.CartId);

        if(cart.totalPrice == 0 || cart.totalQty==0){
            return res.status(200).json(ApiResponse(true,200,{},"Cart is Empty!!! Add product before placing order", null));

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
            return res.status(502).json(ApiResponse(false,502,{},"something went wrong while placing order", null));
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
            return res.status(502).json(ApiResponse(false,502,{},"something went wrong while placing order", null));    
        }
        const orderedProducts =await productDetailInOrder(cart.id, order.id);
        if(!orderedProducts){
            return res.status(502).json(ApiResponse(false,502,{},"something went wrong while placing order", null));    
        }

        return res.status(200).json(ApiResponse(true,200,{orderDetails:order,orderedProducts},"Order placed successfully", null));
        
    } catch (error) {

        return res.status(500).json(ApiResponse(false,500,null,"something went wrong while placing order", error));

        
    }
}

module.exports.getAllOrder = async(req,res)=>{

    try {

        const {userId} = req.params;
        const user = await User.findByPk(userId);

        if(!user){
            return res.status(401).json(ApiResponse(false,401,{},"Unauthorised User",null))
           
        }

        const orders = await Order.findAll({
            where:{
                UserId : user.id
            }
        });

        if(!orders){
            return res.status(502).json(ApiResponse(false,502,{},"Something went wrong while fetching orders",null))   
        }

        return res.status(200).json(ApiResponse(true,200,orders,"Orders fetched successfully",null))
        
    } catch (error) {
        return res.status(500).json(ApiResponse(false,500,null,"Something went wrong while fetching orders",error))
        
    }
}


module.exports.getOrderDetail = async(req,res)=>{

    try {
        const {userId} = req.params;
        const {id} = req.query;
        const user = await User.findByPk(userId);

        if(!user){
            return res.status(401).json(ApiResponse(false,401,{},"Unauthorised User",null))
           
        } 

        const order = await Order.findOne({
            where:{
                id,
                userId
            }
        });

        if(!order){
            return res.status(404).json(ApiResponse(false,404,{},"No such order recorded",null))

        }

        const allOrderProducts = await productDetailInOrder(order.CartId,order.id);

        if(!allOrderProducts){
            return res.status(502).json(ApiResponse(false,502,{},"something went wrong while fetching ordered products",null))

        }



        return res.status(200).json(ApiResponse(true,200,{

            totalPrice:order.totalPrice,
            totalQty:order.totalQty,
            products:allOrderProducts
        },"Ordered Detail fetched successfully",null))




    } catch (error) {
        return res.status(500).json(ApiResponse(false,500,null,"Something went wrong while getting order details",error))
        
    }
}