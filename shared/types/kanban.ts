export type Task = {
  id: string;
  title: string;
  description?: string;
  status?: KanbanColumn;
  createdAt: number;
  updatedAt: number;
};

export type KanbanColumn = {
  id: string;
  title: string;
};
