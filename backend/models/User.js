const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobnumber: { type: String, required: true },
    
    // THE UPGRADE: This determines what dashboard they see when they log in
    role: { 
        type: String, 
        enum: ['customer', 'restaurant_admin', 'delivery_partner'], 
        default: 'customer' 
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt dates

// Hash password before saving (Modern Mongoose Syntax)
UserSchema.pre('save', async function() {
    // If the password wasn't changed, just return and let Mongoose continue automatically
    if (!this.isModified('password')) {
        return;
    }
    
    // Otherwise, hash the password
    this.password = await bcrypt.hash(this.password, 10);
});

// A helper method to compare passwords during login
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);