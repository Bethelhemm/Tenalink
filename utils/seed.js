require('dotenv').config(); 
const { pool } = require("../config/db");
const bcrypt = require("bcrypt");

const seedGovernment = async () => {
  const email = process.env.GOVERNMENT_EMAIL;
  const password = await bcrypt.hash(process.env.GOVERNMENT_PASSWORD, 10);

  try {
    const client = await pool.connect();
    await client.query("INSERT INTO government (email, password) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING", [email, password]);
    client.release(); // Release the client back to the pool
    console.log("Government credentials seeded.");
  } catch (error) {
    console.error("Error seeding government credentials:", error);
  } finally {
    process.exit();
  }
};

seedGovernment();
