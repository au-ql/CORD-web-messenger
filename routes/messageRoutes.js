const express = require("express");
const { sendMessage, getMessage } = require("../controller/msgControler");

const { router } = express;

// router.route('/').post(sendMessage);
// router.route('/:chatId').get(getMessage);

module.exports = router;
