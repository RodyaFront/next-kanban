import { useEffect, useState } from "react";
import { Task } from "@/shared/types/kanban";
import {
  getTasksClient,
  addTask,
  clearTasks,
} from "@/shared/services/kanbanApi";
import { Button } from "@/components/ui/button";
import { KANBAN_COLUMNS } from "@/shared/constants/kanbanColumns";

export default function TaskCRUD() {
  const [mounted, setMounted] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasksClient();
      setTasks(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRandomTask = async () => {
    setLoading(true);
    setError(null);
    try {
      await addTask({
        title: "Task " + Math.random().toString(36).slice(2, 7),
        description: "Randomly generated task",
        status: KANBAN_COLUMNS[0],
      });
      await fetchTasks();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      await clearTasks(tasks);
      await fetchTasks();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchTasks();
    }
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-slate-100">
      <h1 className="text-2xl font-bold mb-4">Task CRUD Demo</h1>
      <div className="flex gap-4 mb-4">
        <Button
          onClick={handleAddRandomTask}
          disabled={loading}
        >
          Add random task
        </Button>
        <Button
          variant={'destructive'}
          onClick={handleClearTasks}
          disabled={loading || tasks.length === 0}
        >
          Clear all tasks
        </Button>
      </div>
      {loading && <div className="mb-2">Loading...</div>}
      {error && <div className="mb-2 text-red-400">Error: {error}</div>}
      <pre className="bg-slate-800 p-2 rounded text-xs overflow-x-auto">
        {JSON.stringify(tasks, null, 2)}
      </pre>
    </div>
  );
}
