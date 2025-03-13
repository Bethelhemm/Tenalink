const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { activateHospital, findHospitalByEmail, updateHospitalPassword } = require("../models/hospitalModel");

const acceptHospital = async (req, res) => {
  const { id } = req.params;
  const hospital = await activateHospital(id);

  if (!hospital) return res.status(404).json({ message: "Hospital not found" });

  // Generate a password setup token (valid for 1 hour)
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

  res.json({ message: "Hospital activated! Password setup email sent." });
};

const setPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the hospital's password
    await pool.query("UPDATE hospitals SET password = $1 WHERE email = $2", [hashedPassword, email]);

    res.json({ message: "Password set successfully! You can now log in." });
  } catch (error) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
};

const loginHospital = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const hospital = await findHospitalByEmail(email);

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Check if the hospital has a password set
    if (!hospital.password) {
      return res.status(400).json({ message: "Hospital has not set a password yet" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, hospital.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: hospital.id, role: "hospital" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send the response with the token and redirect flag
    res.json({
      message: "Login successful",
      token,
      redirectToChangePassword: true, // Flag indicating password change required
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// Change hospital password after initial login
const changePassword = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    const hospital = await findHospitalByEmail(email);

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, hospital.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // Update the hospital password
    await updateHospitalPassword(hospital.id, newPassword);
    
    res.json({ message: "Password successfully updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password", error: error.message });
  }
};


module.exports = { acceptHospital, loginHospital, setPassword, changePassword };

