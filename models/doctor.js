const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const bcrypt = require('bcrypt');

const Doctor = sequelize.define('Doctor', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    specialty: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true, // Initially NULL
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true, // Unique token for password setup
    },
    resetTokenExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    hospitalId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
});

// Hash password before saving
Doctor.beforeSave(async (doctor) => {
    if (doctor.changed('password') && doctor.password && !doctor.password.startsWith("$2b$")) {
        doctor.password = await bcrypt.hash(doctor.password, 10);
    }
});

module.exports = Doctor;
