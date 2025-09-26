const express = require("express");
let app = express();
require("dotenv").config();
const path = require("path");
const cors = require("cors");
const connectDB = require("./utils/db.js");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(cookieParser());

// Apply CORS middleware before routes
app.use(
  cors({
    origin: "https://e-commerce-fullstack-frontend.onrender.com", // Allow requests from your deployed frontend
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true, // Enable cookies or authentication tokens
  })
);

const productRouter = require("./router/productRouter.js");
const userRouter = require("./router/userRouter.js");
const cartRouter = require("./router/cartRouter.js");
const paymentRouter = require("./router/paymentRouter.js");
const contectRouter = require("./router/contectRouter.js");

app.use("/product/", productRouter);
app.use("/user/", userRouter);
app.use("/cart/", cartRouter);
app.use("/payment/", paymentRouter);
app.use("/contect/", contectRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
  });
});
