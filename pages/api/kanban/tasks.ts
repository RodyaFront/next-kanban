import type { NextApiRequest, NextApiResponse } from 'next';
import { getTasks, addTask, updateTask, deleteTask, Task } from '../../../lib/serverStore';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json(getTasks());
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
  if (req.method === 'PATCH') {
    const { id, ...updates } = req.body;
    if (!id) return res.status(400).json({ error: 'Task id required' });
    const ok = updateTask(id, updates);
    if (!ok) return res.status(404).json({ error: 'Task not found' });
    return res.status(200).json({ success: true });
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