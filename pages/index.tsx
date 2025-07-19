import { useState } from "react";
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { Task } from '@/shared/types/kanban';
import { KanbanBoard } from '@/features/kanban/KanbanBoard';
import { getTasksSSR, getTasksClient } from '@/shared/services/kanbanApi';

const HomePage: NextPage<{ tasks: Task[] }> = ({ tasks: initialTasks }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const { data: session, status } = useSession();

  // Консоль лог для проверки сессии
  console.log('Session status:', status);
  console.log('Session data:', session);

  const refetchTasks = async () => {
    const freshTasks = await getTasksClient();
    setTasks(freshTasks);
  };

  return (
    <KanbanBoard tasks={tasks} refetchTasks={refetchTasks} />
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