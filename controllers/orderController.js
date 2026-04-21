const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product")
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");

exports.createOrder = asyncErrorHandler(async (req, res, next) => {
  const shippingAddress = req.body.shippingAddress;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart || cart.items.length === 0) {
    return next(new CustomError("Cart is empty", 400));
  }

  let orderItems = [];
  let totalPrice = 0;

  for (const item of cart.items) {
    const product = await Product.findById(item.product)

    if(!product) {
        return next(new CustomError("Product not found" , 404));
    }

    if(item.quantity > product.stock){
        return next(new CustomError("Out of stock" , 400));
    }

    orderItems.push({
      product: item.product,
      name: product.name,
      price: item.price,
      quantity: item.quantity,
    });
    totalPrice += item.price * item.quantity;
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    totalPrice,
    shippingAddress,
  });

  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  return res.status(201).json({
    status: "success",
    data: {
      order,
    },
  });
});
