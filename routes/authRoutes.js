const express = require("express");
const { loginGovernment } = require("../controllers/authController");

const router = express.Router();

router.post("/login", loginGovernment);

module.exports = router;
