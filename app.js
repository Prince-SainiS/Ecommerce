const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/authRoutes")
const productRouter = require("./routes/productRoutes");
const { globalErrorhandler } = require("./middleware/errorMiddleware");

let app = express();

//Middleware
app.use(cors({
  origin: "https://ecommerce-frontend-drab-eta.vercel.app/",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended : true}));

// Routes

app.use("/user" , authRouter)
app.use("/product" , productRouter)
app.use(globalErrorhandler)

app.get("/" , (req, res) => {
    res.status(200).json({message : "Hello from server"});
})


module.exports = app