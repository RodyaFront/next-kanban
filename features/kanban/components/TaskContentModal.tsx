import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
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

type Props = {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (updatedTask: Task) => void; // новый проп
};

// SSR-friendly динамический импорт (Next.js best practice)
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export const TaskContentModal: React.FC<Props> = ({ open, task, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(KANBAN_COLUMNS[0]);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setStatus(task.status);
      setContent(task.content || "");
    }
  }, [task]);

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="dark bg-slate-800 !max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-slate-200">Edit task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {/* Title + Status в один ряд */}
          <div className="flex gap-2">
            {/* Title */}
            <div className="flex-1 space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-slate-200">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
                aria-label="Task title"
              />
            </div>
            {/* Status */}
            <div className="flex-shrink space-y-2">
              <label htmlFor="status" className="text-sm font-medium text-slate-200">
                Status
              </label>
              <Select
                value={status.id}
                onValueChange={value => {
                  const selected = KANBAN_COLUMNS.find(col => col.id === value);
                  if (selected) setStatus(selected);
                }}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {KANBAN_COLUMNS.map(column => (
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
          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-slate-200">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Task description"
            />
          </div>
          {/* Content (Markdown Editor) */}
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium text-slate-200">
              Content (Markdown)
            </label>
            <div data-color-mode="dark">
              <div className="MDEditor-variant">
              <MDEditor
                value={content}
                onChange={value => setContent(value || "")}
                height={200}
                preview="edit"
                textareaProps={{
                  id: "content",
                  placeholder: "Write task details in markdown...",
                  className:
                    " border-slate-600 text-slate-100 placeholder:text-slate-400",
                }}
              />
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full mt-4">
          <DialogClose asChild>
            <Button variant="outline" className="flex-1" aria-label="Cancel edit">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="default"
            className="flex-1"
            onClick={() => {
              if (!task) return;
              onSave({
                ...task,
                title,
                description,
                status,
                content,
                updatedAt: Date.now(),
              });
              onClose();
            }}
            aria-label="Save changes"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
