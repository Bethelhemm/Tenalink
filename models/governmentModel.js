const { pool } = require("../config/db");

const findGovernmentByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM government WHERE email = $1", [email]);
  return result.rows[0];
};

module.exports = { findGovernmentByEmail };
