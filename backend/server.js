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
const jwt = require("jsonwebtoken");

// Models
const User = require('./models/User');

// Import routes
const authRoutes = require('./routes/authRoutes');

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// -------------------- Middleware --------------------
app.use(cors());               // Enable CORS
app.use(express.json());       // Parse JSON

// -------------------- Database Connection --------------------
mongoose.connect("mongodb://127.0.0.1:27017/slack-clone", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ MongoDB connected...'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// -------------------- Test Route --------------------
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// -------------------- API Routes --------------------
app.use('/api/auth', authRoutes);

// -------------------- Socket.IO Setup --------------------
const io = new Server(server, {
    cors: {
        origin: "*",   // TODO: replace with frontend URL in production
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    socket.on('joinChannel', (channelId) => {
        socket.join(channelId);
        console.log(`📡 User ${socket.id} joined channel ${channelId}`);
    });

    // -------------------- Handle Message --------------------
    socket.on('sendMessage', async (message) => {
        try {
            // ✅ Verify token to find sender
            const decoded = jwt.verify(message.token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.user.id).select("username");

            if (!user) {
                return socket.emit("errorMessage", { msg: "Invalid user" });
            }

            // ✅ Enrich message with sender + timestamp
            const enrichedMessage = {
                content: message.content,
                channel: message.channel,
                sender: { username: user.username },
                timestamp: new Date()
            };

            console.log(`💬 ${user.username} in channel ${message.channel}: ${message.content}`);

            // Broadcast to channel
            io.to(message.channel).emit('receiveMessage', enrichedMessage);

        } catch (err) {
            console.error("❌ Message error:", err.message);
            socket.emit("errorMessage", { msg: "Authentication failed" });
        }
    });

    socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${socket.id}`);
    });
});

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
