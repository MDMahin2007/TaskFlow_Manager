import { useEffect, useState, useCallback } from "react";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import {
  getTasks,
  createTask,
  toggleTask,
  updateTask,
  deleteTask,
} from "./api.js";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' | 'info' }

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 3200);
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      const taskData = Array.isArray(res.data) ? res.data : [];
      setTasks(taskData);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Could not load tasks. Ensure backend server is running.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);


  const handleAdd = async (title) => {
    setSubmitting(true);
    try {
      const res = await createTask(title);
      setTasks((prev) => [res.data, ...prev]);
      showToast("Task added successfully!", "success");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add task.";
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id, currentStatus) => {
    const nextStatus = currentStatus === "pending" ? "completed" : "pending";
    const previousTasks = [...tasks];

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => {
        const taskId = t.id || t._id;
        return taskId === id ? { ...t, status: nextStatus } : t;
      })
    );

    try {
      await toggleTask(id, nextStatus);
      showToast(
        nextStatus === "completed"
          ? "Task marked as completed!"
          : "Task marked as pending.",
        "success"
      );
    } catch (err) {
      setTasks(previousTasks);
      showToast("Failed to update task status.", "error");
    }
  };

  const handleUpdateTitle = async (id, newTitle) => {
    const previousTasks = [...tasks];

    setTasks((prev) =>
      prev.map((t) => {
        const taskId = t.id || t._id;
        return taskId === id ? { ...t, title: newTitle } : t;
      })
    );

    try {
      await updateTask(id, { title: newTitle });
      showToast("Task updated successfully!", "success");
    } catch (err) {
      setTasks(previousTasks);
      showToast("Failed to edit task title.", "error");
    }
  };

  const handleDelete = async (id) => {
    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => (t.id || t._id) !== id));

    try {
      await deleteTask(id);
      showToast("Task deleted successfully.", "info");
    } catch (err) {
      setTasks(previousTasks);
      showToast("Failed to delete task.", "error");
    }
  };

  const handleClearCompleted = async () => {
    const completedTasks = tasks.filter((t) => t.status === "completed");
    if (completedTasks.length === 0) return;

    if (!window.confirm(`Clear all ${completedTasks.length} completed tasks?`)) {
      return;
    }

    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t.status !== "completed"));

    try {
      await Promise.all(
        completedTasks.map((t) => deleteTask(t.id || t._id))
      );
      showToast(`Cleared ${completedTasks.length} completed tasks.`, "info");
    } catch (err) {
      setTasks(previousTasks);
      showToast("Failed to clear some tasks.", "error");
    }
  };

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const pendingCount = totalCount - completedCount;
  const completionRate =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100 py-8 px-4 sm:py-12">
      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-bounce-short">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium backdrop-blur-md transition-all ${
              toast.type === "success"
                ? "bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20"
                : toast.type === "error"
                ? "bg-rose-600 text-white border-rose-500 shadow-rose-500/20"
                : "bg-slate-800 text-white border-slate-700 shadow-slate-900/20"
            }`}
          >
            {toast.type === "success" && (
              <svg
                className="w-4 h-4 text-emerald-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            {toast.type === "error" && (
              <svg
                className="w-4 h-4 text-rose-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <main className="max-w-xl mx-auto">
        {/* Header Section */}
        <header className="mb-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center justify-center sm:justify-start gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/30 text-white">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  TaskFlow Manager
                </h1>
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  MERN Stack Web Development
                </p>
              </div>
            </div>

            <span className="inline-flex items-center self-center sm:self-auto text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              Job Sheet-1 Project
            </span>
          </div>

          <p className="text-sm text-slate-500 mt-1">
            Organize, track, and accomplish your daily tasks with persistent MongoDB storage.
          </p>

          {/* Stats & Progress Bar */}
          <div className="mt-5 bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                Daily Progress
              </span>
              <span>{completionRate}% Completed</span>
            </div>

            {/* Progress bar line */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>

            {/* Counter badges */}
            <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-100">
              <div className="p-1.5 rounded-lg bg-slate-50">
                <p className="text-xs text-slate-500">Total</p>
                <p className="text-sm font-bold text-slate-800">{totalCount}</p>
              </div>
              <div className="p-1.5 rounded-lg bg-amber-50/70">
                <p className="text-xs text-amber-600">Pending</p>
                <p className="text-sm font-bold text-amber-700">{pendingCount}</p>
              </div>
              <div className="p-1.5 rounded-lg bg-emerald-50/70">
                <p className="text-xs text-emerald-600">Completed</p>
                <p className="text-sm font-bold text-emerald-700">{completedCount}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Task Form Component */}
        <TaskForm onAdd={handleAdd} isSubmitting={submitting} />

        {/* Task List Component with Loading State */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="animate-pulse bg-white/70 rounded-xl p-4 border border-slate-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 w-3/4">
                  <div className="w-5 h-5 bg-slate-200 rounded-lg"></div>
                  <div className="h-4 bg-slate-200 rounded-md w-2/3"></div>
                </div>
                <div className="w-12 h-4 bg-slate-200 rounded-md"></div>
              </div>
            ))}
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onUpdateTitle={handleUpdateTitle}
            onClearCompleted={handleClearCompleted}
          />
        )}

        {/* Student Footer */}
        <footer className="mt-10 pt-6 border-t border-slate-200/80 text-center text-xs text-slate-400">
          <p>
            TaskFlow Manager • Built with React 18, Tailwind CSS, Express, and MongoDB Mongoose.
          </p>
          <p className="mt-1">
            Compliant with Job Sheet-1 Performance Standards.
          </p>
        </footer>
      </main>
    </div>
  );
}

