const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const User= sequelize.define('User', {
    id:{
        type:DataTypes.UUID
        ,defaultValue:DataTypes.UUIDV4
        ,primaryKey:true
    },
    email:{
        type:DataTypes.STRING
        ,allowNull:false
        ,unique:true

    },
    password_hash:{
        type:DataTypes.STRING
        ,
    },
    role:{
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
      isIn: [['government', 'hospital', 'doctor']]
    },
    is_active:{
        type:DataTypes.BOOLEAN
        ,defaultValue:true
    }

});

module.exports = User;
