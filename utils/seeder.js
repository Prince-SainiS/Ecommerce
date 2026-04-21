const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/Product");

// Load env
dotenv.config({ path: "../config/config.env" });

// Sample Data
const products = [
{
name: "iPhone 15",
price: 80000,
description: "Latest Apple smartphone with A16 chip",
category: "Electronics",
stock: 10,
},
{
name: "Samsung Galaxy S23",
price: 70000,
description: "Flagship Android phone",
category: "Electronics",
stock: 15,
},
{
name: "Sony Headphones",
price: 30000,
description: "Noise cancelling headphones",
category: "Electronics",
stock: 20,
}
];

// Connect DB
mongoose.connect(process.env.DATABASE_CONN_LINK)
.then(() => console.log("DB connected"))
.catch(err => console.log(err));

// Import Data
const importData = async () => {
try {
await Product.deleteMany();
await Product.insertMany(products);

```
console.log("Data Imported");
process.exit();
```

} catch (err) {
console.error(err);
process.exit(1);
}
};

// Delete Data
const deleteData = async () => {
try {
await Product.deleteMany();

```
console.log("Data Deleted");
process.exit();
```

} catch (err) {
console.error(err);
process.exit(1);
}
};

// Command line control
if (process.argv[2] === "--import") {
importData();
} else if (process.argv[2] === "--delete") {
deleteData();
}
