const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");

const router = express.Router();

// GET /tasks -> retrieve all tasks (sorted newest first)
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks", error: err.message });
  }
});

// POST /tasks -> add a new task
router.post("/", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Task title cannot be empty" });
    }

    const trimmedTitle = title.trim();
    if (trimmedTitle.length > 150) {
      return res
        .status(400)
        .json({ message: "Task title cannot exceed 150 characters" });
    }

    const task = await Task.create({ title: trimmedTitle });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: "Failed to create task", error: err.message });
  }
});

// PUT /tasks/:id -> update task (mark completed, toggle, or edit title)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID format" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update title if provided
    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ message: "Task title cannot be empty" });
      }
      const trimmedTitle = title.trim();
      if (trimmedTitle.length > 150) {
        return res
          .status(400)
          .json({ message: "Task title cannot exceed 150 characters" });
      }
      task.title = trimmedTitle;
    }

    // Update status if provided or toggle if requested
    if (status !== undefined) {
      if (!["pending", "completed"].includes(status)) {
        return res
          .status(400)
          .json({ message: "Status must be either 'pending' or 'completed'" });
      }
      task.status = status;
    } else if (title === undefined) {
      // If neither status nor title explicitly provided, toggle status
      task.status = task.status === "pending" ? "completed" : "pending";
    }

    await task.save();
    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ message: "Failed to update task", error: err.message });
  }
});

// DELETE /tasks/:id -> delete a specific task
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID format" });
    }

    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully", id });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task", error: err.message });
  }
});

module.exports = router;

