const express = require('express');
const { registerHospital,  toggleHospitalStatus, getHospital, getAllHospitals} = require('../controllers/governmentController');
const authMiddleware = require('../Middleware/authMiddleware');

const router = express.Router();
router.get('/hospital/:hospitalId',authMiddleware, getHospital);

router.post('/register-hospital', authMiddleware, registerHospital);
router.get('/hospitals', getAllHospitals);

router.put('/hospital/:hospitalId/toggle-status', authMiddleware, toggleHospitalStatus);

module.exports = router;
