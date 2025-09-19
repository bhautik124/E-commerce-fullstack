const express = require("express");
const router = express.Router();
const { addContactMessage } = require("../controllers/contectController.js");

// Define the POST route for /contect/contectform
router.post("/contectform", addContactMessage);

module.exports = router;
