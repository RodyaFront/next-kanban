import { KanbanColumn } from "../types/kanban";
export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: "todo", title: "To Do", color: "bg-yellow-400" },     
  { id: "in-progress", title: "In Progress", color: "bg-blue-400" }, 
  { id: "done", title: "Done", color: "bg-green-500" },
]