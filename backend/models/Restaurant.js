const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    adminId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Links this restaurant to a specific 'restaurant_admin' User
        required: true 
    },
    cuisine: [String],
    
    // THE UPGRADE: GeoJSON for Location-based tracking
    location: {
        type: {
            type: String, 
            enum: ['Point'], 
            required: true
        },
        coordinates: {
            type: [Number], // Note: MongoDB requires [Longitude, Latitude] order!
            required: true
        }
    },
    isActive: { type: Boolean, default: true }
});

// This is the magic line. It tells MongoDB to index this data geographically 
// so we can mathematically search for "restaurants within 3km of the user".
RestaurantSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Restaurant', RestaurantSchema);