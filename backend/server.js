const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/order');

// 1. Load environment variables from the .env file
dotenv.config();

// 2. Connect to the MongoDB database
connectDB();

// 3. Initialize the Express application
const app = express();

// 4. Middleware setup
app.use(cors()); // Allows your React frontend to communicate with this API
app.use(express.json()); // Tells Express to parse incoming JSON data (like form submissions)
// Auth Routes
app.use('/api/auth', require('./routes/authRoutes'));
// 5. Wrap the Express app with Node's native HTTP server
// We MUST do this to make WebSockets (Socket.io) work alongside Express
const server = http.createServer(app);

// 6. Initialize Socket.io for Real-Time Live Order Tracking
const io = new Server(server, {
    cors: {
        origin: "*", // For development, allow any frontend to connect
        methods: ["GET", "POST"]
    }
});

// Listen for WebSocket connections
io.on('connection', (socket) => {
    console.log(`A user connected for live tracking: ${socket.id}`);
    
    socket.on('disconnect', () => {
        console.log('User disconnected from live tracking');
    });
});

// Make the Socket.io instance available in our routes/controllers
app.use((req, res, next) => {
    req.io = io;
    next();
});

// 7. A simple test route
app.get('/', (req, res) => {
    res.send('Crave V2 API is running!');
});


// Import your new security middleware
const { protect, authorize } = require('./middleware/authMiddleware');

// A secure route: Any logged-in user can view their own profile
app.get('/api/profile', protect, (req, res) => {
    res.json({ message: "Welcome to the secure zone!", user: req.user });
});

// A super-secure route: ONLY Restaurant Admins can access this
app.get('/api/restaurant-dashboard', protect, authorize('restaurant_admin'), (req, res) => {
    res.json({ message: "Welcome to the Kitchen Display System!" });
});

// Auth Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Restaurant Routes
app.use('/api/restaurants', require('./routes/restaurantRoutes'));

// Auth Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Restaurant Routes
app.use('/api/restaurants', require('./routes/restaurantRoutes'));

// Menu Routes  <-- ADD THIS LINE
app.use('/api/menu', menuRoutes);


app.use('/api/orders', orderRoutes);

// 8. Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});