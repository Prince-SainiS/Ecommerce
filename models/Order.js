const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true,
    },
    orderItems : [
        {
            product : {
                type : mongoose.Schema.ObjectId,
                ref : "Product",
                required : true
            },
            name : {
                type : String,
                required : true
            },
            price : {
                type : Number,
                required : true,
                min : 0
            },
            quantity : {
                type : Number,
                required : true,
                min : 1
            }
        }
    ],
    totalPrice : {
        type : Number,
        required : true,
        min : 0
    },
    orderStatus : {
        type : String,
        enum : ["pending" , "confirmed" , "shipped" , "delivered"],
        default : "pending"
    },
    paymentStatus : {
        type : String,
        enum : ["pending" , "paid" , "failed"],
        default : "pending"
    },
    shippingAddress : {
        address : {
            type : String,
            required : true
        },
        city : {
            type : String,
            required : true
        },
        postalCode : {
            type : String,
            required : true
        },
        country : {
            type : String,
            required : true
        },
    },
    deliveredAt  : Date,
    paidAt : Date
}, {timestamps : true})


module.exports = mongoose.model("Order" , orderSchema);