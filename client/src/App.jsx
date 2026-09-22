import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import { getTasks, createTask, toggleTask, deleteTask } from "./api.js";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      setError("Could not load tasks. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = async (title) => {
    try {
      const res = await createTask(title);
      setTasks((prev) => [res.data, ...prev]);
    } catch (err) {
      setError("Failed to add task.");
    }
  };

  const handleToggle = async (id, currentStatus) => {
    const nextStatus = currentStatus === "pending" ? "completed" : "pending";
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, status: nextStatus } : t))
    );
    try {
      await toggleTask(id, nextStatus);
    } catch (err) {
      setError("Failed to update task.");
      fetchTasks();
    }
  };

  const handleDelete = async (id) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
    try {
      await deleteTask(id);
    } catch (err) {
      setError("Failed to delete task.");
      fetchTasks();
    }
  };

  const pendingCount = tasks.filter((t) => t.status === "pending").length;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          TaskFlow Manager
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {loading
            ? "Loading tasks..."
            : `${pendingCount} pending / ${tasks.length} total`}
        </p>

        <TaskForm onAdd={handleAdd} />

        {error && (
          <p className="text-sm text-red-500 mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {!loading && (
          <TaskList
            tasks={tasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
