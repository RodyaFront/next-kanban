import { Task } from "@/shared/types/kanban";

export function KanbanTaskCard({ task }: { task: Task }) {
  return (
    <div className="bg-slate-700 rounded-lg p-4">
      <div className="flex justify-between">
        <b>{task.title}</b>
      </div>
      <div>
        <small>{task.description}</small>
      </div>
    </div>
  );
}
