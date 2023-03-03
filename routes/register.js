const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const fs = require("fs");
const controller = require("../controller/registerController.js");

const router = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
router.get("/", controller.get);

router.post("/", controller.post);

module.exports = router;
