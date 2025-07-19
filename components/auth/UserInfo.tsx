import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface UserInfoProps {
  className?: string;
}

const UserInfo = ({ className = '' }: UserInfoProps) => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className={`flex items-center space-x-3  rounded-lg ${className}`}>
        <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse" />
        <div className="space-y-1">
          <div className="w-20 h-4 bg-gray-600 rounded animate-pulse" />
          <div className="w-24 h-3 bg-gray-600 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const { user } = session;

  return (
    <div className={`flex items-center space-x-3 rounded-lg ${className}`}>
      {/* Аватар */}
      <div className="flex-shrink-0">
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt={`Аватар ${user.name}`}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
            onError={() => {
              // Fallback если аватар не загрузился
              const fallbackElement = document.querySelector('.avatar-fallback') as HTMLElement;
              if (fallbackElement) {
                fallbackElement.classList.remove('hidden');
              }
            }}
          />
        ) : null}
        {/* Fallback аватар */}
        <div className={`w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white text-sm font-medium avatar-fallback ${user.avatar ? 'hidden' : ''}`}>
          {user.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>

      {/* Информация о пользователе */}
      <div className="flex flex-col min-w-0">
        <span className="text-white font-medium truncate">
          {user.name || 'Неизвестный пользователь'}
        </span>
        <span className="text-gray-400 text-sm truncate">
          {user.email || 'Нет email'}
        </span>
      </div>
    </div>
  );
};

export default UserInfo; 