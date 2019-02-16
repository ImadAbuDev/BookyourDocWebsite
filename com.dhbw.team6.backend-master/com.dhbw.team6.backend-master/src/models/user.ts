import mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["DOCTOR", "PATIENT", "INTERN"],
    default: "PATIENT",
    required: true,
  },
  gender: {
    type: String,
    enum: ["MALE", "FEMALE", "OTHER"],
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  address: {
    street: String,
    street_number: String,
    country: String,
    zip: String,
    city: String,
  },
  mail: {
    type: String,
    required: true,
  },
  password_hash: {
    type: String,
    required: true,
  },
  active: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    default: "USER",
    enum: ["USER", "ADMIN", "MOD"],
  },
  registered: {
    type: Date,
    default: Date.now,
  },
});
const user: mongoose.Model<any> = mongoose.model("User", userSchema);

export = user;
