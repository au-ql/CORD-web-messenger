const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
var User = require("../db");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

module.exports = {
  get: (req, res) => {
    res.sendFile(path.join(path.resolve(), "views", "pages", "login.html"));
  },

  post: async (req, res) => {
    const input_name = req.body.name;
    const password = req.body.password;

    const user = await User.findOne({ where: { Name: input_name } });
    if (user) {
      const password_valid = await bcrypt.compare(
        req.body.password,
        user.Password
      );
      if (password_valid) {
        const users = await User.findAll();
        res.render("pages/index", { data: users });
      } else {
        res.status(400).json({ error: "Password Incorrect" });
      }
    } else {
      res.status(404).json({ error: "User does not exist" });
    }
  },
};