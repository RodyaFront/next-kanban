import { addTask } from "@/lib/taskService";
import { Task } from "@/shared/types/kanban";
import { useState } from "react";

export const useTaskApi = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const createTask = async (taskData: Task) => {
      setIsSubmitting(true);
      try {
        const newTask = await addTask(taskData);
        return { success: true, data: newTask };
      } catch (error) {
        return { success: false, error };
      } finally {
        setIsSubmitting(false);
      }
    };
    
    return { createTask, isSubmitting };
  };