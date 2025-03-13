const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

const createGovernmentTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS government (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
  `;

  try {
    await pool.query(query);
    console.log("✅ Government table initialized successfully");
  } catch (error) {
    console.error("❌ Error creating government table:", error);
  }
};

const createHospitalTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS hospitals (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      city VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255), 
      image VARCHAR(255),
      num_doctors INT DEFAULT 0,
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("✅ Hospital table initialized successfully");
  } catch (error) {
    console.error("❌ Error creating hospital table:", error.message);
  }
};

// Export the pool correctly
module.exports = { pool, createGovernmentTable, createHospitalTable };
