const {register , login} = require("../controllers/authController")
const express = require("express");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router()

router.post("/register" , register);
router.post("/login" , login)

router.get("/profile" , protect , (req, res) => {
    res.json({
        message : "Protected route accessed",
        user : req.user
    });
});

router.post("/add-product" , protect , restrictTo("admin") , (req, res) => {
    res.json({message : "product added"})
})


module.exports = router