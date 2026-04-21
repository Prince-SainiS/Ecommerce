const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError")
const Order = require("../models/Order");
const Product = require("../models/Product")

exports.confirmPayment = asyncErrorHandler( async(req, res, next)  => {
   const {orderId } = req.body;
   

   const order =await Order.findById(orderId);

   if(!order){
    return next(new CustomError("No order found!!" , 404))
   }

   if(order.paymentStatus === "paid"){
    return next(new CustomError("Already paid" , 400))
   }

   
//    reduce stock
   for(const item of order.orderItems){
    const updatedProduct = await Product.findOneAndUpdate(
        {_id : item.product , stock : {$gte : item.quantity}},
        {$inc : {stock : -item.quantity}},
        {new : true}
    )

    if(!updatedProduct){
        return next(new CustomError(`Not enough stock for product ${item.product}` , 400))
    }
   }

//    updated order
   order.paymentStatus = "paid";
   order.orderStatus = "confirmed";
   order.paidAt = Date.now();

   await order.save();

   res.status(200).json({
    status : "success",
    data : {
        order
    }
   })
})