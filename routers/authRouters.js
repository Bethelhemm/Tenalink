const express = require('express');
const { login, setHospitalPassword, loginHospital} = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);
router.post('/set-password', setHospitalPassword);
router.post('/login-hospital', loginHospital);
module.exports = router;
