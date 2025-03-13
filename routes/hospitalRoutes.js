const express = require("express");
const { acceptHospital, setPassword, loginHospital, changePassword } = require("../controllers/hospitalController");

const router = express.Router();

router.post("/accept", acceptHospital);
router.post("/login-hospital", loginHospital);
router.post("/set-password", setPassword);
router.post("/change-password", changePassword);

module.exports = router;
