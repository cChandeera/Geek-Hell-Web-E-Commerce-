import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { AdminTable, Column } from '../../components/admin/ui/AdminTable';
import { AdminBadge } from '../../components/admin/ui/AdminBadge';
import { AdminModal } from '../../components/admin/ui/AdminModal';
import { Plus, Ticket } from 'lucide-react';
import { AdminCoupon } from '../../types/admin';
import toast from 'react-hot-toast';

export const AdminCouponsPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState<number>(20);

  const { data: coupons = [] } = useQuery({
    queryKey: ['adminCoupons'],
    queryFn: adminService.getCoupons,
  });

  const columns: Column<AdminCoupon>[] = [
    {
      header: 'Coupon Code',
      accessor: (c) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-400 font-bold">
            <Ticket className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-white text-sm font-mono tracking-wider">{c.code}</div>
            <div className="text-[10px] text-zinc-400">{c.description}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Discount Value',
      accessor: (c) => (
        <span className="font-extrabold text-amber-400">
          {c.discountType === 'percentage' ? `${c.value}% OFF` : `Rs. ${c.value} OFF`}
        </span>
      ),
    },
    {
      header: 'Redemptions',
      accessor: (c) => (
        <span className="font-mono text-zinc-300">
          {c.usedCount} / {c.usageLimit}
        </span>
      ),
    },
    {
      header: 'Expiration',
      accessor: (c) => <span className="text-xs text-zinc-400">{c.expiresAt}</span>,
    },
    {
      header: 'Status',
      accessor: (c) => (
        <AdminBadge variant={c.isActive ? 'success' : 'neutral'}>
          {c.isActive ? 'Active' : 'Disabled'}
        </AdminBadge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Promotional Coupon Discounts</h1>
          <p className="text-xs text-zinc-400 mt-1">Manage promotional campaign vouchers & discount codes.</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg shadow-amber-600/20"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      <AdminTable columns={columns} data={coupons} searchKey="code" searchPlaceholder="Search promo code..." />

      <AdminModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create Discount Coupon">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase mb-2">Coupon Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. HERO2026"
              className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-2.5 text-sm uppercase font-mono focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase mb-2">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (Rs.)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase mb-2">Discount Value</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 bg-zinc-800"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.success(`Coupon '${code}' created!`);
                setIsOpen(false);
                setCode('');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-600/20"
            >
              Save Coupon
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
};
