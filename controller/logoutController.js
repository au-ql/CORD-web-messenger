const express = require("express");
const path = require("path");

const app = express();
module.exports = {
  post: (req, res) => {
    req.session.destroy();
    res.redirect("/login");
  },
};
