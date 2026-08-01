const Restaurant = require('../models/Restaurant');

// @desc    Create a new restaurant
// @route   POST /api/restaurants
// @access  Private (Only restaurant_admin can do this)
const createRestaurant = async (req, res) => {
    try {
        const { name, cuisine, lng, lat } = req.body;

        const restaurant = await Restaurant.create({
            name,
            cuisine,
            adminId: req.user._id, // We get this from your token!
            location: {
                type: 'Point',
                // CRITICAL: MongoDB always requires [Longitude, Latitude] order!
                coordinates: [lng, lat] 
            }
        });

        res.status(201).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

// @desc    Get nearby restaurants for a customer
// @route   GET /api/restaurants/nearby?lng=...&lat=...&radius=...
// @access  Private (Logged-in users)
const getNearbyRestaurants = async (req, res) => {
    try {
        // Grab coordinates and radius from the URL query, default to 5km radius
        const lng = parseFloat(req.query.lng);
        const lat = parseFloat(req.query.lat);
        const radiusInKm = parseFloat(req.query.radius) || 5; 

        if (!lng || !lat) {
            return res.status(400).json({ message: 'Please provide lng and lat' });
        }

        // The Magic of GeoJSON: Find restaurants near the user
        const restaurants = await Restaurant.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lng, lat]
                    },
                    // Convert kilometers to meters
                    $maxDistance: radiusInKm * 1000 
                }
            }
        });

        res.json({ count: restaurants.length, data: restaurants });
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

module.exports = { createRestaurant, getNearbyRestaurants };