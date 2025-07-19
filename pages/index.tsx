import { useState, useEffect } from "react";
import { NextPage } from 'next';
import { Task } from '@/shared/types/kanban';
import { KanbanBoard } from '@/features/kanban/KanbanBoard';
import { getTasksSSR, getTasksClient, TaskFilters } from '@/shared/services/kanbanApi';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Header from '@/components/layout/Header';

const HomePage: NextPage<{ tasks: Task[] }> = ({ tasks: initialTasks }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filters, setFilters] = useState<TaskFilters>({});

  const refetchTasks = async (nextFilters?: TaskFilters) => {
    const activeFilters = nextFilters || filters;
    const freshTasks = await getTasksClient(activeFilters);
    setTasks(freshTasks);
  };

  useEffect(() => {
    refetchTasks();
  }, [filters]);

  return (
    <ProtectedRoute>
      <Header />
      <KanbanBoard
        tasks={tasks}
        refetchTasks={refetchTasks}
        filters={filters}
        setFilters={setFilters}
      />
    </ProtectedRoute>
  );
};

import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  let tasks: Task[] = [];
  try {
    tasks = await getTasksSSR(context.req);
  } catch {
    console.error('Error while loading tasks.')
    tasks = [];
  }
  return {
    props: {
      tasks,
    },
  };
};

export default HomePage;