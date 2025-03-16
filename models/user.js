const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/config'); // Ensure this file exports a Sequelize instance

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['government', 'hospital', 'doctor']]
        }
    },
    is_active: {  // Moved outside of "role"
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

module.exports = User;
