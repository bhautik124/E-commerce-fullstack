const userModel = require("../models/user-model.js");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.registerUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    let userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).send("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const createUser = await userModel.create({
      username,
      email,
      password: hash,
    });

    const token = jwt.sign(
      {
        email: createUser.email,
        id: createUser._id,
      },
      process.env.JWT_SECRET_KEY
    );

    res.cookie("token", token);
    res.status(201).send({ token, user: createUser });
  } catch (error) {
    res.status(404).send(error.message);
    console.log(error.message);
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid email or password");

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET_KEY
    );

    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(404).send(error.message);
    console.log(error.message);
  }
};

module.exports.logoutUser = async (req, res)=>{
    try {
        res.cookie("token" , "")
        res.status(200).json({message: "Logged out successfully"})
    } catch (error) {
        res.status(404).send(error.message);
        console.log(error.message);
        
    }
}
