import { UserRole } from '../constants/userRoles';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;
  avatar?: string; 
}

export interface UserWithoutPassword {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string; 
}

export interface UserRepository {
  findByEmail(email: string): User | undefined;
  validatePassword(user: User, password: string): boolean;
  getAllUsers(): User[];
}

export interface LoginCredentials {
  email: string;
  password: string;
} 