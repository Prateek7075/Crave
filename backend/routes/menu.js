const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// POST: Add a new menu item to the database
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category, image, restaurantId } = req.body;
    
    // Create the new food item
    const newItem = new MenuItem({
      name,
      description,
      price,
      category,
      image,
      restaurantId
      // If you are passing the user ID from the token, you'd save it here. 
      // For now, we'll keep it simple to make sure it saves!
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error("Error saving menu item:", error);
    res.status(500).json({ message: "Failed to save menu item" });
  }
});

// GET: Fetch all menu items to display on the frontend Menu page
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch menu items" });
  }
});

module.exports = router;