import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { AdminBadge } from '../../components/admin/ui/AdminBadge';
import { Trash2, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminCustomDesignsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: designs = [] } = useQuery({
    queryKey: ['adminCustomDesigns'],
    queryFn: adminService.getCustomDesigns,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteCustomDesign(id),
    onSuccess: () => {
      toast.success('Custom design deleted');
      queryClient.invalidateQueries({ queryKey: ['adminCustomDesigns'] });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">3D Custom Garment Gallery</h1>
        <p className="text-xs text-zinc-400 mt-1">Review saved superhero T-shirt customizer creations and decal artwork uploads.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {designs.map((design) => (
          <div
            key={design.id}
            className="bg-[#121215] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl p-5 space-y-4 hover:border-zinc-700 transition-all"
          >
            {/* Design Preview Header */}
            <div className="h-40 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center relative p-4">
              <div
                className="w-24 h-28 rounded-lg border border-zinc-700 flex items-center justify-center shadow-lg relative"
                style={{ backgroundColor: design.shirtColor }}
              >
                <div className="w-10 h-10 rounded bg-red-500/20 border border-red-500/40 flex items-center justify-center text-[10px] font-bold text-red-400">
                  DECAL
                </div>
              </div>
              <AdminBadge variant="purple" className="absolute top-3 right-3 capitalize">
                {design.printSide}
              </AdminBadge>
            </div>

            {/* Content Details */}
            <div>
              <div className="font-bold text-white text-sm truncate">{design.product?.name}</div>
              <div className="text-xs text-zinc-400 mt-0.5">Created by {design.user?.name || 'Customer'}</div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Layers className="w-3.5 h-3.5" /> Color: <span className="font-mono text-white">{design.shirtColor}</span>
              </div>
              <button
                onClick={() => {
                  if (confirm('Delete this custom design?')) {
                    deleteMutation.mutate(design.id);
                  }
                }}
                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                title="Delete Design"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
