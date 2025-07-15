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
    title, setTitle,
    description, setDescription,
    status, setStatus,
    isSubmitting,
    handleSubmit,
    handleCancel,
    handleKeyDown,
  } = useKanbanTaskForm({ onOpenChange, onTaskCreated });


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark bg-slate-800">
        <DialogHeader>
          <DialogTitle>Create new task</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {/* Title Input */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-slate-200">
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

          {/* Description Input */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-slate-200">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter task description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex min-h-[80px] w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Task description"
            />
          </div>

          {/* Status Select */}
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium text-slate-200">
              Status
            </label>
            <Select value={status.id} onValueChange={(value) => {
              const selectedStatus = KANBAN_COLUMNS.find(col => col.id === value);
              if (selectedStatus) setStatus(selectedStatus);
            }}>
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
