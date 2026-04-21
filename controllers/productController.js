const Product = require("../models/Product");
const APIFeatures = require("../utils/APIFeatures");
const mongoose = require("mongoose");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");

exports.createProduct = asyncErrorHandler(async (req, res, next) => {
  req.body.createdBy = req.user._id;

  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      product: newProduct,
    },
  });
});

exports.getAllProducts = asyncErrorHandler(async (req, res, next) => {
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // 6. Execute
  const products = await features.query;

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products: products,
    },
  });
});

exports.getSingleProduct = asyncErrorHandler(async (req, res, next) => {
  const id = req.params.id;

  // Check valid ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new CustomError("Invalid product ID", 400));
  }

  const product = await Product.findById(id);

  // If not found
  if (!product) {
    return next(new CustomError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.updateProduct = asyncErrorHandler(async (req, res, next) => {
  const id = req.params.id;

  // Check valid ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new CustomError("Invalid product ID", 400));
  }

  const options = {
    new: true,
    runValidators: true,
  };

  const product = await Product.findByIdAndUpdate(id, req.body, options);

  // Not found
  if (!product) {
    return next(new CustomError("Product not found!!", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.deleteProduct = asyncErrorHandler(async (req, res, next) => {
  const id = req.params.id;

  // Check valid ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new CustomError("Invalid product ID", 400));
  }

  const product = await Product.findByIdAndDelete(id);

  // Not found
  if (!product) {
    return next(new CustomError("Product not found!!", 404));
  }

  res.status(204).json({
    status: "success",
    data : null
  });
});
