const express = require('express');

const controller = require('../controller/loginController.js');

const router = express.Router();
const app = express();

router.get('/', controller.get);

router.post('/', controller.post);
module.exports = router;
