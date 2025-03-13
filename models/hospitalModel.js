const { pool } = require("../config/db"); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const addHospital = async (name, address, city, phone, email, image) => {
  try {
    const query = `
      INSERT INTO hospitals (name, address, city, phone, email, image, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending') RETURNING *;
    `;
    const values = [name, address, city, phone, email, image];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("❌ Error adding hospital:", error);
    throw error;
  }
};

const findHospitalByEmail = async (email) => {
  try {
    const result = await pool.query("SELECT * FROM hospitals WHERE email = $1 AND status = 'approved'", [email]);
    console.log("Query result:", result.rows); // Log the result
    return result.rows[0]; // Return the first result or null if not found
  } catch (error) {
    console.error("❌ Error finding hospital by email:", error);
    throw error;
  }
};

const activateHospital = async (id) => {
  const result = await pool.query("UPDATE hospitals SET status = 'active' WHERE id = $1 RETURNING *", [id]);
  const hospital = result.rows[0];

  if (!hospital) {
    throw new Error("Hospital not found");
  }

  // Generate a token (valid for password setup)
  const token = jwt.sign({ email: hospital.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

  // Password setup link
  const resetLink = `http://yourfrontend.com/set-password?token=${token}`;

  // Send email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: hospital.email,
    subject: "Activate Your Hospital Account - Set Password",
    text: `Your hospital has been activated! Set your password here: ${resetLink}`,
  };

  await transporter.sendMail(mailOptions);

  return hospital;
};

const updateHospitalPassword = async (id, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await pool.query("UPDATE hospitals SET password = $1 WHERE id = $2", [hashedPassword, id]);
};

module.exports = { addHospital, activateHospital, findHospitalByEmail, updateHospitalPassword };
