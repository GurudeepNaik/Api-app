const mongoose = require("mongoose");

const customer_Schema = new mongoose.Schema({
  customer_name: { type: String },
  email: { type: String, unique: true },
  balance:{ type:Number }
});

const customer = mongoose.model("customer", customer_Schema);

module.exports = customer;
