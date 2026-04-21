const Product = require("../models/Product");
const Cart = require("../models/Cart");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");

exports.addToCart = asyncErrorHandler(async (req, res, next) => {
  const productId = req.body.productId;
  const quantity = req.body.quantity;

  if (quantity <= 0) {
    return next(new CustomError("quantity can't be less then zero", 400));
  }

  const product = await Product.findById(productId);

  if (!product) {
    return next(new CustomError("No such product found", 404));
  }

  if (quantity > product.stock) {
    return next(new CustomError("Not much in inventory", 400));
  }

  const price = product.price;

  let cart = await Cart.findOne({ user: req.user._id });

  // creating new cart
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [
        {
          product: productId,
          quantity,
          price,
        },
      ],
      totalPrice: price * quantity,
    });
  } else {
    const item = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (item) {
      if (item.quantity + quantity > product.stock) {
        return next(new CustomError("Not enough stock", 400));
      }
      item.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price,
      });
    }
  }

  cart.totalPrice = sum(cart.items);

  await cart.save();

  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});

function sum(items) {
  let total = 0;
  items.forEach((item) => {
    total = total + item.price * item.quantity;
  });
  return total;
}

exports.getCart = asyncErrorHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(200).json({
      status: "success",
      data: {
        cart: {
          items: [],
          totalPrice: 0,
        },
      },
    });
  }
  await cart.populate({ path: "items.product", select: "name price category" });

  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});

exports.removeFromCart = asyncErrorHandler(async (req, res, next) => {
  const productId = req.params.id;

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new CustomError("can't delete from empty cart", 404));
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() != productId,
  );

  cart.totalPrice = sum(cart.items);

  await cart.save();

  return res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});

exports.updateCartItem = asyncErrorHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

    // quantity can't be negitive
  if (quantity <= 0) {
    return next(new CustomError("Quantity cannot be negitive", 400));
  }

  let cart = await Cart.findOne({ user: req.user._id });

//   if no cart then shwo error
  if (!cart) {
    return next(new CustomError("Cart not found", 404));
  }

//   locating product in cart
  const item = cart.items.find((item) => (
    item.product.toString() === productId
  ));

//   checking if product present in cart
  if (!item) {
    return next(new CustomError("product not in cart", 404));
  }

  const product = await Product.findById(productId);
  if (!product) {
  return next(new CustomError("Product not found", 404));
}

//   checking if the stock is avialable
  if (quantity > product.stock) {
    return next(new CustomError("Not enough stock", 400));
  }

//   updating quantity and totalprice
  item.quantity = quantity;

  cart.totalPrice = sum(cart.items);

//   save changes in database
  await cart.save();

  return res.status(200).json({
    status: "success",
    data: {
        cart
    } ,
  });
});
