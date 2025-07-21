import { useSession, signOut } from 'next-auth/react';
import { Button } from '../ui/button';
import UserInfo from '../auth/UserInfo';

const Header = () => {
  const { data: session, status } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  if (status === 'loading') {
    return (
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-white text-xl font-bold">Kanban Board</h1>
            <div className="text-gray-400">Loading...</div>
          </div>
        </div>
      </header>
    );
  }

  if (!session) {
    return (
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-white text-xl font-bold">Kanban Board</h1>
            <Button
              onClick={() => window.location.href = '/auth/signin'}
              variant="outline"
              size="sm"
            >
              Sign in
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-slate-800">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-xl font-bold">Kanban Board</h1>
          <div className="flex items-center space-x-4">
            <UserInfo/>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              aria-label="Logout from application"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 