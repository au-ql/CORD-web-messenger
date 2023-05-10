const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

var User = require("../db.js");

const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../db.js");
var flash = require('connect-flash');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
module.exports = {
  get: (req, res) => {
    req.flash("info", "Flash Message Added");
    res.sendFile(path.join(path.resolve(), "views", "pages", "register.html"));
  },

  post: async (req, res) => {
    const objectOfDetails = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    const already_user = await User.findOne({
      where: { Name: req.body.name },
    });
    if (!already_user) {
      const saltRounds = 10;
      bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(objectOfDetails.password, salt, (err, hash) => {
          User.create({
            Name: objectOfDetails.name,
            Email: objectOfDetails.email,
            Password: hash,
          });
          console.log(hash);
          return hash;
        });
      });
      await req.flash("message", "Register Successful");
      res.status(202).redirect("/login");

    } else {
      res.status(209).send("User Already exists");
    }
  },
};
