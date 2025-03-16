const express = require('express');
const { registerDoctor, getDoctors, toggleDoctorStatus, getHospitalById, getDoctorById} = require('../controllers/hospitalController');
const authMiddleware = require('../Middleware/authMiddleware');

const router = express.Router();

router.post('/register-doctor', authMiddleware, registerDoctor);
router.get('/doctors', authMiddleware, getDoctors); // Get all doctors added by the hospital
router.put('/doctor/:doctorId/toggle', authMiddleware, toggleDoctorStatus); // Activate/deactivate a doctor
router.get('/doctor/:doctorId', authMiddleware, getDoctorById); // <-- Add this line

module.exports = router;
