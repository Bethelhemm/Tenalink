const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const bcrypt = require('bcrypt');

const Hospital = sequelize.define('Hospital', {
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
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true, // Null initially, as password is set later
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true, // Token for password setup
    },
    resetTokenExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    doctorCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // Start with zero doctors
    },
});

// Hash password before saving
Hospital.beforeSave(async (hospital) => {
    if (hospital.changed('password') && hospital.password && !hospital.password.startsWith("$2b$")) {
        hospital.password = await bcrypt.hash(hospital.password, 10);
    }
});

module.exports = Hospital;
