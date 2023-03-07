const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../db.js');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

module.exports = {
  get: (req, res) => {
    res.sendFile(path.join(path.resolve(), 'views', 'pages', 'register.html'));
  },

  post: async (req, res) => {
    const objectOfDetails = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    const already_user = await User.findOne({
      where: { Email: req.body.email },
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
      // res.send("Hurray!!! Registered Successfully");
      res.redirect('/login');
    } else {
      res.send('User Already Registered');
    }
  },
};
