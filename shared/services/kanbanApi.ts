import { IncomingMessage } from "http";
import { Task, KanbanColumn } from "../types/kanban";

const API_BASE = "/api/kanban";

/**
 * Universal fetch wrapper with error handling and abort support
 */
async function safeFetch<T>(
  url: string,
  options?: RequestInit & { signal?: AbortSignal }
): Promise<T> {
  try {
    const res = await fetch(url, options);
    const text = await res.text();
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText} - ${text}`);
    }
    try {
      return JSON.parse(text) as T;
    } catch (e) {
      throw new Error(`Failed to parse JSON: ${(e as Error).message}\nRaw: ${text}`);
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Получить задачи (SSR)
 */
export async function getTasksSSR(
  req: IncomingMessage,
  params?: Record<string, string>
): Promise<Task[]> {
  const baseUrl = req ? `http://${req.headers.host}` : "";
  let url = `${baseUrl}${API_BASE}/tasks`;
  if (params) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }
  return await safeFetch<Task[]>(url);
}

/**
 * Получить задачи (client-side)
 */
export async function getTasksClient(
  params?: Record<string, string>,
  signal?: AbortSignal
): Promise<Task[]> {
  let url = `${API_BASE}/tasks`;
  if (params) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }
  return await safeFetch<Task[]>(url, { signal });
}

/**
 * Добавить задачу
 * @param payload - данные задачи (без id)
 * @returns созданная задача
 */
export async function addTask(payload: Partial<Task>): Promise<Task> {
  return await safeFetch<Task>(`${API_BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/**
 * Удалить задачу по id
 * @param id - идентификатор задачи
 */
export async function deleteTaskById(id: string): Promise<{ success: boolean }> {
  return await safeFetch<{ success: boolean }>(`${API_BASE}/tasks`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}

/**
 * Очистить все задачи (batch delete)
 * @param tasks - массив задач для удаления
 */
export async function clearTasks(tasks: Task[]): Promise<void> {
  await Promise.all(tasks.map((task) => deleteTaskById(task.id)));
}

export async function updateTask(
  taskId: string,
  updates: Partial<{ title: string; description: string; status: KanbanColumn }>
): Promise<Task> {
  const response = await fetch(`/api/kanban/tasks`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: taskId, ...updates }),
  });
  if (!response.ok) {
    throw new Error("Failed to update task");
  }
  return response.json();
}
