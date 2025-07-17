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
  DraggableLocation,
} from "@hello-pangea/dnd";
import { updateTask } from "@/shared/services/kanbanApi";
import { KanbanColumn } from "@/shared/types/kanban";
import { KanbanColumnBoard } from "./components/KanbanColumnBoard";

interface Props {
  tasks: Task[];
  refetchTasks: () => void;
}

function moveTaskAndRecalculatePositions(
  localTasks: Task[],
  source: DraggableLocation,
  destination: DraggableLocation,
  sourceColumn: KanbanColumn,
  destColumn: KanbanColumn
): {
  updatedSourceTasks: Task[];
  updatedDestTasks: Task[];
  tasksToUpdate: Task[];
} {
  // Получаем “чистые” колонки
  const sourceColumnId = source.droppableId;
  const destColumnId = destination.droppableId;

  // Копируем задачи
  const sourceTasks = localTasks
    .filter((task) => task.status?.id === sourceColumnId)
    .sort((a, b) => a.position - b.position);
  const destTasks =
    sourceColumnId === destColumnId
      ? sourceTasks
      : localTasks
          .filter((task) => task.status?.id === destColumnId)
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
    sourceColumnId === destColumnId
      ? updatedDestTasks
      : [...updatedSourceTasks, ...updatedDestTasks];

  return { tasksToUpdate };
}

function applyOptimisticUpdate(
  prevTasks: Task[],
  tasksToUpdate: Task[]
): Task[] {
  return prevTasks.map((task) => {
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
}

async function updateTasksOnServer(tasksToUpdate: Task[]) {
  return Promise.all(
    tasksToUpdate.map((task) =>
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
    if (!result.destination) return;
    if (
      result.source.droppableId === result.destination.droppableId &&
      result.source.index === result.destination.index
    )
      return;

    const sourceColumn = KANBAN_COLUMNS.find(
      (col) => col.id === result.source.droppableId
    );
    const destColumn = KANBAN_COLUMNS.find(
      (col) => col.id === result.destination!.droppableId
    );
    if (!sourceColumn || !destColumn) return;

    const { tasksToUpdate } = moveTaskAndRecalculatePositions(
      localTasks,
      result.source,
      result.destination,
      sourceColumn,
      destColumn
    );

    setLocalTasks((prevTasks) =>
      applyOptimisticUpdate(prevTasks, tasksToUpdate)
    );

    await updateTasksOnServer(tasksToUpdate);

    await refetchTasks();
  };

  return (
    <div className="p-4 bg-slate-900 min-h-screen text-slate-100">
      <div className="pb-4 flex gap-2">
        <Button variant="default" onClick={toggleCrudDialog}>
          Add task +
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-2 tasks-container overflow-x-auto">
          {tasksByColumn.map((column) => (
            <KanbanColumnBoard
              key={column.id}
              column={column}
              tasks={column.tasks}
              allTasks={localTasks}
            />
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
