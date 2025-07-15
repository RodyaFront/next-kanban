import { Task } from "@/shared/types/kanban";
import { KanbanTaskCard } from "./components/KanbanTaskCard";
import { KANBAN_COLUMNS } from "@/shared/constants/kanbanColumns";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
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

export function KanbanBoard({ tasks: initialTasks, refetchTasks }: Props) {
  const [localTasks, setLocalTasks] = useState(initialTasks);
  const [isCrudDialogVisible, setCrudDialogVisibility] = useState(false);

  useEffect(() => {
    setLocalTasks(initialTasks);
  }, [initialTasks]);

  const toggleCrudDialog = () => setCrudDialogVisibility(!isCrudDialogVisible);

  // Группируем задачи по колонкам
  const tasksByColumn = KANBAN_COLUMNS.map((column) => ({
    ...column,
    tasks: localTasks
      .filter((task) => task.status?.id === column.id)
      .sort((a, b) => a.position - b.position),
  }));

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // Получаем “чистые” колонки
    const sourceColumn = KANBAN_COLUMNS.find(col => col.id === source.droppableId);
    const destColumn = KANBAN_COLUMNS.find(col => col.id === destination.droppableId);
    if (!sourceColumn || !destColumn) return;

    // Копируем задачи
    const sourceTasks = localTasks
      .filter(task => task.status?.id === sourceColumn.id)
      .sort((a, b) => a.position - b.position);
    const destTasks = source.droppableId === destination.droppableId
      ? sourceTasks
      : localTasks
          .filter(task => task.status?.id === destColumn.id)
          .sort((a, b) => a.position - b.position);

    // Перемещаем таск
    const [movedTask] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, {
      ...movedTask,
      status: destColumn,
    });

    // Пересчитываем позиции
    const updatedSourceTasks = sourceTasks.map((task, idx) => ({
      ...task,
      position: idx,
      status: sourceColumn,
    }));
    const updatedDestTasks = destTasks.map((task, idx) => ({
      ...task,
      position: idx,
      status: destColumn,
    }));

    // Обновляем задачи на сервере параллельно
    const tasksToUpdate =
      source.droppableId === destination.droppableId
        ? updatedDestTasks
        : [...updatedSourceTasks, ...updatedDestTasks];

    // 1. Optimistic update
    setLocalTasks((prevTasks) => {
      // Скопируйте prevTasks и примените к ним все изменения из tasksToUpdate
      const updated = prevTasks.map((task) => {
        const updatedTask = tasksToUpdate.find((t) => t.id === task.id);
        return updatedTask
          ? {
              ...task,
              position: updatedTask.position,
              status: {
                id: updatedTask.status.id,
                title: updatedTask.status.title,
                color: updatedTask.status.color,
              },
            }
          : task;
      });
      return updated;
    });

    // 2. Серверное обновление
    await Promise.all(
      tasksToUpdate.map(task =>
        updateTask(task.id, {
          position: task.position,
          status: {
            id: task.status.id,
            title: task.status.title,
            color: task.status.color,
          },
        })
      )
    );

    // 3. Синхронизация с сервером
    await refetchTasks();
  };

  return (
    <div className="p-4 bg-slate-900 min-h-screen text-slate-100">
      <div className="pb-4 flex justify-between">
        <div>Tasks ({localTasks?.length})</div>
        <Button variant="default" onClick={toggleCrudDialog}>
          Add task +
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-2 tasks-container overflow-x-auto">
          {tasksByColumn.map((column) => (
            <div
              key={column.id}
              className="flex flex-col p-4 rounded-lg bg-slate-800"
            >
              <div className="pb-4">
                <b>{column.title}</b>
              </div>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-col min-w-[24rem] flex-grow"
                  >
                    <div className="flex flex-col overflow-auto">
                      {column.tasks.map((task, idx) => (
                        <Draggable draggableId={task.id} index={idx} key={task.id}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={idx !== column.tasks.length - 1 ? "mb-2" : ""}
                            >
                              <KanbanTaskCard task={task} dragHandleProps={provided.dragHandleProps ?? undefined} />
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
