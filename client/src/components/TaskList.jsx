import { useState, useMemo } from "react";
import TaskItem from "./TaskItem.jsx";

export default function TaskList({
  tasks,
  onToggle,
  onDelete,
  onUpdateTitle,
  onClearCompleted,
}) {
  const [filter, setFilter] = useState("all"); // 'all' | 'pending' | 'completed'
  const [searchQuery, setSearchQuery] = useState("");

  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  // Filter and search computation
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Status filter
      if (filter === "pending" && task.status !== "pending") return false;
      if (filter === "completed" && task.status !== "completed") return false;

      // Search filter
      if (searchQuery.trim()) {
        return task.title.toLowerCase().includes(searchQuery.toLowerCase().trim());
      }

      return true;
    });
  }, [tasks, filter, searchQuery]);

  if (tasks.length === 0) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-10 text-center border border-dashed border-slate-300 shadow-sm">
        <div className="w-14 h-14 mx-auto rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mb-3">
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.75"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">
          No tasks yet
        </h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Start your productive day! Use the input form above to add your first task.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls Bar: Filters + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/70 backdrop-blur-sm p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filter === "all"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All <span className="opacity-70 text-[10px]">({tasks.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter("pending")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filter === "pending"
                ? "bg-white text-amber-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Pending <span className="opacity-70 text-[10px]">({pendingCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter("completed")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filter === "completed"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Done <span className="opacity-70 text-[10px]">({completedCount})</span>
          </button>
        </div>

        {/* Search Field */}
        <div className="relative flex-1 sm:max-w-[200px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 outline-none focus:border-indigo-400 focus:bg-white text-slate-700 placeholder:text-slate-400"
          />
          <svg
            className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Task List Items */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white/60 rounded-xl p-8 text-center border border-slate-200">
          <p className="text-sm font-medium text-slate-600">
            No tasks match &quot;{searchQuery}&quot; in {filter} tasks.
          </p>
          <button
            type="button"
            onClick={() => {
              setFilter("all");
              setSearchQuery("");
            }}
            className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id || task._id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdateTitle={onUpdateTitle}
            />
          ))}
        </ul>
      )}

      {/* Bottom helper row */}
      {completedCount > 0 && onClearCompleted && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClearCompleted}
            className="text-xs font-medium text-slate-400 hover:text-rose-600 transition-colors"
          >
            Clear all completed ({completedCount})
          </button>
        </div>
      )}
    </div>
  );
}

