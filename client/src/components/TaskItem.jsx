export default function TaskItem({ task, onToggle, onDelete }) {
  const isCompleted = task.status === "completed";

  return (
    <li className="flex items-center justify-between gap-3 bg-white rounded-lg border border-gray-200 px-4 py-3 shadow-sm">
      <label className="flex items-center gap-3 flex-1 cursor-pointer min-w-0">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => onToggle(task._id, task.status)}
          className="h-4 w-4 accent-indigo-600 flex-shrink-0"
        />
        <span
          className={`truncate text-sm ${
            isCompleted ? "line-through text-gray-400" : "text-gray-800"
          }`}
        >
          {task.title}
        </span>
      </label>
      <button
        onClick={() => onDelete(task._id)}
        className="text-xs font-medium text-red-500 hover:text-red-700 flex-shrink-0"
      >
        Delete
      </button>
    </li>
  );
}
