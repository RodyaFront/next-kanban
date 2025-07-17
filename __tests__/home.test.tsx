import { render, screen } from '@testing-library/react';
import HomePage from '../pages/index';
import { Task } from '@/shared/types/kanban';
import { KANBAN_COLUMNS } from '@/shared/constants/kanbanColumns';

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

  it('должен обновлять задачи после вызова refetchTasks', async () => {
    // TODO: реализовать тест обновления задач через refetchTasks
  });

  it('должен передавать правильные props в KanbanBoard', () => {
    // TODO: реализовать тест передачи props в KanbanBoard
  });
});

describe('getServerSideProps', () => {
  it('должен возвращать задачи при успешном ответе', async () => {
    // TODO: реализовать тест успешного получения задач через getServerSideProps
  });

  it('должен возвращать пустой массив при ошибке', async () => {
    // TODO: реализовать тест обработки ошибки в getServerSideProps
  });
}); 