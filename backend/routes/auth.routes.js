const express = require('express');
const bcrypt = require('bcrypt');
const { getDB } = require('../utils/db');
const { JWT_SECRET } = require('../utils/auth');
const jwt = require('jsonwebtoken');

// 🚨 आवश्यक: तुमच्या auth.middleware मधून authenticateToken इम्पोर्ट करा
// ----------------------------------------------------------------------
// 💡 टीप: 'path/to/auth.middleware' हा path तुमच्या फाईल स्ट्रक्चरनुसार बदला
const { authenticateToken } = require('../middleware/auth.middleware'); 
// ----------------------------------------------------------------------

const router = express.Router();
const db = getDB();


// ==================== ADMIN LOGIN (SECURE - JWT & BCRYPT) ====================
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const query = 'SELECT `id`, `username`, `password` FROM `admin` WHERE `username` = ?';

    db.query(query, [username], async (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Internal server error.' });
        }

        const user = results[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        let passwordMatch = false;
        try {
            passwordMatch = await bcrypt.compare(password, user.password);
        } catch (compareErr) {
            console.error('Bcrypt comparison error:', compareErr);
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        if (passwordMatch) {
            const token = jwt.sign(
                { id: user.id, username: user.username },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.status(200).json({
                message: 'Login successful!',
                token: token 
            });
        } else {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }
    });
});



//(CHANGE PASSWORD ROUTE)
router.post('/change-password', authenticateToken, async (req, res) => {
    // युजरने JWT (Token) मध्ये दिलेला id इथे उपलब्ध असेल
    const userId = req.user.id; 
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Old and new passwords are required.' });
    }

    if (newPassword.length < 6) { // किमान पासवर्डची लांबी तपासा
        return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
    }
    
    // 1. डेटाबेसमधून सध्याचा हॅश केलेला पासवर्ड मिळवा
    const fetchHashQuery = 'SELECT `password` FROM `admin` WHERE `id` = ?';

    db.query(fetchHashQuery, [userId], async (err, results) => {
        if (err || results.length === 0) {
            console.error('Database fetch error or user not found:', err);
            return res.status(500).json({ message: 'User not found or internal error.' });
        }

        const currentHashedPassword = results[0].password;
        
        // 2. जुन्या पासवर्डची तुलना करा (Verify Old Password)
        let passwordMatch = false;
        try {
            passwordMatch = await bcrypt.compare(oldPassword, currentHashedPassword);
        } catch (compareErr) {
            console.error('Bcrypt comparison error during old password check:', compareErr);
            return res.status(500).json({ message: 'Internal server error during verification.' });
        }

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid old password. Password change failed.' });
        }

        // 3. नवीन पासवर्ड हॅश करा (Hash New Password)
        const saltRounds = 10;
        let newHashedPassword;
        try {
            newHashedPassword = await bcrypt.hash(newPassword, saltRounds);
        } catch (hashErr) {
            console.error('Bcrypt hashing error:', hashErr);
            return res.status(500).json({ message: 'Could not secure new password.' });
        }
        
        // 4. डेटाबेसमध्ये नवीन हॅश अपडेट करा (Update Database)
        const updateQuery = 'UPDATE `admin` SET `password` = ? WHERE `id` = ?';
        
        db.query(updateQuery, [newHashedPassword, userId], (updateErr, updateResult) => {
            if (updateErr) {
                console.error('Database update error:', updateErr);
                return res.status(500).json({ message: 'Failed to update password in database.' });
            }

            // 5. यशस्वी प्रतिसाद (Success Response)
            res.status(200).json({ 
                message: 'Password changed successfully! You will need to log in again with the new password.',
                updatedUserId: userId
            });
        });
    });
});

module.exports = router;