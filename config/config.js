const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT,
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false  // Important for some cloud databases
            }
        }
    }
);

sequelize.sync({ alter: true })
    .then(() => console.log('Database synced'))
    .catch(err => console.error('Database sync error:', err));

module.exports = sequelize;
