// require('dotenv').config();
// const http = require('http');
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const { Server } = require("socket.io");

// const authRoutes = require('./routes/authRoutes');

// const app = express();
// const server = http.createServer(app);

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Database Connection
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('MongoDB connected...'))
//     .catch(err => console.error(err));

// // API Routes
// app.use('/api/auth', authRoutes);

// // Socket.IO Setup
// const io = new Server(server, {
//     cors: {
//         origin: "*", // Allow all origins for simplicity
//         methods: ["GET", "POST"]
//     }
// });

// io.on('connection', (socket) => {
//     console.log(`User connected: ${socket.id}`);

//     socket.on('joinChannel', (channelId) => {
//         socket.join(channelId);
//         console.log(`User ${socket.id} joined channel ${channelId}`);
//     });

//     socket.on('sendMessage', (message) => {
//         // Broadcast to everyone in the channel room
//         io.to(message.channel).emit('receiveMessage', message);
//     });

//     socket.on('disconnect', () => {
//         console.log(`User disconnected: ${socket.id}`);
//     });
// });

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Load environment variables from .env file
require('dotenv').config();

// Core dependencies
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require("socket.io");

// Import routes
const authRoutes = require('./routes/authRoutes');

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// -------------------- Middleware --------------------
app.use(cors());               // Enable CORS for all origins
app.use(express.json());       // Parse incoming JSON

// -------------------- Database Connection --------------------
mongoose.connect("mongodb://127.0.0.1:27017/slack-clone", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ MongoDB connected...'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
//checking 
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// -------------------- API Routes --------------------
app.use('/api/auth', authRoutes);

// -------------------- Socket.IO Setup --------------------
const io = new Server(server, {
    cors: {
        origin: "*",   // Allow all origins (you can restrict later to your frontend URL)
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // User joins a channel
    socket.on('joinChannel', (channelId) => {
        socket.join(channelId);
        console.log(`📥 User ${socket.id} joined channel ${channelId}`);
    });

    // Handle sending a message
    socket.on('sendMessage', (message) => {
        console.log(`💬 Message from ${socket.id} in channel ${message.channel}: ${message.text}`);
        // Broadcast message to everyone in the same channel
        io.to(message.channel).emit('receiveMessage', message);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${socket.id}`);
    });
});

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
