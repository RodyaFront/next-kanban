
import { KANBAN_COLUMNS } from "@/shared/constants/kanbanColumns";
import { Task } from "../types/kanban";

export const mockTasks: Task[] = [
    {
      id: "1",
      title: "Design login page",
      description: "Create a modern, responsive login page with email and password fields.",
      status: KANBAN_COLUMNS[0],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      position: 0,
      createdBy: "1",
    },
    {
      id: "2",
      title: "Implement authentication API",
      description: "Develop backend API for user authentication and JWT token issuance.",
      status: KANBAN_COLUMNS[1],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      position: 0,
      createdBy: "2", 
    },
    {
      id: "3",
      title: "Write unit tests for tasks module",
      description: "Cover all edge cases for the kanban tasks logic.",
      status: KANBAN_COLUMNS[0],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      position: 1,
      createdBy: "3", 
    },
    {
      id: "4",
      title: "Deploy to Vercel",
      description: "Set up CI/CD and deploy the app to Vercel for preview.",
      status: KANBAN_COLUMNS[2],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      position: 0,
      createdBy: "1", 
    },
  ];