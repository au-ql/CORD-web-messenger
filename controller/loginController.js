const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('../db.js');

const app = express();
let session;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

module.exports = {
  get: async (req, res) => {
    session = req.session;
    if (session.userid) {
      res.render('pages/index', { name: session.userid });
    } else {
      res.sendFile(path.join(path.resolve(), 'views', 'pages', 'login.html'));
    }
  },

  post: async (req, res) => {
    const input_name = req.body.name;

    const user = await User.findOne({ where: { Name: input_name } });

    if (user) {
      const password_valid = await bcrypt.compare(
        req.body.password,
        user.Password,
      );
      if (password_valid) {
        const users = await User.findAll();
        session = req.session;
        session.userid = input_name;
        req.session.save();
        res.render('pages/index', { name: input_name });
      } else {
        res.status(400).json({ error: 'Password Incorrect' });
      }
    } else {
      res.status(404).json({ error: 'User does not exist' });
    }
  },
};
