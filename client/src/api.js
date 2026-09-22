import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export const getTasks = () => api.get("/tasks");
export const createTask = (title) => api.post("/tasks", { title });
export const toggleTask = (id, status) => api.put(`/tasks/${id}`, { status });
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

