const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. The Bouncer: Checks if you have a valid token
const protect = async (req, res, next) => {
    let token;

    // Check if the request has an authorization header that starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token (Format is "Bearer <token_string>")
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using your secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch the user from the database (but leave out the password!)
            // We attach this user to the `req` object so the next functions know who is making the request
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Move on to the actual route
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed or expired' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

// 2. The VIP List: Checks if your role is allowed in this specific area
const authorize = (...roles) => {
    return (req, res, next) => {
        // req.user was set by the `protect` middleware above
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Access denied. Your role (${req.user.role}) is not authorized for this action.` 
            });
        }
        next(); // You have the right role, proceed!
    };
};

module.exports = { protect, authorize };