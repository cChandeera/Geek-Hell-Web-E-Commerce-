import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { AdminGuard } from './components/admin/AdminGuard';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/Admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/Admin/AdminProductsPage';
import { AdminProductEditPage } from './pages/Admin/AdminProductEditPage';
import { AdminCategoriesPage } from './pages/Admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/Admin/AdminOrdersPage';
import { AdminOrderDetailPage } from './pages/Admin/AdminOrderDetailPage';
import { AdminUsersPage } from './pages/Admin/AdminUsersPage';
import { AdminCustomDesignsPage } from './pages/Admin/AdminCustomDesignsPage';
import { AdminCouponsPage } from './pages/Admin/AdminCouponsPage';
import { AdminReviewsPage } from './pages/Admin/AdminReviewsPage';
import { AdminSettingsPage } from './pages/Admin/AdminSettingsPage';
import { AdminProfilePage } from './pages/Admin/AdminProfilePage';
import { HomePage } from './pages/Home/HomePage';
import { CustomizerPage } from './pages/Customizer/CustomizerPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <BrowserRouter>
        <Routes>
          {/* Public Storefront Landing Page */}
          <Route path="/" element={<HomePage />} />

          {/* 3D Customizer Studio */}
          <Route path="/customizer" element={<CustomizerPage />} />

          {/* Protected Admin Control Center */}
          <Route path="/admin" element={<AdminGuard />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="products/new" element={<AdminProductEditPage />} />
              <Route path="products/:id/edit" element={<AdminProductEditPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="orders/:id" element={<AdminOrderDetailPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="custom-designs" element={<AdminCustomDesignsPage />} />
              <Route path="coupons" element={<AdminCouponsPage />} />
              <Route path="reviews" element={<AdminReviewsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="profile" element={<AdminProfilePage />} />
            </Route>
          </Route>

          {/* Root Fallback */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center font-black text-2xl mb-4 shadow-lg shadow-red-600/30">
                  GH
                </div>
                <h1 className="text-3xl font-extrabold mb-2">GEEK HELL PLATFORM</h1>
                <p className="text-zinc-400 text-sm max-w-md mb-6">
                  Admin Control Center initialized. Navigate to <code className="text-red-400">/admin/dashboard</code> to view dashboard analytics.
                </p>
                <a
                  href="/admin/dashboard"
                  className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-xs transition-all shadow-lg shadow-red-600/20"
                >
                  Go to Admin Dashboard
                </a>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
