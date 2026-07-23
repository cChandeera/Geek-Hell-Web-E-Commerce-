import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { ShieldCheck, Key, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || 'Admin Master');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Admin profile updated successfully');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Administrator Account & Security</h1>
        <p className="text-xs text-zinc-400 mt-1">Manage your admin profile, credentials, and access credentials.</p>
      </div>

      <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-zinc-800">
          <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center font-extrabold text-red-400 text-2xl">
            {name[0]?.toUpperCase() || 'A'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{name}</h2>
            <div className="text-xs text-zinc-400">{user?.email || 'admin@geekhell.com'}</div>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20 mt-1">
              <ShieldCheck className="w-3 h-3" /> System Administrator
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-zinc-800 space-y-4">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-500" /> Change Administrator Password
            </h3>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Current Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">New Secure Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg shadow-red-600/30"
            >
              <Save className="w-4 h-4" /> Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
