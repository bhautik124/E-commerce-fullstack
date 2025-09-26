const mongoose = require("mongoose");
const URI = process.env.MONGODB_URI;

let connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log("Connected to Mongo");
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectDB;
