const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // This connects to the URI you saved in your .env file
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Stop the server if the database connection fails
    }
};

module.exports = connectDB;