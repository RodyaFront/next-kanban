import {  NextPage } from 'next';
import { Task } from '@/shared/types/kanban';
import { KanbanBoard } from '@/features/kanban/KanbanBoard';

interface Props {
  tasks: Task[];
}

const HomePage: NextPage<Props> = ({tasks}) => {
  return (
      <KanbanBoard tasks={tasks}/>
  );
};

import { GetServerSideProps } from 'next';
import { getTasksSSR } from '@/shared/services/kanbanApi';

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