const mongoose = require("mongoose");

const order_Schema = new mongoose.Schema({
    customer_id:{ type: String },
    product_id:{ type: String },
    product_name:{ type: String },
    quantity:{ type: Number }
});
const order = mongoose.model("order", order_Schema);

module.exports = order;
