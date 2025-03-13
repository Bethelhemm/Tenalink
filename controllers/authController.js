const { pool } = require("../config/db");  // Ensure you use destructuring if needed
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.loginGovernment = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Ensure pool is used correctly
    const user = await pool.query("SELECT * FROM government WHERE email = $1", [email]);

    if (user.rows.length === 0) return res.status(401).json({ message: " credentials" });

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.rows[0].id, role: "government" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("❌ Login error:", error);  // Log the error
    res.status(500).json({ error: error.message });
  }
};
