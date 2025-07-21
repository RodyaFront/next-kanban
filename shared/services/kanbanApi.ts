import { IncomingMessage } from "http";
import { Task } from "../types/kanban";

export type TaskFilters = {
  assigneeId?: string;
  statusId?: string;
  tags?: string[];
  [key: string]: string | string[] | undefined;
};

function buildTaskQuery(filters?: TaskFilters): string {
  if (!filters) return "";
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else {
      params.append(key, value);
    }
  });
  const query = params.toString();
  return query ? `?${query}` : "";
}

const API_BASE = "/api/kanban";

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

export async function getTasksSSR(
  req: IncomingMessage,
  filters?: TaskFilters
): Promise<Task[]> {
  const baseUrl = req ? `http://${req.headers.host}` : "";
  let url = `${baseUrl}${API_BASE}/tasks`;
  url += buildTaskQuery(filters);
  return await safeFetch<Task[]>(url);
}

export async function getTasksClient(
  filters?: TaskFilters,
  signal?: AbortSignal
): Promise<Task[]> {
  let url = `${API_BASE}/tasks`;
  url += buildTaskQuery(filters);
  return await safeFetch<Task[]>(url, { signal });
}

export async function addTask(payload: Partial<Task>): Promise<Task> {
  return await safeFetch<Task>(`${API_BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteTaskById(id: string): Promise<{ success: boolean }> {
  return await safeFetch<{ success: boolean }>(`${API_BASE}/tasks`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}

export async function clearTasks(tasks: Task[]): Promise<void> {
  await Promise.all(tasks.map((task) => deleteTaskById(task.id)));
}

export async function updateTask(
  taskId: string,
  updates: Partial<Task>
): Promise<Task> {
  const response = await fetch(`/api/kanban/tasks`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: taskId, ...updates }),
  });
  if (!response.ok) {
    throw new Error("Failed to update task");
  }
  return response.json();
}
