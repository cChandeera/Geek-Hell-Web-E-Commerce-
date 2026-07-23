import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { AdminTable, Column } from '../../components/admin/ui/AdminTable';
import { AdminBadge } from '../../components/admin/ui/AdminBadge';
import { Plus, Edit, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminProduct } from '../../types/admin';
import toast from 'react-hot-toast';

export const AdminProductsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: products = [] } = useQuery({
    queryKey: ['adminProducts', selectedCategory],
    queryFn: () => adminService.getProducts(selectedCategory !== 'all' ? { category: selectedCategory } : undefined),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteProduct(id),
    onSuccess: () => {
      toast.success('Product deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
    },
  });

  const columns: Column<AdminProduct>[] = [
    {
      header: 'Garment Name',
      accessor: (product) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center text-red-400 font-bold overflow-hidden">
            {typeof product.images?.[0] === 'string' ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <ShoppingBag className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="font-bold text-white text-sm">{product.name}</div>
            <div className="text-xs text-zinc-400 font-mono">{product.slug}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: (product) => (
        <AdminBadge variant={product.category === 'Marvel' ? 'error' : product.category === 'DC' ? 'info' : 'purple'}>
          {product.category}
        </AdminBadge>
      ),
    },
    {
      header: 'Base Price',
      accessor: (product) => <span className="font-bold text-white">${product.basePrice}</span>,
    },
    {
      header: 'Stock Inventory',
      accessor: (product) => (
        <AdminBadge variant={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'error'}>
          {product.stock > 0 ? `${product.stock} Units` : 'Out of Stock'}
        </AdminBadge>
      ),
    },
    {
      header: 'Status',
      accessor: (product) => (
        <AdminBadge variant={product.isActive ? 'success' : 'neutral'}>
          {product.isActive ? 'Active' : 'Disabled'}
        </AdminBadge>
      ),
    },
    {
      header: 'Actions',
      accessor: (product) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/products/${product.id}/edit`}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all"
            title="Edit Garment"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
            onClick={() => {
              if (confirm(`Delete ${product.name}?`)) {
                deleteMutation.mutate(product.id);
              }
            }}
            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
            title="Delete Garment"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Product Catalog Management</h1>
          <p className="text-xs text-zinc-400 mt-1">Manage superhero 3D apparel lines, colors, sizes, and stock inventory.</p>
        </div>
        <Link
          to="/admin/products/new"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-red-600/20"
        >
          <Plus className="w-4 h-4" /> Create Product
        </Link>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2">
        {['all', 'Marvel', 'DC', 'Geek Original', 'Apparel'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {cat === 'all' ? 'All Franchise Products' : cat}
          </button>
        ))}
      </div>

      {/* Table */}
      <AdminTable columns={columns} data={products} searchKey="name" searchPlaceholder="Search garment name..." />
    </div>
  );
};
