require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { pool, createGovernmentTable, createHospitalTable } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const governmentRoutes = require("./routes/governmentRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/government", governmentRoutes);
app.use("/api/hospital", hospitalRoutes);

// Initialize Database Tables
const initializeDatabase = async () => {
  try {
    await createGovernmentTable();
    await createHospitalTable();
    console.log("✅ Database tables initialized successfully.");
  } catch (error) {
    console.error("❌ Database initialization error:", error.message);
  }
};

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await initializeDatabase();
});
