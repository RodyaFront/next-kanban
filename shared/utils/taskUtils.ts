import { Task } from '../types/kanban';
import { getUserName } from '../services/userService';

export const getTaskCreatorName = (task: Task): string => {
  return getUserName(task.createdBy);
};

export const getTaskCreatorInfo = (task: Task) => {
  return {
    id: task.createdBy,
    name: getUserName(task.createdBy),
  };
};

export const formatTaskDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}; 