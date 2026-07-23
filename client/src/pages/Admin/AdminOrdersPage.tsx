import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { AdminTable, Column } from '../../components/admin/ui/AdminTable';
import { AdminBadge } from '../../components/admin/ui/AdminBadge';
import { Eye, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminOrder } from '../../types/admin';

export const AdminOrdersPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: orders = [] } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: adminService.getOrders,
  });

  const filteredOrders = statusFilter === 'all' ? orders : orders.filter((o) => o.orderStatus === statusFilter);

  const columns: Column<AdminOrder>[] = [
    {
      header: 'Order Reference',
      accessor: (order) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-purple-400">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">{order.orderNumber}</div>
            <div className="text-[10px] text-zinc-400 font-mono">
              {new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Customer',
      accessor: (order) => (
        <div>
          <div className="font-semibold text-white text-xs">{order.user?.name}</div>
          <div className="text-[10px] text-zinc-400">{order.user?.email}</div>
        </div>
      ),
    },
    {
      header: 'Total Amount',
      accessor: (order) => <span className="font-extrabold text-white">Rs. {order.total}</span>,
    },
    {
      header: 'Payment Status',
      accessor: (order) => (
        <AdminBadge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
          {order.paymentStatus}
        </AdminBadge>
      ),
    },
    {
      header: 'Fulfillment Status',
      accessor: (order) => (
        <AdminBadge
          variant={
            order.orderStatus === 'delivered'
              ? 'success'
              : order.orderStatus === 'shipped'
              ? 'info'
              : order.orderStatus === 'printing'
              ? 'purple'
              : 'warning'
          }
        >
          {order.orderStatus}
        </AdminBadge>
      ),
    },
    {
      header: 'Actions',
      accessor: (order) => (
        <Link
          to={`/admin/orders/${order.id}`}
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all inline-flex items-center gap-1 text-xs font-semibold"
        >
          <Eye className="w-3.5 h-3.5" /> Details
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Order Fulfillment Pipeline</h1>
          <p className="text-xs text-zinc-400 mt-1">Track customer orders, 3D customizer print queues, and shipping statuses.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'pending', 'processing', 'printing', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
              statusFilter === status
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <AdminTable columns={columns} data={filteredOrders} searchKey="orderNumber" searchPlaceholder="Search order number..." />
    </div>
  );
};
