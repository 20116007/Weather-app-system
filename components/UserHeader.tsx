'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { LogOut, User, LogIn } from 'lucide-react';

export default function UserHeader() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-3">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-white text-sm font-medium">{session.user?.name}</div>
              <div className="text-white/60 text-xs">{session.user?.email}</div>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="ml-2 p-2 hover:bg-white/20 rounded-xl transition-all duration-300 group"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 text-white/70 group-hover:text-white" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4 z-20">
      <div className="flex gap-2">
        <Link
          href="/login"
          className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 px-4 py-2 text-white hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          <span className="hidden sm:inline">Sign In</span>
        </Link>
        <Link
          href="/signup"
          className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl px-4 py-2 text-white hover:shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Up</span>
        </Link>
      </div>
    </div>
  );
}