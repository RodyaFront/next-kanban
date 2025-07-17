import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@/features/store";
import { DragDropContext } from "@hello-pangea/dnd";
import { KanbanColumnBoard } from "@/features/kanban/components/KanbanColumnBoard";
import { KanbanColumn } from "@/shared/types/kanban";
import {
  KANBAN_COLUMN_EMPTY_HINT,
  KANBAN_COLUMN_EMPTY_HINT_VARIANT,
} from "@/features/kanban/components/KanbanColumnBoard.constants";

const mockColumn: KanbanColumn = {
  id: "todo",
  title: "To Do",
  color: "bg-yellow-400",
};

describe("KanbanColumnBoard", () => {
  it("отрисовывает задачи, если они есть", () => {
    const tasks = [
      {
        id: "1",
        title: "Test Task",
        status: mockColumn,
        position: 0,
        createdAt: 0,
        updatedAt: 0,
      },
    ];
    render(
      <Provider store={store}>
        <DragDropContext onDragEnd={() => {}}>
          <KanbanColumnBoard column={mockColumn} tasks={tasks} allTasks={tasks} />
        </DragDropContext>
      </Provider>
    );
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });
  it("отображает плейсхолдер, если задач нет", () => {
    render(
      <Provider store={store}>
        <DragDropContext onDragEnd={() => {}}>
          <KanbanColumnBoard column={mockColumn} tasks={[]} allTasks={[]} />
        </DragDropContext>
      </Provider>
    );
    expect(screen.getByTestId("empty-column-hint")).toHaveTextContent(
      KANBAN_COLUMN_EMPTY_HINT
    );
  });
  it("отображает плейсхолдер, если задачи есть, но не в текущей колонке", () => {
    render(
      <Provider store={store}>
        <DragDropContext onDragEnd={() => {}}>
          <KanbanColumnBoard
            column={mockColumn}
            tasks={[]}
            allTasks={[
              {
                id: "1",
                title: "Test",
                status: { id: "done", title: "Done", color: "bg-green-400" },
                position: 0,
                createdAt: 0,
                updatedAt: 0,
              },
            ]}
          />
        </DragDropContext>
      </Provider>
    );
    expect(screen.getByTestId("empty-column-hint")).toHaveTextContent(
      KANBAN_COLUMN_EMPTY_HINT_VARIANT
    );
  });
});
