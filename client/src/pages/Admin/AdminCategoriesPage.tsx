import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { AdminTable, Column } from '../../components/admin/ui/AdminTable';
import { AdminBadge } from '../../components/admin/ui/AdminBadge';
import { AdminModal } from '../../components/admin/ui/AdminModal';
import { Plus, FolderTree } from 'lucide-react';
import { AdminCategory } from '../../types/admin';
import toast from 'react-hot-toast';

export const AdminCategoriesPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const { data: categories = [] } = useQuery({
    queryKey: ['adminCategories'],
    queryFn: adminService.getCategories,
  });

  const columns: Column<AdminCategory>[] = [
    {
      header: 'Category Name',
      accessor: (cat) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-red-400">
            <FolderTree className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">{cat.name}</div>
            <div className="text-xs text-zinc-400 font-mono">{cat.slug}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Description',
      accessor: (cat) => <span className="text-xs text-zinc-400 max-w-xs truncate block">{cat.description}</span>,
    },
    {
      header: 'Sort Order',
      accessor: (cat) => <span className="font-mono text-zinc-300">#{cat.sortOrder}</span>,
    },
    {
      header: 'Status',
      accessor: (cat) => (
        <AdminBadge variant={cat.isActive ? 'success' : 'neutral'}>
          {cat.isActive ? 'Active' : 'Disabled'}
        </AdminBadge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Apparel Taxonomy Categories</h1>
          <p className="text-xs text-zinc-400 mt-1">Organize products into Marvel, DC, Geek Originals & Custom apparel lines.</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg shadow-red-600/20"
        >
          <Plus className="w-4 h-4" /> Create Category
        </button>
      </div>

      <AdminTable columns={columns} data={categories} searchKey="name" searchPlaceholder="Search category..." />

      <AdminModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create Apparel Category">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase mb-2">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Marvel Cinematic Collection"
              className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase mb-2">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Category overview..."
              className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none"
            />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-800"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.success(`Category '${name}' created successfully`);
                setIsOpen(false);
                setName('');
                setDescription('');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/20"
            >
              Save Category
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
};
