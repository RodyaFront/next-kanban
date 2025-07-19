import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task } from "@/shared/types/kanban";
import { KANBAN_COLUMNS } from "@/shared/constants/kanbanColumns";
import { useKanbanTaskForm } from "@/features/kanban/hooks/useKanbanTaskForm";
import { getUsersForAssignment } from "@/shared/services/userService";
import { User } from "@/shared/types/user";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type KanbanTaskCrudDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreated?: (task: Task) => void;
};

export function KanbanTaskCrudDialog({
  open,
  onOpenChange,
  onTaskCreated,
}: KanbanTaskCrudDialogProps) {
  const {
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
  } = useKanbanTaskForm({ onOpenChange, onTaskCreated });

  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    setUsers(getUsersForAssignment());
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark bg-slate-800 !max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create new task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Title Input */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium text-slate-200"
            >
              Title *
            </label>
            <Input
              id="title"
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
              aria-label="Task title"
            />
          </div>

          <div className="space-y-2 flex gap-2">
            
          {/* Status Select */}
            <div>
              <label
                htmlFor="assignee"
                className="text-sm font-medium text-slate-200"
              >
                Executor *
              </label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                  <SelectValue placeholder="Select executor" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {users.map((user) => (
                    <SelectItem
                      key={user.id}
                      value={user.id}
                      className="text-slate-100 hover:bg-slate-600 focus:bg-slate-600"
                    >
                      <span className="flex items-center gap-2">
                        {user.avatar && (
                          <img
                            src={user.avatar}
                            alt="avatar"
                            className="w-5 h-5 rounded-full"
                          />
                        )}
                        {user.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
          {/* Executor Select */}
            <div>
              <label
                htmlFor="status"
                className="text-sm font-medium text-slate-200"
              >
                Status
              </label>
              <Select
                value={status.id}
                onValueChange={(value) => {
                  const selectedStatus = KANBAN_COLUMNS.find(
                    (col) => col.id === value
                  );
                  if (selectedStatus) setStatus(selectedStatus);
                }}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {KANBAN_COLUMNS.map((column) => (
                    <SelectItem
                      key={column.id}
                      value={column.id}
                      className="text-slate-100 hover:bg-slate-600 focus:bg-slate-600"
                    >
                      {column.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>


          {/* Description Input */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-slate-200"
            >
              Description
            </label>
            <Input
              id="description"
              placeholder="Enter task description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Task description"
            />
          </div>

          {/* Content Markdown Editor */}
          <div className="space-y-2">
            <label
              htmlFor="content"
              className="text-sm font-medium text-slate-200"
            >
              Content (Markdown)
            </label>
            <div data-color-mode="dark">
              <div className="MDEditor-variant">
                <MDEditor
                  value={content}
                  onChange={(value) => setContent(value || "")}
                  preview="edit"
                  textareaProps={{
                    id: "content",
                    placeholder: "Write task details in markdown...",
                    className:
                      "border-slate-600 text-slate-100 placeholder:text-slate-400",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCancel}
              disabled={isSubmitting}
              aria-label="Cancel task creation"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onClick={handleSubmit}
              disabled={!title.trim() || isSubmitting}
              aria-label="Create task"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
