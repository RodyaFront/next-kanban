import { render, screen } from '@testing-library/react';
import { KanbanColumnBoard } from '@/features/kanban/components/KanbanColumnBoard';
import { KanbanColumn } from '@/shared/types/kanban';

const mockColumn: KanbanColumn = {
  id: 'todo',
  title: 'To Do',
  color: 'bg-yellow-400',
};

describe('KanbanColumnBoard', () => {
  it('отображает плейсхолдер, если задач нет', () => {
    render(<KanbanColumnBoard column={mockColumn} tasks={[]} />);
    expect(screen.getByTestId('empty-column-hint')).toHaveTextContent('No tasks in this column yet');
  });
});
