import { useState } from "react";

export default function TaskItem({ task, onToggle, onDelete, onUpdateTitle }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editError, setEditError] = useState("");

  const taskId = task.id || task._id;
  const isCompleted = task.status === "completed";

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const trimmed = editTitle.trim();
    if (!trimmed) {
      setEditError("Title cannot be empty");
      return;
    }
    if (trimmed !== task.title && onUpdateTitle) {
      onUpdateTitle(taskId, trimmed);
    }
    setIsEditing(false);
    setEditError("");
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setIsEditing(false);
    setEditError("");
  };

  const formatTaskDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(date);
    } catch {
      return "";
    }
  };

  return (
    <li
      className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border transition-all duration-200 ${
        isCompleted
          ? "bg-slate-50/70 border-slate-200 text-slate-400"
          : "bg-white border-slate-200/90 hover:border-indigo-200 shadow-sm hover:shadow"
      }`}
    >
      {isEditing ? (
        <form
          onSubmit={handleSaveEdit}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full"
        >
          <div className="flex-1">
            <input
              type="text"
              autoFocus
              value={editTitle}
              onChange={(e) => {
                setEditTitle(e.target.value);
                if (editError) setEditError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") handleCancelEdit();
              }}
              className="w-full text-sm font-medium px-3 py-1.5 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 bg-white text-slate-800"
            />
            {editError && (
              <span className="text-xs text-rose-500 mt-1 block">
                {editError}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              type="submit"
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <button
              type="button"
              role="checkbox"
              aria-checked={isCompleted}
              onClick={() => onToggle(taskId, task.status)}
              className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
                isCompleted
                  ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30"
                  : "border-2 border-slate-300 hover:border-indigo-500 bg-white"
              }`}
              title={isCompleted ? "Mark as pending" : "Mark as completed"}
            >
              {isCompleted && (
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>

            <div className="flex-1 min-w-0">
              <p
                onClick={() => onToggle(taskId, task.status)}
                className={`text-sm font-medium select-none cursor-pointer break-words transition-all ${
                  isCompleted
                    ? "line-through text-slate-400"
                    : "text-slate-800 hover:text-indigo-600"
                }`}
              >
                {task.title}
              </p>

              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isCompleted
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {isCompleted ? "Completed" : "Pending"}
                </span>

                {task.createdAt && (
                  <span className="text-[11px] text-slate-400">
                    {formatTaskDate(task.createdAt)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 self-end sm:self-center">
            {/* Edit Title Button */}
            {!isCompleted && (
              <button
                type="button"
                onClick={() => {
                  setEditTitle(task.title);
                  setIsEditing(true);
                }}
                className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                title="Edit task"
                aria-label="Edit task"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            )}

            {/* Delete Button */}
            <button
              type="button"
              onClick={() => onDelete(taskId)}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              title="Delete task"
              aria-label="Delete task"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </>
      )}
    </li>
  );
}

