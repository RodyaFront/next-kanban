import { render, screen } from '@testing-library/react';
import HomePage, { getServerSideProps } from '@/pages/index';
import { Task } from '@/shared/types/kanban';
import { KANBAN_COLUMNS } from '@/shared/constants/kanbanColumns';
import { KanbanBoard } from '@/features/kanban/KanbanBoard';
import { getTasksSSR } from '@/shared/services/kanbanApi';

jest.mock('@/shared/services/kanbanApi', () => ({
  getTasksSSR: jest.fn(),
}));

describe('HomePage', () => {
  it('должен отображать задачи, переданные через props', () => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Test Task 1',
        description: '',
        status: KANBAN_COLUMNS[0],
        createdAt: 0,
        updatedAt: 0,
        position: 0,
      },
      {
        id: '2',
        title: 'Test Task 2',
        description: '',
        status: KANBAN_COLUMNS[1],
        createdAt: 0,
        updatedAt: 0,
        position: 1,
      },
    ];

    render(<HomePage tasks={mockTasks} />);

    // Проверяем, что обе задачи отображаются
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
  });

  it('KanbanBoard рендерится без ошибок и содержит кнопку добавления задачи', () => {
    render(<KanbanBoard tasks={[]} refetchTasks={jest.fn()} />);
    expect(screen.getByText('Add task +')).toBeInTheDocument();
  });

  it('SSR: возвращает задачи с сервера', async () => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'SSR Task',
        description: '',
        status: KANBAN_COLUMNS[0],
        createdAt: 0,
        updatedAt: 0,
        position: 0,
      },
    ];
    (getTasksSSR as jest.Mock).mockResolvedValueOnce(mockTasks);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await getServerSideProps({ req: {} } as any);
    expect(result).toEqual({ props: { tasks: mockTasks } });
  });

  it('SSR: возвращает пустой массив, если getTasksSSR падает', async () => {
    (getTasksSSR as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await getServerSideProps({ req: {} } as any);
    expect(result).toEqual({ props: { tasks: [] } });
  });
});