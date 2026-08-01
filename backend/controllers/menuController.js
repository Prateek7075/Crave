const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

// @desc    Add a new item to a restaurant's menu
// @route   POST /api/menu/:restaurantId
// @access  Private (Only restaurant_admin can do this)
const addMenuItem = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const { name, description, price, category, image } = req.body;

        // 1. Verify the restaurant exists and belongs to this admin
        const restaurant = await Restaurant.findById(restaurantId);
        
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Security check: Only the admin who owns this restaurant can add food to it
        if (restaurant.adminId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You do not have permission to modify this restaurant' });
        }

        // 2. Create the food item
        const menuItem = await MenuItem.create({
            restaurantId,
            name,
            description,
            price,
            category,
            image
        });

        res.status(201).json(menuItem);
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

// @desc    Get all menu items for a specific restaurant
// @route   GET /api/menu/:restaurantId
// @access  Public (Anyone can view a menu)
const getMenu = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const menu = await MenuItem.find({ restaurantId });
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

module.exports = { addMenuItem, getMenu };