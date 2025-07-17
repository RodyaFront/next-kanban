import { Droppable, Draggable } from "@hello-pangea/dnd";
import { KanbanTaskCard } from "./KanbanTaskCard";
import { KanbanColumn, Task } from "@/shared/types/kanban";
import {
  KANBAN_COLUMN_EMPTY_HINT,
  KANBAN_COLUMN_EMPTY_HINT_VARIANT,
} from "./KanbanColumnBoard.constants";

interface KanbanColumnBoardProps {
  column: KanbanColumn;
  tasks: Task[];
  allTasks: Task[];
}

export function KanbanColumnBoard({
  column,
  tasks,
  allTasks = [],
}: KanbanColumnBoardProps) {
  const showEmptyHint = tasks.length === 0;
  const showVariant = showEmptyHint && allTasks.length > 0;

  return (
    <div className="flex flex-col rounded-lg border border-dashed border-slate-800">
      <div className="px-4 pt-4 pb-2">
        <b>{column.title}</b>
        <span
          className={`ml-2 inline-block w-2 h-2 rounded-full mr-2 ${column.color}`}
          aria-label={"Status"}
        />
      </div>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={
              "flex px-4 pb-4 pt-2 flex-col min-w-[24rem] flex-grow border-2 scrollbar-hide " +
              (snapshot.isDraggingOver
                ? "bg-slate-800/70 border-blue-400"
                : "border-transparent")
            }
          >
            <div className="flex flex-col overflow-auto flex-grow">
              {showEmptyHint && (
                <div
                  className="flex flex-col justify-center flex-grow text-center py-4 text-slate-300/30"
                  data-testid="empty-column-hint"
                >
                  {showVariant
                    ? KANBAN_COLUMN_EMPTY_HINT_VARIANT
                    : KANBAN_COLUMN_EMPTY_HINT}
                </div>
              )}
              {tasks.map((task, idx) => (
                <Draggable draggableId={task.id} index={idx} key={task.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={idx !== tasks.length - 1 ? "mb-2" : ""}
                    >
                      <KanbanTaskCard
                        task={task}
                        dragHandleProps={provided.dragHandleProps ?? undefined}
                      />
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
  );
}
