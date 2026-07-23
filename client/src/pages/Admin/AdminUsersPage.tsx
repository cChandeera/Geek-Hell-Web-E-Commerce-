import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { AdminTable, Column } from '../../components/admin/ui/AdminTable';
import { AdminBadge } from '../../components/admin/ui/AdminBadge';
import { ShieldCheck, UserX, UserCheck } from 'lucide-react';
import { AdminUser } from '../../types/admin';
import toast from 'react-hot-toast';

export const AdminUsersPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: adminService.getUsers,
  });

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: 'customer' | 'admin' }) =>
      adminService.updateUserRole(userId, role),
    onSuccess: () => {
      toast.success('User role updated');
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: 'active' | 'inactive' | 'blocked' }) =>
      adminService.updateUserStatus(userId, status),
    onSuccess: () => {
      toast.success('User status updated');
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });

  const columns: Column<AdminUser>[] = [
    {
      header: 'Account User',
      accessor: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center font-bold text-red-400 text-xs">
            {u.name[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div className="font-bold text-white text-sm">{u.name}</div>
            <div className="text-xs text-zinc-400">{u.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessor: (u) => (
        <AdminBadge variant={u.role === 'admin' ? 'error' : 'neutral'}>
          {u.role === 'admin' ? 'Administrator' : 'Customer'}
        </AdminBadge>
      ),
    },
    {
      header: 'Status',
      accessor: (u) => (
        <AdminBadge variant={u.status === 'active' ? 'success' : 'error'}>
          {u.status}
        </AdminBadge>
      ),
    },
    {
      header: 'Total Orders',
      accessor: (u) => <span className="font-mono text-zinc-300">{u.orderCount || 0} Orders</span>,
    },
    {
      header: 'Actions',
      accessor: (u) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => roleMutation.mutate({ userId: u.id, role: u.role === 'admin' ? 'customer' : 'admin' })}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-all text-xs font-semibold"
            title={u.role === 'admin' ? 'Demote to Customer' : 'Promote to Admin'}
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </button>

          <button
            onClick={() =>
              statusMutation.mutate({ userId: u.id, status: u.status === 'active' ? 'blocked' : 'active' })
            }
            className={`p-2 rounded-lg transition-all text-xs font-semibold ${
              u.status === 'active'
                ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
            }`}
            title={u.status === 'active' ? 'Block Account' : 'Unblock Account'}
          >
            {u.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">User Account Administration</h1>
        <p className="text-xs text-zinc-400 mt-1">Manage platform customers, admin privileges, and account security statuses.</p>
      </div>

      <AdminTable columns={columns} data={users} searchKey="email" searchPlaceholder="Search by user email..." />
    </div>
  );
};
