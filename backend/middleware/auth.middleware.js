// middleware/auth.middleware.js

const jwt = require('jsonwebtoken');
// 💡 तुम्ही तुमच्या utils/auth.js मधून JWT_SECRET इम्पोर्ट करू शकता
const { JWT_SECRET } = require('../utils/auth'); 

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (token == null) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }
        req.user = user; 
        next(); 
    });
};

module.exports = {
    authenticateToken
};