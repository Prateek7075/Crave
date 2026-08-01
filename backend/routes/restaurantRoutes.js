const express = require('express');
const router = express.Router();
const { createRestaurant, getNearbyRestaurants } = require('../controllers/restaurantController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Route to get nearby restaurants (Any logged-in user)
router.get('/nearby', protect, getNearbyRestaurants);

// Route to create a restaurant (ONLY admins)
router.post('/', protect, authorize('restaurant_admin'), createRestaurant);

module.exports = router;