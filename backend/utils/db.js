// utils/db.js
const mysql = require('mysql2');
require('dotenv').config();

let db;

const initDBPool = () => {
    // Check if the pool is already initialized
    if (db) return db; 

    db = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    console.log("🔗 MySQL Connection Pool Initialized.");
    return db;
};

const getDB = () => {
    if (!db) {
        // Throw error if getDB is called before initDBPool
        throw new Error("Database pool not initialized. Call initDBPool first."); 
    }
    return db;
};

module.exports = {
    initDBPool,
    getDB
};