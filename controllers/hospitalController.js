const Doctor = require('../models/doctor');
const Hospital = require('../models/hospital');
const User = require('../models/user');
const crypto = require('crypto');
const sendEmail = require('../config/sendEmail'); // Email helper function
const jwt = require('jsonwebtoken'); // <-- Add this line



exports.registerDoctor = async (req, res) => {
    try {
        const hospitalId = req.user.id;

        console.log('Hospital ID from req.user:', hospitalId);

        if (!hospitalId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const hospital = await Hospital.findByPk(hospitalId);
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        // Proceed with doctor registration logic...
        const { email, name, phoneNumber, specialty } = req.body;
        const existingDoctor = await Doctor.findOne({ where: { email } });
        if (existingDoctor) {
            return res.status(400).json({ message: 'Doctor with this email already exists.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1-hour expiration

        const doctor = await Doctor.create({
            hospitalId,
            email,
            name,
            phoneNumber,
            specialty,
            isActive: true,
            resetToken,
            resetTokenExpiry
        });
        await User.create({
            email,
            password_hash: null,
            role: 'doctor',
            is_active: true,
        })

        const resetLink = `https://yourfrontend.com/set-password?token=${resetToken}`;
        await sendEmail(email, 'Set Your Password', `Click here to set your password: ${resetLink}`);

        await hospital.increment('doctorCount');
        res.status(201).json({ message: 'Doctor registered successfully. Email sent.', doctor });
    } catch (error) {
        console.error('Error registering doctor:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.getDoctors = async (req, res) => {
    try {
        const hospitalId = req.user.id; // Hospital's ID from JWT

        if (!hospitalId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }


        const doctors = await Doctor.findAll({ where: { hospitalId } });

        res.status(200).json({ message: 'Doctors retrieved successfully', doctors });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.toggleDoctorStatus = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const hospitalId = req.user.id; // The hospital making the request

        if (!hospitalId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Find the doctor under the hospital
        const doctor = await Doctor.findOne({ where: { id: doctorId, hospitalId } });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found or does not belong to this hospital' });
        }

        // Toggle doctor status
        doctor.isActive = !doctor.isActive;
        await doctor.save();

        // Update doctor count in the hospital model
        if (!doctor.isActive) {
            await Hospital.decrement('doctorCount', { where: { id: hospitalId } });
        } else {
            await Hospital.increment('doctorCount', { where: { id: hospitalId } });
        }

        res.status(200).json({
            message: `Doctor ${doctor.isActive ? 'activated' : 'deactivated'} successfully`,
            isActive: doctor.isActive
        });

    } catch (error) {
        console.error('Error toggling doctor status:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getDoctorById = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const hospitalId = req.user.id; // The hospital making the request

        if (!hospitalId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Find the doctor under the hospital
        const doctor = await Doctor.findOne({ where: { id: doctorId, hospitalId } });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found or does not belong to this hospital' });
        }

        res.status(200).json({ message: 'Doctor retrieved successfully', doctor });

    } catch (error) {
        console.error('Error fetching doctor:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

