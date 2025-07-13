import { KanbanColumn, Task } from "@/shared/types/kanban";
import { KanbanTaskCard } from "./components/KanbanTaskCard";
import { KANBAN_COLUMNS } from "@/shared/constants/kanbanColumns";

interface Props {
  tasks: Task[];
}

export function KanbanBoard({ tasks }: Props) {
  const tasksFilter = (task: Task, column: KanbanColumn) => {
    return task.status?.id === column.id;
  };

  return (
    <div className="p-4 bg-slate-900 min-h-screen text-slate-100">
      <div className="pb-4">Tasks ({tasks?.length})</div>
      <div className="flex gap-2">
        {KANBAN_COLUMNS.map((column) => (
          <div className="flex flex-col gap-2 min-w-[24rem] p-4 rounded-lg bg-slate-800" key={column.id}>
            <div>
              <b>{column.title}</b>
            </div>
            <div className="flex flex-col gap-1 overflow-auto">
              {tasks
                ?.filter((task) => tasksFilter(task, column))
                .map((task, idx) => (
                  <KanbanTaskCard task={task} key={`task-card-${idx}`} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
