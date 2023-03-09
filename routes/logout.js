const express = require('express');

const controller = require('../controller/logoutController.js');

const router = express.Router();
const app = express();

router.post('/', controller.post);
module.exports = router;
