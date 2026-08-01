const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    name: String,
    quantity: Number,
    price: Number
  }],
  // LOOK HERE: Is this exactly "totalAmount" or did you name it "totalPrice" or something else?
  totalAmount: { type: Number, required: true }, 
  status: { type: String, default: 'Preparing' }, 
  deliveryAddress: { type: String, default: 'Default Home Address' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);