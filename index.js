const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const product = require("./model/product");
const order = require("./model/order");
const customer = require("./model/customer");

mongoose.connect("mongodb://localhost/api-app", (error) => {
  if (error) console.log(error);
  else console.log("Database Connected");
});

app.set("view engine", "ejs");
app.set("Views", "/views");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  const Orders = await order.find();
  const Customers = await customer.find();
  const Products = await product.find();
  const data = { Orders, Products, Customers };
  res.render("order.ejs", { data });
});

app.get("/form", (req, res) => {
  res.render("view.ejs");
});

app.post("/order/add", async (req, res) => {
  try {
    const productData = await product.findOne({
      product_type: req.body.product_type,
      product_name: req.body.product_name,
    });
    if (productData !== null) {
      const userdata = await customer.findOne({
        email: req.body.email,
        customer_name: req.body.name,
      });
      if (userdata !== null) {
        if (productData.available_quantity >= req.body.quantity) {
          if (
            parseInt(productData.product_price) * parseInt(req.body.quantity) <=
            parseInt(userdata.balance)
          ) {
            const remainingBalance =
              userdata.balance - productData.product_price * req.body.quantity;
            const availQuantity =
              productData.available_quantity - req.body.quantity;
            await product.updateOne(
              {
                product_type: req.body.product_type,
                product_name: req.body.product_name,
              },
              {
                product_type: req.body.product_type,
                product_name: req.body.product_name,
                available_quantity: availQuantity,
              }
            );
            await customer.updateOne(
              {
                customer_name: userdata.customer_name,
                email: userdata.email,
              },
              {
                customer_name: userdata.customer_name,
                email: userdata.email,
                balance: remainingBalance,
              }
            );
            await order.create({
              customer_id: userdata._id,
              product_id: productData._id,
              product_name: req.body.product_name,
              quantity: req.body.quantity,
            });
            res.redirect("/");
          } else {
            res.status(500).json({
              status: "Failed",
              message: "insufficient balance",
            });
          }
        } else {
          res.status(500).json({
            status: "Failed",
            message: "out of stock",
          });
        }
      } else {
        res.status(500).json({
          status: "Failed",
          message: "User Is Not Registered",
        });
      }
    } else {
      res.status(500).json({
        status: "Failed",
        message: "Product Is Not Available",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
});

app.get("/orders/:order", async (req, res) => {
  try {
    const data = await order.find({ _id: req.params.order });
    res.status(200).json({
      status: "Sucess",
      message: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
});

app.post("/products", async (req, res) => {
  try {
    await product.create({
      product_name: req.body.product_name,
      product_type: req.body.product_type,
      available_quantity: req.body.available_quantity,
      product_price: req.body.product_price,
    });
    res.status(200).json({
      status: "Sucess",
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
});

app.get("/products", async (req, res) => {
  try {
    const data = await product.find();
    res.status(200).json({
      status: "Sucess",
      message: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
});

app.get("/products/:product", async (req, res) => {
  try {
    const data = await product.find({ product_type: req.params.product });
    res.status(200).json({
      status: "Sucess",
      message: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
});
app.get("/products/id/:id", async (req, res) => {
  try {
    const data = await product.find({ _id: req.params.id });
    res.status(200).json({
      status: "Sucess",
      message: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
});

app.put("/products/:product_name/:quantity", async (req, res) => {
  try {
    const data = await product.updateOne(
      { product_name: req.params.product_name },
      { available_quantity: req.params.quantity }
    );
    res.status(200).json({
      status: "Sucess",
      message: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
});

app.post("/customers", async (req, res) => {
  try {
    await customer.create({
      customer_name: req.body.customer_name,
      email: req.body.email,
      balance: req.body.balance,
    });
    res.status(200).json({
      status: "Sucess",
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
});

app.get("/customers", async (req, res) => {
  try {
    const data = await customer.find();
    res.status(200).json({
      status: "Sucess",
      message: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
});

app.get("/customers/:id", async (req, res) => {
  try {
    const data = await customer.find({ _id: req.params.id });
    res.status(200).json({
      status: "Sucess",
      message: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
});

app.put("/customers/:email/:balance", async (req, res) => {
  try {
    const data = await customer.updateOne(
      { email: req.params.email },
      { balance: req.params.balance }
    );
    res.status(200).json({
      status: "Sucess",
      message: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
});

app.get("*", (req, res) => {
  res.status(400).json({
    status: "Failed",
    message: "Path Not Found",
  });
});

app.listen(7000, () => {
  console.log("App Listning @7000");
});
