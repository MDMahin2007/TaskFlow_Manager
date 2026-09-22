require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/taskflow";

const clientOrigin = (process.env.CLIENT_ORIGIN || "https://task-flow-manager-ten.vercel.app/").trim();

// Middleware
app.use(cors({ origin: clientOrigin || "*" }));
app.use(express.json()); // parses JSON request bodies

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "TaskFlow Manager API is running",
    endpoints: {
      getAllTasks: "GET /tasks",
      createTask: "POST /tasks",
      updateTask: "PUT /tasks/:id",
      deleteTask: "DELETE /tasks/:id",
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Generic error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`TaskFlow Server running on mahin`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

