import { useState } from "react";

export default function TaskForm({ onAdd, isSubmitting }) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = title.trim();

    if (!trimmed) {
      setError("Task title cannot be empty.");
      return;
    }

    if (trimmed.length > 150) {
      setError("Task title cannot exceed 150 characters.");
      return;
    }

    onAdd(trimmed);
    setTitle("");
    setError("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 mb-6 transition-all duration-200 hover:shadow-md"
    >
      <label htmlFor="task-input" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
        Add New Task
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            id="task-input"
            type="text"
            value={title}
            maxLength={150}
            disabled={isSubmitting}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
            placeholder="What do you need to accomplish today?"
            className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-all outline-none bg-slate-50/60 focus:bg-white text-slate-800 placeholder:text-slate-400 ${
              error
                ? "border-rose-400 focus:ring-2 focus:ring-rose-200"
                : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            }`}
          />
          {title.length > 0 && (
            <span className="absolute right-3 top-2.5 text-[11px] font-medium text-slate-400 pointer-events-none">
              {title.length}/150
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium px-5 py-2.5 text-sm transition-all shadow-sm hover:shadow-indigo-500/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
          ) : (
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          )}
          <span>Add Task</span>
        </button>
      </div>

      {error && (
        <p className="flex items-center gap-1 text-xs text-rose-500 mt-2 font-medium">
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </form>
  );
}

