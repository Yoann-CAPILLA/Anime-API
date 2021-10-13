const { Pool } = require("pg");

const client = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = client;
