const jwt = require('jsonwebtoken');
const Hospital = require('../models/hospital');
const User = require('../models/user');  // For government role-based checks
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        // Extract the token from the Authorization header
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        console.log('Decoded JWT:', decoded);

        // Check the role in the token and fetch the correct user
        if (decoded.role === 'hospital') {
            const hospital = await Hospital.findByPk(decoded.hospitalId);

            if (!hospital) {
                return res.status(401).json({ message: 'Invalid hospital in token' });
            }
            req.user = hospital;
            console.log('Hospital assigned to req.user:', req.user);  // Log to verify assignment
        } else if (decoded.role === 'doctor') {
            // Handle doctor authorization, you can fetch doctor details here if needed
            // req.user = await Doctor.findByPk(decoded.doctorId);  // Uncomment if doctor model exists
        } else if (decoded.role === 'government') {
            // For government role, we fetch the user by id
            const governmentUser = await User.findByPk(decoded.id);  // Use `id` instead of `email`
            if (!governmentUser) {
                return res.status(401).json({ message: 'Invalid government user in token' });
            }
            req.user = governmentUser;  // Assign government user to req.user
        } else {
            return res.status(401).json({ message: 'Invalid role in token' });
        }


        if (req.requiredRole && req.user.role !== req.requiredRole) {
            return res.status(403).json({ message: 'Forbidden: Insufficient role' });
        }

        // Pass user to the next middleware
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
