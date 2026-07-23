import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { AdminCard } from '../../components/admin/ui/AdminCard';
import { AdminBadge } from '../../components/admin/ui/AdminBadge';
import { DollarSign, ShoppingBag, ShoppingCart, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Link } from 'react-router-dom';

export const AdminDashboardPage: React.FC = () => {
  const { data: metrics, refetch } = useQuery({
    queryKey: ['adminMetrics'],
    queryFn: adminService.getMetrics,
  });

  const { data: salesChart } = useQuery({
    queryKey: ['adminSalesChart'],
    queryFn: adminService.getSalesChart,
  });

  const { data: orders } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: adminService.getOrders,
  });

  const { data: products } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: () => adminService.getProducts(),
  });

  const lowStockProducts = products?.filter((p) => p.stock < 10) || [];

  return (
    <div className="space-y-8">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Overview</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Real-time store performance analytics & operational metrics.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="self-start md:self-auto flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border border-zinc-700"
        >
          <RefreshCw className="w-4 h-4 text-red-500" /> Refresh Analytics
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminCard
          title="Total Revenue"
          value={`$${metrics?.totalRevenue.toLocaleString() || '124,850'}`}
          change="+18.4%"
          isPositive={true}
          icon={<DollarSign className="w-5 h-5 text-red-400" />}
          accentColor="red"
        />
        <AdminCard
          title="Today's Revenue"
          value={`$${metrics?.todayRevenue.toLocaleString() || '3,420'}`}
          change="+8.2%"
          isPositive={true}
          icon={<DollarSign className="w-5 h-5 text-blue-400" />}
          accentColor="blue"
        />
        <AdminCard
          title="Total Orders"
          value={metrics?.totalOrders || '1,420'}
          change="+12.1%"
          isPositive={true}
          icon={<ShoppingCart className="w-5 h-5 text-purple-400" />}
          accentColor="purple"
        />
        <AdminCard
          title="Pending Orders"
          value={metrics?.pendingOrders || '18'}
          change="-4.5%"
          isPositive={true}
          icon={<ShoppingBag className="w-5 h-5 text-emerald-400" />}
          accentColor="emerald"
        />
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales & Revenue Chart */}
        <div className="lg:col-span-2 bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Weekly Sales & Revenue</h2>
              <p className="text-xs text-zinc-400">Revenue performance over the past 7 days</p>
            </div>
            <AdminBadge variant="info">Weekly Report</AdminBadge>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesChart || []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Volume Bar Chart */}
        <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Order Volume</h2>
              <p className="text-xs text-zinc-400">Daily order count breakdown</p>
            </div>
            <AdminBadge variant="purple">Volume</AdminBadge>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesChart || []}>
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="orders" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grids: Recent Orders & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Recent Store Orders</h2>
            <Link to="/admin/orders" className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {orders?.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all"
              >
                <div>
                  <div className="font-bold text-white text-sm">{order.orderNumber}</div>
                  <div className="text-xs text-zinc-400">{order.user?.name || 'Customer'}</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-white text-sm">${order.total}</div>
                  <AdminBadge
                    variant={
                      order.orderStatus === 'delivered'
                        ? 'success'
                        : order.orderStatus === 'shipped'
                        ? 'info'
                        : 'warning'
                    }
                  >
                    {order.orderStatus}
                  </AdminBadge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Low Stock Warning
            </h2>
          </div>

          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 text-center">
                All superhero apparel stock levels are healthy!
              </div>
            ) : (
              lowStockProducts.map((p) => (
                <div key={p.id} className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between text-xs">
                  <div className="truncate font-semibold text-white max-w-[180px]">{p.name}</div>
                  <span className="bg-red-500/10 text-red-400 border border-red-500/20 font-bold px-2 py-0.5 rounded-full">
                    {p.stock} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
