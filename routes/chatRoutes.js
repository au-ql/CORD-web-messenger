const express = require('express');
const { accessChat, fetchChat } = require('../control/chatControler');

const { router } = express;

router.route('/').post(accessChat);
router.route('/').get(fetchChat);

module.exports = router;
