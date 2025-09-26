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
    origin: function (origin, callback) {
      // Allow requests from your deployed frontend and localhost for development
      const allowedOrigins = [
        "https://e-commerce-fullstack-frontend.onrender.com",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173"
      ];
      
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true, // Enable cookies or authentication tokens
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    preflightContinue: false,
    optionsSuccessStatus: 204
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
