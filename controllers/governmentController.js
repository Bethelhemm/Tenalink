const jwt = require('jsonwebtoken');
const Hospital = require('../models/hospital');
const User = require('../models/user');
const sendEmail = require('../config/sendEmail');
const crypto = require('crypto');

exports.registerHospital = async (req, res) => {
    try {
        const { name, email, phoneNumber, city, address, image } = req.body;
        console.log(req.user);

        if (req.user.role !== 'government') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const existingHospital = await Hospital.findOne({ where: { email } });
        if (existingHospital) {
            return res.status(400).json({ message: 'Hospital already registered' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour expiration

        // Create hospital entry
        const hospital = await Hospital.create({
            name, email, phoneNumber, city, address, image,
            resetToken, resetTokenExpiry
        });
        await User.create({
            email,
            password_hash: null,
            role: 'hospital',
            is_active: true
        });


        // Send email with password setup link
        const resetLink = `https://your-frontend.com/set-password?token=${resetToken}`;
        await sendEmail(email, 'Set Your Password', `Click the link to set your password: ${resetLink}`);

        res.status(201).json({ message: 'Hospital registered. Password setup email sent.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.toggleHospitalStatus = async (req, res) => {
    try {
        const { hospitalId } = req.params; // hospitalId is a UUID

        if (req.user.role !== 'government') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const hospital = await Hospital.findByPk(hospitalId); // UUID support
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        // Toggle the isActive status
        hospital.isActive = !hospital.isActive;
        await hospital.save();

        res.status(200).json({
            message: `Hospital ${hospital.isActive ? 'activated' : 'deactivated'} successfully`,
            isActive: hospital.isActive
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getHospital = async (req, res) => {
    try {
        const { hospitalId } = req.params; // hospitalId is a UUID

        if (req.user.role !== 'government') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Find the hospital by its UUID
        const hospital = await Hospital.findByPk(hospitalId); // UUID support
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        // Get the doctor count (assuming it's already being updated in the Hospital model)
        const doctorCount = hospital.doctorCount;

        // Respond with hospital details and doctor count
        res.status(200).json({
            message: 'Hospital retrieved successfully',
            hospital: {
                id: hospital.id,
                name: hospital.name,
                email: hospital.email,
                phoneNumber: hospital.phoneNumber,
                city: hospital.city,
                address: hospital.address,
                image: hospital.image,
                isActive: hospital.isActive,
                doctorCount,  // Include doctor count
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getAllHospitals = async (req, res) => {
    try {
        if (req.user.role !== 'government') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Retrieve all hospitals
        const hospitals = await Hospital.findAll(); // Find all hospitals

        // Map hospitals to include doctorCount
        const hospitalList = hospitals.map(hospital => ({
            id: hospital.id,
            name: hospital.name,
            email: hospital.email,
            phoneNumber: hospital.phoneNumber,
            city: hospital.city,
            address: hospital.address,
            image: hospital.image,
            isActive: hospital.isActive,
            doctorCount: hospital.doctorCount, // Add doctor count
        }));

        res.status(200).json({
            message: 'Hospitals retrieved successfully',
            hospitals: hospitalList,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



