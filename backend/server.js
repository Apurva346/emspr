// server.js (MODIFIED)
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Imports from utils (These do not call getDB() immediately)
const { initDBPool } = require('./utils/db');
const { uploadDir } = require('./utils/multerConfig');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.API_PORT || 3001;
const api_url = process.env.API_URL;

// ==================== INITIAL SETUP ====================
// FOLDER SETUP
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const tempUploadDir = path.join(__dirname, 'temp-uploads');
if (!fs.existsSync(tempUploadDir)) fs.mkdirSync(tempUploadDir);

// 1. 🥇 FIRST: Initialize DB Pool (Call initDBPool before importing routes)
initDBPool(); 

// 2. 🥈 SECOND: Now, import the routes. 
//    When these files execute, getDB() will now return the initialized pool.
const employeeRoutes = require('./routes/employee.routes'); // Now safe to import
const authRoutes = require('./routes/auth.routes');         // Now safe to import


// ==================== MIDDLEWARE SETUP ====================
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(uploadDir));


// ==================== TEST ROUTE ====================
app.get('/', (req, res) => {
    res.send('Node.js server is running and ready!');
});


// ==================== ROUTE REGISTRATION ====================
app.use('/api', authRoutes); 
app.use('/api', employeeRoutes);


// ==================== START SERVER ====================
app.listen(port, () => {
    console.log(`✅ Server running at ${api_url} on port ${port}`);
});