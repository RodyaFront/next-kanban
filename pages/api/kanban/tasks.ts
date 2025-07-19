import type { NextApiRequest, NextApiResponse } from 'next';
import { getTasks, addTask, updateTask, deleteTask } from '../../../lib/serverStore';
import { Task } from '@/shared/types/kanban';

// Универсальная декларативная фильтрация задач
type TaskFilter = (task: Task, value: string | string[] | undefined) => boolean;

const filterMap: Record<string, TaskFilter> = {
  assigneeId: (task, value) => task.assignee === value,
  statusId: (task, value) => task.status?.id === value,
  // tags: (task, value) => Array.isArray(task.tags) && value.every((tag: string) => task.tags.includes(tag)),
  // ...добавляйте новые фильтры здесь
};

function filterTasks(tasks: Task[], filters: Record<string, string | string[] | undefined>): Task[] {
  return tasks.filter(task =>
    Object.entries(filters).every(([key, value]) => {
      if (value === undefined) return true;
      const filterFn = filterMap[key];
      return filterFn ? filterFn(task, value) : true;
    })
  );
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    let tasks = getTasks();
    tasks = filterTasks(tasks, req.query);
    return res.status(200).json(tasks);
  }
  if (req.method === 'POST') {
    const task: Task = {
      ...req.body,
      id: req.body.id || Math.random().toString(36).slice(2),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    addTask(task);
    return res.status(201).json(task);
  }
  if (req.method === 'PUT') {
    const { id, ...updates } = req.body;
    if (!id) return res.status(400).json({ error: 'Task id required' });
    const ok = updateTask(id, updates);
    return ok ? res.status(200).json({ success: true }) : res.status(404).json({ error: 'Task not found' });
  }
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Task id required' });
    const ok = deleteTask(id);
    return ok ? res.status(200).json({ success: true }) : res.status(404).json({ error: 'Task not found' });
  }
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 