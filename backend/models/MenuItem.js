const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  // This links the food item to the specific Restaurant Admin who created it!
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);