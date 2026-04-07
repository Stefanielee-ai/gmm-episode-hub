import { useEffect, useState } from 'react';

const AUTH_WORKER = 'https://gmm-auth.lojajhon86.workers.dev';

interface User {
  email: string;
  name: string;
  picture?: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${AUTH_WORKER}/auth/me`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <span className="font-bold text-lg tracking-tight text-gray-900">GMM Episode Hub</span>
      <div className="flex items-center gap-3">
        {loading ? (
          <span className="text-sm text-gray-400">Loading...</span>
        ) : user ? (
          <>
            {user.picture && (
              <img
                src={user.picture}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-gray-200"
              />
            )}
            <span className="text-sm text-gray-700 hidden sm:block">{user.email}</span>
            <a
              href={`${AUTH_WORKER}/auth/logout`}
              className="text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              退出
            </a>
          </>
        ) : (
          <a
            href={`${AUTH_WORKER}/auth/login`}
            className="flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 1 1 0-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0 0 12.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
            </svg>
            Google 登录
          </a>
        )}
      </div>
    </nav>
  );
}
