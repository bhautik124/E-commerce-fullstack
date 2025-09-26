const Contact = require("../models/contect-model.js");

module.exports.addContactMessage = async (req, res) => {
  try {
    const { name, surname, company, email, telephone, message } = req.body;

    // Ensure all required fields are present
    if (!name || !surname || !email || !telephone || !message) {
      return res.status(400).json({
        success: false,
        message:
          "All required fields (name, surname, email, telephone, message) must be provided.",
      });
    }

    // Create a new contact message
    const newContact = await Contact.create({
      name,
      surname,
      company,
      email,
      telephone,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Contact message added successfully",
      data: newContact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while adding contact message",
      error: error.message,
    });
  }
};
