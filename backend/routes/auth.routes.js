// routes/auth.routes.js
const express = require('express');
const bcrypt = require('bcrypt');
const { getDB } = require('../utils/db');
const { JWT_SECRET } = require('../utils/auth');
const jwt = require('jsonwebtoken');

const router = express.Router();
const db = getDB();


// ==================== ADMIN LOGIN (SECURE - JWT & BCRYPT) ====================
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Retrieve the user and their HASHED password
    const query = 'SELECT `id`, `username`, `password` FROM `admin` WHERE `username` = ?';

    db.query(query, [username], async (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }

        const user = results[0];

        // 1. Check if user exists
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        let passwordMatch = false;
        try {
            // 2. Compare the plain password with the hashed password
            passwordMatch = await bcrypt.compare(password, user.password);
        } catch (compareErr) {
            console.error('Bcrypt comparison error:', compareErr);
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        if (passwordMatch) {
            // 3. Generate JWT
            const token = jwt.sign(
                { id: user.id, username: user.username },
                JWT_SECRET,
                { expiresIn: '1h' } // Token expires in 1 hour
            );

            // 4. Send successful response with token
            return res.status(200).json({
                message: 'Login successful!',
                token: token 
            });
        } else {
            // 5. Failed password match
            return res.status(401).json({ message: 'Invalid username or password.' });
        }
    });
});

module.exports = router;