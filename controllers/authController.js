const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {Hospital} = require("../models");
const { Op } = require('sequelize');


exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role,email:user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
};

exports.setHospitalPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const hospital = await Hospital.findOne({ where: { resetToken: token, resetTokenExpiry: { [Op.gt]: Date.now() } } });


        if (!hospital) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }


        // Hash and save new password
        hospital.password = await bcrypt.hash(newPassword, 10);
        hospital.resetToken = null;
        hospital.resetTokenExpiry = null;
        await hospital.save();
        const user = await User.findOne({
            where: { email: hospital.email, role: 'hospital' } // Find the hospital user by email
        });

        if (user) {
            // Hash and save the password for the user
            user.password_hash = await bcrypt.hash(newPassword, 10);
            await user.save();
        }

        res.status(200).json({ message: 'Password set successfully. You can now log in.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.loginHospital = async (req, res) => {
    try {
        const { email, password } = req.body;

        const hospital = await Hospital.findOne({ where: { email } });
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }
        if (!hospital.isActive) {
            return res.status(403).json({ message: 'Your hospital account has been deactivated. Contact government authority.' });
        }


        const isMatch = await bcrypt.compare(password, hospital.password);
        if (!isMatch) {
            console.error(`Password mismatch for user: ${email}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ hospitalId: hospital.id, role: 'hospital' }, process.env.JWT_SECRET, { expiresIn: '24h' });


        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.setDoctorPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const doctor = await Doctor.findOne({
            where: {
                resetToken: token,
                resetTokenExpiry: { $gt: new Date() }
            }
        });

        if (!doctor) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Set and hash the new password
        doctor.password = await bcrypt.hash(newPassword, 10);
        doctor.resetToken = null;
        doctor.resetTokenExpiry = null;
        await doctor.save();

        res.status(200).json({ message: 'Password set successfully. You can now log in.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;
        const doctor = await Doctor.findOne({ where: { email } });

        if (!doctor || !doctor.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: doctor.id, role: 'doctor' }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};