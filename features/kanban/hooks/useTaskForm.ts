import { KANBAN_COLUMNS } from "@/shared/constants/kanbanColumns";
import { useState } from "react";

export const useTaskForm = () => {
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      status: KANBAN_COLUMNS[0]
    });
    
    const resetForm = () => setFormData({
      title: "",
      description: "",
      status: KANBAN_COLUMNS[0]
    });
    
    return { formData, setFormData, resetForm };
  };
  