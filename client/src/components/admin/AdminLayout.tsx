import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  ShoppingCart,
  Users,
  Palette,
  Ticket,
  Star,
  Settings,
  User,
  LogOut,
  Bell,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Products', path: '/admin/products', icon: ShoppingBag },
  { label: 'Categories', path: '/admin/categories', icon: FolderTree },
  { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: '3D Designs', path: '/admin/custom-designs', icon: Palette },
  { label: 'Coupons', path: '/admin/coupons', icon: Ticket },
  { label: 'Reviews', path: '/admin/reviews', icon: Star },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const currentNav = NAV_ITEMS.find((item) => location.pathname.startsWith(item.path)) || { label: 'Admin' };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex font-sans selection:bg-red-500/30">
      {/* Desktop Glass Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#121215]/90 border-r border-zinc-800/80 flex-col sticky top-0 h-screen z-30 backdrop-blur-xl">
        {/* Brand Header */}
        <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <img src="/geekhell.png" alt="Geek Hell Logo" className="w-9 h-9 object-contain" />
            <div>
              <span className="font-extrabold tracking-wider text-lg text-white block leading-none">
                GEEK <span className="text-red-500">HELL</span>
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-zinc-400 uppercase">
                Admin Control
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600/20 to-red-600/5 text-white border border-red-500/30 shadow-lg shadow-red-600/10'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-red-500' : 'text-zinc-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Quick Storefront Link & User Info Footer */}
        <div className="p-4 border-t border-zinc-800/80 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 transition-all"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" /> View Storefront
            </span>
          </Link>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center font-bold text-red-400 text-xs">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">{user?.name || 'Admin'}</div>
                <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-red-500" /> Administrator
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-[#121215]/80 backdrop-blur-xl border-b border-zinc-800/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <span className="text-zinc-500">Admin</span>
              <span>/</span>
              <span className="text-white font-bold">{currentNav.label}</span>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-500" />
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-80 bg-[#121215] border border-zinc-800 rounded-2xl shadow-2xl p-4 z-50 text-white"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Admin Alerts
                      </span>
                      <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">
                        3 New
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs">
                        <div className="font-bold text-white mb-0.5">New Order #GH-M89X21</div>
                        <div className="text-zinc-400">Tony Stark placed an order for $140</div>
                        <div className="text-[10px] text-zinc-500 mt-1">10 mins ago</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs">
                        <div className="font-bold text-amber-400 mb-0.5">Low Stock Alert</div>
                        <div className="text-zinc-400">Iron Man Mark 85 Oversized Tee (3 left)</div>
                        <div className="text-[10px] text-zinc-500 mt-1">1 hour ago</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-red-600/30 border border-red-500/40 flex items-center justify-center font-bold text-red-400 text-xs">
                  {user?.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <span className="text-xs font-bold text-white hidden sm:inline">{user?.name || 'Admin'}</span>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-48 bg-[#121215] border border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 text-white"
                  >
                    <Link
                      to="/admin/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all"
                    >
                      <User className="w-4 h-4 text-zinc-400" /> Profile & Security
                    </Link>
                    <Link
                      to="/admin/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all"
                    >
                      <Settings className="w-4 h-4 text-zinc-400" /> Store Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-all mt-1 border-t border-zinc-800"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
