import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'manager' | 'developer';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (requiredRole && session.user.role !== requiredRole) {
      router.push('/');
      return;
    }
  }, [session, status, router, requiredRole]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (requiredRole && session.user.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 