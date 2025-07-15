import { Task } from "@/shared/types/kanban";
import { KanbanTaskCard } from "./components/KanbanTaskCard";
import { KANBAN_COLUMNS } from "@/shared/constants/kanbanColumns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { KanbanTaskCrudDialog } from "./components/KanbanTaskCrudDialog";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { updateTask } from "@/shared/services/kanbanApi";

interface Props {
  tasks: Task[];
  refetchTasks: () => void;
}

export function KanbanBoard({ tasks, refetchTasks }: Props) {
  const [isCrudDialogVisible, setCrudDialogVisibility] = useState(false);

  const toggleCrudDialog = () => setCrudDialogVisibility(!isCrudDialogVisible);

  // Группируем задачи по колонкам
  const tasksByColumn = KANBAN_COLUMNS.map((column) => ({
    ...column,
    tasks: tasks.filter((task) => task.status?.id === column.id),
  }));

  // Обработчик завершения перетаскивания
  const handleDragEnd = async (result: DropResult) => {
    console.log(result);

    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const taskId = draggableId;
    const newStatusId = destination.droppableId;
    const newStatus = KANBAN_COLUMNS.find((col) => col.id === newStatusId);
    if (!newStatus) return;

    // Обновляем статус задачи через API
    await updateTask(taskId, { status: newStatus });
    await refetchTasks();
  };

  return (
    <div className="p-4 bg-slate-900 min-h-screen text-slate-100">
      <div className="pb-4 flex justify-between">
        <div>Tasks ({tasks?.length})</div>
        <Button variant="default" onClick={toggleCrudDialog}>
          Add task +
        </Button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-2 tasks-container overflow-x-auto">
          {tasksByColumn.map((column) => (
            <div key={column.id} className="flex flex-col p-4 rounded-lg bg-slate-800">
              <div className="pb-4">
                <b>{column.title}</b>
              </div>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-col gap-2 min-w-[24rem] flex-grow"
                  >
                    <div className="flex flex-col gap-1 overflow-auto">
                      {column.tasks.map((task, idx) => (
                        <Draggable
                          draggableId={task.id}
                          index={idx}
                          key={task.id}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <KanbanTaskCard task={task} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
      <KanbanTaskCrudDialog
        open={isCrudDialogVisible}
        onOpenChange={setCrudDialogVisibility}
        onTaskCreated={refetchTasks}
      />
    </div>
  );
}
