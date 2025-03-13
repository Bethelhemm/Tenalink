const express = require("express");
const { addHospital, getAllHospitals, approveHospital, deactivateHospital } = require("../controllers/governmentController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Government adds a hospital
router.post("/add-hospital", authMiddleware, addHospital);

// Get all hospitals
router.get("/hospitals", authMiddleware, getAllHospitals);

// Approve hospital registration
router.post("/approve-hospital/:id", authMiddleware, approveHospital);

// Deactivate hospital
router.post("/deactivate-hospital/:id", authMiddleware, deactivateHospital);

module.exports = router;
