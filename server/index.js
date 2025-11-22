const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const socket = require("socket.io");

const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const User = require("./models/userModel"); // Import your User model

require("dotenv").config();

const app = express();

// ✅ CORS setup: Allowing only Vercel frontend
app.use(cors({
  origin: "*",  // Allow only this origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successful"))
  .catch((err) => console.log(err.message));

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Health check routes
app.get("/ping", (_req, res) => res.json({ msg: "Ping Successful" }));

// ✅ Serve frontend build (React)
app.use(express.static(path.join(__dirname, "public/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/build", "index.html"));
});

// ✅ Start server
const server = app.listen(process.env.PORT || 5000, () =>
  console.log(`Server started on ${process.env.PORT || 5000}`)
);

// ✅ Socket.io setup
const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("add-user", async (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.join(userId);
    try {
      await User.findByIdAndUpdate(userId, { isOnline: true });
      socket.broadcast.emit("user-status", userId, true);
    } catch (error) {
      console.error(`Error updating user status for userId ${userId}:`, error);
    }
  });

  socket.on("disconnect", async () => {
    let disconnectedUserId = null;
    onlineUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) disconnectedUserId = userId;
    });

    if (disconnectedUserId) {
      onlineUsers.delete(disconnectedUserId);
      try {
        await User.findByIdAndUpdate(disconnectedUserId, { isOnline: false });
        socket.broadcast.emit("user-status", disconnectedUserId, false);
      } catch (error) {
        console.error(`Error updating user status for userId ${disconnectedUserId}:`, error);
      }
    }

    console.log("User disconnected:", socket.id);
  });

  socket.on("send-msg", (data) => {
    io.to(data.to).emit("msg-recieve", data.message);
  });

  socket.on("logout", async (userId) => {
    onlineUsers.delete(userId);
    try {
      await User.findByIdAndUpdate(userId, { isOnline: false });
      socket.broadcast.emit("user-status", userId, false);
    } catch (error) {
      console.error(`Error updating user status for userId ${userId}:`, error);
    }
    socket.disconnect();
  });
});
