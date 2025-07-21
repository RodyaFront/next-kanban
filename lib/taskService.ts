
import { Task } from "@/shared/types/kanban";
import { mockTasks } from "@/shared/constants/mockTasks";

const store = {
  tasks: [] as Task[],
};

if (store.tasks.length === 0) {
  store.tasks.push(...mockTasks);
}

export function getTasks(): Task[] {
  return store.tasks;
}

export function addTask(task: Task): void {
  store.tasks.push(task);
}

export function updateTask(id: string, updates: Partial<Task>): boolean {
  const idx = store.tasks.findIndex(t => t.id === id);
  if (idx === -1) return false;
  store.tasks[idx] = { ...store.tasks[idx], ...updates, updatedAt: Date.now() };
  return true;
}

export function deleteTask(id: string): boolean {
  const idx = store.tasks.findIndex(t => t.id === id);
  if (idx === -1) return false;
  store.tasks.splice(idx, 1);
  return true;
}
