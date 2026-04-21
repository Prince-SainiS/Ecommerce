const express = require("express")
const { restrictTo, protect } = require("../middleware/authMiddleware")
const { createProduct, getAllProducts, getSingleProduct, updateProduct , deleteProduct } = require("../controllers/productController");
const { addToCart, getCart, removeFromCart, updateCartItem } = require("../controllers/cartController");
const { createOrder } = require("../controllers/orderController");

const router = express.Router()

router.get("/" , getAllProducts);
router.post("/" ,protect ,  restrictTo("admin") , createProduct);
router.get("/cart" ,protect , getCart );
router.get("/:id" , getSingleProduct );
router.post("/order" , protect , createOrder);
router.patch("/cart" , protect , updateCartItem);
router.patch("/:id",protect , restrictTo("admin") , updateProduct);
router.delete("/:id",protect , restrictTo("admin") , deleteProduct);
router.post("/addtocart" , protect, addToCart);
router.delete("/cart/:id" , protect , removeFromCart)


module.exports = router;