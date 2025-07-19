import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import '@/types/auth'
import { findUserByEmail, validateUserPassword, removePasswordFromUser } from '@/shared/services/userService';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = findUserByEmail(credentials.email);
        
        if (!user || !validateUserPassword(user, credentials.password)) {
          return null;
        }

        return removePasswordFromUser(user);
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub || '';
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
}); 