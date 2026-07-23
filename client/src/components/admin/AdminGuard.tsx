import React from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { ShieldAlert, LogIn } from 'lucide-react';

export const AdminGuard: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();

  // If not logged in, redirect to login page
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but role is customer (not admin), show 403 Forbidden Screen
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-500/10">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">403 — Admin Access Required</h1>
        <p className="text-zinc-400 max-w-md mb-8">
          You are currently logged in as <span className="text-white font-medium">{user.email}</span> ({user.role}). Administrator privileges are required to view the Geek Hell Admin Control Center.
        </p>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-red-600/20"
          >
            <LogIn className="w-4 h-4" /> Switch Account
          </Link>
          <Link
            to="/"
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-6 py-3 rounded-xl font-semibold transition-all"
          >
            Back to Storefront
          </Link>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
