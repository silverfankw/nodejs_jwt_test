require("dotenv").config();
const jwt = require("jsonwebtoken");
require("./config/database").connect();

const bcrypt = require("bcryptjs/dist/bcrypt");
const express = require("express");
const app = express();
app.use(express.json());

module.exports = app;

const User = require("./model/user");

app.post("/register", async (req, res) => {
  try {
    const {username, email, password} = req.body;
    console.log(username, email, password);

    if (!(username && email && password)) {
      res.status(400).send("All input is required.");
    }

    const oldUser = await User.findOne({email});
    if (oldUser) {
      res.status(409).send("User Already Exist.");
    }

    const encryptedPw = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: encryptedPw
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    user.token = token;
    res.status(201).json(user);
  }
  catch (err) {
    console.log(err);
  }
}) 

app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!(email && password)) {
        res.status(400).send("All input is required.");
      }
      const user = await User.findOne({email});
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
            { user_id: user._id, email}, 
            process.env.TOKEN_KEY,
            { expiresIn: "2h" });
        user.token = token;

        res.status(200).json(user);
      }
      res.status(400).send("Invalid Credential");
    }
    catch (err) {
      console.log(err);
    }
}) ;