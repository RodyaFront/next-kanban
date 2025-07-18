import { Task } from "@/shared/types/kanban";

interface Props {
  task: Task;
  dragHandleProps?: React.HTMLAttributes<HTMLSpanElement>;
  onClick?: (task: Task) => void; // добавляем проп
}

export function KanbanTaskCard({ task, dragHandleProps, onClick }: Props) {
  const statusColor = task.status?.color || "bg-gray-400";
  return (
    <div
      onClick={() => onClick?.(task)}
      tabIndex={0}
      role="button"
      aria-label={`Edit task ${task.title}`}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.(task)}
      className="relative bg-slate-700 rounded-lg py-2 pr-2 pl-6 overflow-clip"
    >
      <div
        {...dragHandleProps}
        tabIndex={0}
        aria-label="Reposition the task"
        className="cursor-grab flex items-center absolute left-0 px-1 py-2 h-full top-0 opacity-50 hover:bg-slate-800 active:bg-slate-900"
      >
        <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
          <circle cx="6" cy="4" r="1" fill="currentColor" />
          <circle cx="10" cy="4" r="1" fill="currentColor" />
          <circle cx="6" cy="8" r="1" fill="currentColor" />
          <circle cx="10" cy="8" r="1" fill="currentColor" />
          <circle cx="6" cy="12" r="1" fill="currentColor" />
          <circle cx="10" cy="12" r="1" fill="currentColor" />
        </svg>
      </div>
      <div
        className="p-2 rounded-md hover:bg-slate-800/50 active:bg-slate-800 cursor-pointer transition-all"
        title="Edit task"
      >
        <div className="flex items-center justify-between gap-2">
          <b>{task.title}</b>
          <span
            className={`inline-block w-2 h-2 rounded-full mr-2 ${statusColor}`}
            aria-label={task.status?.title || "Status"}
          />
        </div>
        <div>
          <small>{task.description}</small>
        </div>
      </div>
    </div>
  );
}
