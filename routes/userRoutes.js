const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controller/userControler");

const { router } = express;

// router.routes('/').post(registerUser).get(allUsers);
// router.post('/login', authUser);

module.exports = router;
