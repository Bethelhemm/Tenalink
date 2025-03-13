const { pool } = require("../config/db");
const sendEmail = require("../utils/sendEmail");

const addHospital = async (req, res) => {
  try {
    const { name, address, city, phone, email, num_doctors } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    console.log("📌 Insert Query Parameters:", { name, address, city, phone, email, image, num_doctors });

    const newHospital = await pool.query(
      "INSERT INTO hospitals (name, address, city, phone, email, image, num_doctors, status) VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') RETURNING *",
      [name, address, city, phone, email, image, num_doctors]
    );

    // Send an email notification
    const subject = "Hospital Registration Pending Approval";
    const message = `
      Hello ${name},

      Your hospital registration request has been received and is currently pending approval.

      Details:
      - Name: ${name}
      - Address: ${address}, ${city}
      - Phone: ${phone}
      - Number of Doctors: ${num_doctors}

      You will be notified once your registration is approved.

      Regards,
      The Team
    `;

    await sendEmail(email, subject, message);

    res.status(201).json({ message: "Hospital added. Waiting for approval.", hospital: newHospital.rows[0] });

  } catch (error) {
    console.error("❌ Error adding hospital:", error);

    if (error.code === "23505") {
      return res.status(400).json({ error: "Email already exists. Please use a different email." });
    }

    res.status(500).json({ error: "Server error" });
  }
};


// Get All Hospitals
const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await pool.query("SELECT * FROM hospitals");
    res.json(hospitals.rows);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Approve Hospital Registration
const approveHospital = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE hospitals SET status='approved' WHERE id=$1", [id]);
    res.json({ message: "Hospital approved." });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Deactivate Hospital
const deactivateHospital = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE hospitals SET status='inactive' WHERE id=$1", [id]);
    res.json({ message: "Hospital deactivated." });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Export all functions
module.exports = { addHospital, getAllHospitals, approveHospital, deactivateHospital };
