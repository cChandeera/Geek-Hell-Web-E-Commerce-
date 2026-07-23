import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { AdminBadge } from '../../components/admin/ui/AdminBadge';
import { Star, CheckCircle, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminReviewsPage: React.FC = () => {
  const { data: reviews = [] } = useQuery({
    queryKey: ['adminReviews'],
    queryFn: adminService.getReviews,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Customer Review Moderation</h1>
        <p className="text-xs text-zinc-400 mt-1">Approve, hide, or delete customer product feedback and rating submissions.</p>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-[#121215] border border-zinc-800 space-y-3 hover:border-zinc-700 transition-all shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-xs">
                  {rev.user?.name?.[0] || 'C'}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{rev.user?.name}</div>
                  <div className="text-xs text-zinc-400">Reviewed <span className="text-zinc-200 font-semibold">{rev.product?.name}</span></div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'}`}
                  />
                ))}
              </div>
            </div>

            <div className="text-sm font-bold text-white">{rev.title}</div>
            <p className="text-xs text-zinc-300 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">{rev.comment}</p>

            <div className="flex items-center justify-between pt-2">
              <AdminBadge variant={rev.isVerifiedPurchase ? 'success' : 'neutral'}>
                {rev.isVerifiedPurchase ? 'Verified Purchase' : 'Standard Review'}
              </AdminBadge>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toast.success('Review approved')}
                  className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-all text-xs font-semibold flex items-center gap-1"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Approve
                </button>
                <button
                  onClick={() => toast.success('Review hidden')}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-all text-xs font-semibold flex items-center gap-1"
                >
                  <EyeOff className="w-3.5 h-3.5" /> Hide
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
