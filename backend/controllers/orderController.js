const Order = require('../models/Order');

// @desc    Create a new order (Supports Multi-Restaurant!)
// @route   POST /api/orders
// @access  Private (Customers only)
const placeOrder = async (req, res) => {
    try {
        const { items, deliveryAddress } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items provided' });
        }

        // 1. Calculate the financials
        const itemTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const tax = itemTotal * 0.05; // 5% GST
        const deliveryFee = 30; // Flat fee
        const grandTotal = itemTotal + tax + deliveryFee;

        // 2. Create the Order in the database
        const order = await Order.create({
            customerId: req.user._id,
            items,
            itemTotal,
            tax,
            deliveryFee,
            grandTotal,
            deliveryAddress,
            status: 'Pending'
        });

        // 3. FIRE THE WEBSOCKET! 
        // Broadcast to all connected restaurant dashboards that a new order arrived
        req.io.emit('newOrderRinging', order);

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

// @desc    Update order status (Live Tracking Engine)
// @route   PUT /api/orders/:id/status
// @access  Private (Restaurant Admins & Delivery Partners)
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const orderId = req.params.id;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update the status in the database
        order.status = status;
        await order.save();

        // FIRE THE WEBSOCKET!
        // Broadcast the status change so the customer's screen updates instantly
        req.io.emit('orderStatusUpdated', { orderId: order._id, status: order.status });

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

module.exports = { placeOrder, updateOrderStatus };