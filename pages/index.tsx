import { useState } from "react";
import { NextPage } from 'next';
import { Task } from '@/shared/types/kanban';
import { KanbanBoard } from '@/features/kanban/KanbanBoard';
import { getTasksSSR, getTasksClient } from '@/shared/services/kanbanApi';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Header from '@/components/layout/Header';

const HomePage: NextPage<{ tasks: Task[] }> = ({ tasks: initialTasks }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const refetchTasks = async () => {
    const freshTasks = await getTasksClient();
    setTasks(freshTasks);
  };

  return (
    <ProtectedRoute>
        <Header />
        <KanbanBoard tasks={tasks} refetchTasks={refetchTasks} />
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