// utils/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expects 'Bearer TOKEN'

    if (token == null) {
        // 401 Unauthorized: No token provided
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // 403 Forbidden: Token is invalid or expired
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }
        req.user = user; // Attach user info to request
        next();
    });
};

module.exports = {
    authenticateToken,
    JWT_SECRET
};