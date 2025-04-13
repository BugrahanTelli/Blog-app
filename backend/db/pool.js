require('dotenv').config(); 
const pg = require("pg");
const Pool = pg.Pool;

const pool = new Pool({
    host: "localhost",
    port: 5432,
    database: process.env.PG_DATABASE,
    user: "postgres",
    password: process.env.PG_PASSWORD 
});

module.exports = pool;
