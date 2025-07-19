import 'next-auth';
import { UserRole } from '../shared/constants/userRoles';

// Расширяем типы NextAuth
declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole;
  }
} 