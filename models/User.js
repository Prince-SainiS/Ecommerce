const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please enter your email"],
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please enter valid email"],
      // match: [   checking manaully for the vaild email address
      //     /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      //     "Please enter a valid email"
      // ]
    },
    password: {
      type: String,
      required: [true, "Enter password"],
      minLength: [8, "Password should be minimum 8 characters"],
      select: false,
    },
    role : {
      type : String,
      enum : ["user" , "admin"],
      default : "user"
    }
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  // Only run if the password is modified
  if (!this.isModified("password")) {
    return ;
  }

  const hash = await bcrypt.hash(this.password, 12);

  this.password = hash;

  
});

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword , this.password);
}

module.exports = mongoose.model("User", userSchema);
