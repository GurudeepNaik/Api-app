const mongoose = require("mongoose");

const product_Schema = new mongoose.Schema({
  product_type: { type: String },
  product_name: { type: String },
  product_price:{ type:Number },
  available_quantity: { type: Number },
});
const products = mongoose.model("product", product_Schema);

module.exports = products;
