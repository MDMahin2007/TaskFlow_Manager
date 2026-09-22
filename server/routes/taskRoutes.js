const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");

const router = express.Router();

// GET /tasks -> retrieve all tasks
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

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Task title cannot be empty" });
    }

    const task = await Task.create({ title: title.trim() });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: "Failed to create task", error: err.message });
  }
});

// PUT /tasks/:id -> mark task as completed / toggle status
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const existing = await Task.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Task not found" });
    }

    const nextStatus =
      req.body.status || (existing.status === "pending" ? "completed" : "pending");

    existing.status = nextStatus;
    await existing.save();

    res.status(200).json(existing);
  } catch (err) {
    res.status(400).json({ message: "Failed to update task", error: err.message });
  }
});

// DELETE /tasks/:id -> delete a specific task
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted", id });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task", error: err.message });
  }
});

module.exports = router;
