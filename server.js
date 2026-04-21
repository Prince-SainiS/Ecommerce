const mongoose = require("mongoose");
const dotenv = require("dotenv")

dotenv.config({ path : "./config/config.env"})

const app = require("./app");

// Database Connection
mongoose
  .connect(
    process.env.DATABASE_CONN_LINK,
  )
  .then((conn) => {
    console.log("Database Connected Successfully");
  })
  .catch((err) => {
    console.error("Database Connection failed : " + err.message);
  });


// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on Port " + PORT);
});
