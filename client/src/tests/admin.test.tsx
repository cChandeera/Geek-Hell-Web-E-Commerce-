import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminGuard } from '../components/admin/AdminGuard';
import { AdminCard } from '../components/admin/ui/AdminCard';
import { AdminBadge } from '../components/admin/ui/AdminBadge';
import { useAuthStore } from '../store/useAuthStore';
import { DollarSign } from 'lucide-react';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

describe('Step 07 — Admin Dashboard Module Suite', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: {
        id: 'u3',
        name: 'Admin Master',
        email: 'admin@geekhell.com',
        role: 'admin',
      },
      isAuthenticated: true,
    });
  });

  // 1. Role Protection (AdminGuard)
  describe('Role Authorization Guard (AdminGuard)', () => {
    it('should allow admin users to access protected routes', () => {
      const { getByText } = render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/dashboard']}>
            <Routes>
              <Route path="/admin" element={<AdminGuard />}>
                <Route path="dashboard" element={<div>Admin Dashboard Content</div>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      );

      expect(getByText('Admin Dashboard Content')).toBeInTheDocument();
    });

    it('should render 403 Forbidden screen for non-admin customer accounts', () => {
      useAuthStore.setState({
        user: {
          id: 'u1',
          name: 'Peter Parker',
          email: 'peter@geekhell.com',
          role: 'user',
        },
        isAuthenticated: true,
      });

      const { getByText, queryByText } = render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/dashboard']}>
            <Routes>
              <Route path="/admin" element={<AdminGuard />}>
                <Route path="dashboard" element={<div>Admin Dashboard Content</div>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      );

      expect(getByText('403 — Admin Access Required')).toBeInTheDocument();
      expect(queryByText('Admin Dashboard Content')).not.toBeInTheDocument();
    });
  });

  // 2. UI Component Rendering
  describe('Admin UI Components', () => {
    it('should render AdminCard stats component with titles and values', () => {
      const { getByText } = render(
        <AdminCard
          title="Total Revenue"
          value="$124,850"
          change="+18.4%"
          isPositive={true}
          icon={<DollarSign className="w-5 h-5" />}
        />
      );

      expect(getByText('Total Revenue')).toBeInTheDocument();
      expect(getByText('$124,850')).toBeInTheDocument();
      expect(getByText('+18.4%')).toBeInTheDocument();
    });

    it('should render AdminBadge status component with variants', () => {
      const { getByText } = render(<AdminBadge variant="success">Delivered</AdminBadge>);
      expect(getByText('Delivered')).toBeInTheDocument();
    });
  });
});
