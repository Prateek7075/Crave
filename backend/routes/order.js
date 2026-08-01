const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST: Create a new order (The one we made earlier)
router.post('/', async (req, res) => {
  try {
    const { customerId, items, totalAmount } = req.body;
    
    const newOrder = new Order({
      customerId,
      items,
      totalAmount
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
});

// GET: Fetch all orders for a specific customer (The NEW one!)
router.get('/customer/:id', async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.params.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// GET: Fetch ALL orders for the Restaurant Admin
router.get('/all', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// PUT: Update the status of a specific order
router.put('/:id/status', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

module.exports = router;