import { User, UserRepository, UserWithoutPassword } from '../types/user';
import { UserRole } from '../constants/userRoles';

// Моковые пользователи (в реальном приложении это будет база данных)
const users: User[] = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: UserRole.ADMIN,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  },
  {
    id: '2',
    name: 'Manager',
    email: 'manager@example.com',
    password: 'manager123',
    role: UserRole.MANAGER,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager',
  },
  {
    id: '3',
    name: 'Developer',
    email: 'developer@example.com',
    password: 'dev123',
    role: UserRole.DEVELOPER,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=developer',
  },
];

class MockUserRepository implements UserRepository {
  findByEmail(email: string): User | undefined {
    return users.find(user => user.email === email);
  }

  validatePassword(user: User, password: string): boolean {
    return user.password === password;
  }

  getAllUsers(): User[] {
    return [...users];
  }
}

// Экспортируем экземпляр репозитория
export const userRepository = new MockUserRepository();

// Вспомогательные функции
export const findUserByEmail = (email: string): User | undefined => {
  return userRepository.findByEmail(email);
};

export const validateUserPassword = (user: User, password: string): boolean => {
  return userRepository.validatePassword(user, password);
};

export const removePasswordFromUser = (user: User): UserWithoutPassword => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const getAllUsers = (): User[] => {
  return userRepository.getAllUsers();
};

export const getUsersForAssignment = (): User[] => {
  // Возвращаем всех пользователей кроме администратора для назначения задач
  return users.filter(user => user.role !== UserRole.ADMIN);
};

export const getUserName = (id: string): string => {
  const user = users.find(u => u.id === id);
  return user?.name || 'Unknown user';
}; 