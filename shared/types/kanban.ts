export type Task = {
  id: string;
  title: string;
  description?: string;
  status: KanbanColumn;
  content?: string;
  createdAt: number;
  updatedAt: number;
  position: number;
  createdBy: string;
};

export type KanbanColumn = {
  id: string;
  title: string;
  color: string;
};
