import { useState, useCallback } from "react";
import { KANBAN_COLUMNS } from "@/shared/constants/kanbanColumns";
import { addTask } from "@/shared/services/kanbanApi";
import { Task, KanbanColumn } from "@/shared/types/kanban";

type UseKanbanTaskFormProps = {
  onOpenChange: (open: boolean) => void;
  onTaskCreated?: (task: Task) => void;
};

export const useKanbanTaskForm = ({
  onOpenChange,
  onTaskCreated,
}: UseKanbanTaskFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<KanbanColumn>(KANBAN_COLUMNS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [assignee, setAssignee] = useState("");

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setStatus(KANBAN_COLUMNS[0]);
    setContent("");
    setAssignee("");
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!title.trim()) return;
    if (!assignee) return;
    setIsSubmitting(true);
    try {
      const newTask = await addTask({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        position: 0,
        content: content || undefined,
        assignee,
      });
      resetForm();
      onOpenChange(false);
      onTaskCreated?.(newTask);
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [title, description, status, content, assignee, onOpenChange, onTaskCreated, resetForm]);

  const handleCancel = useCallback(() => {
    resetForm();
    onOpenChange(false);
  }, [resetForm, onOpenChange]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return {
    title,
    setTitle,
    description,
    setDescription,
    status,
    setStatus,
    content,
    setContent,
    assignee,
    setAssignee,
    isSubmitting,
    handleSubmit,
    handleCancel,
    handleKeyDown,
  };
};