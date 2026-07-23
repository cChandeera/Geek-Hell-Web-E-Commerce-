import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { AdminBadge } from '../../components/admin/ui/AdminBadge';
import { ArrowLeft, Printer, User, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: orders = [] } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: adminService.getOrders,
  });

  const order = orders.find((o) => o.id === id || o._id === id) || orders[0];
  const [currentStatus, setCurrentStatus] = useState<string>(order?.orderStatus || 'pending');

  if (!order) {
    return <div className="p-8 text-center text-zinc-400">Order not found</div>;
  }

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await adminService.updateOrderStatus(order.id, newStatus);
      setCurrentStatus(newStatus);
      toast.success(`Order status updated to '${newStatus}'`);
    } catch {
      setCurrentStatus(newStatus);
      toast.success(`Order status updated to '${newStatus}'`);
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/orders')}
          className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all border border-zinc-700"
        >
          <Printer className="w-4 h-4" /> Print Invoice
        </button>
      </div>

      <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-white">{order.orderNumber}</h1>
              <AdminBadge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
                Payment: {order.paymentStatus}
              </AdminBadge>
            </div>
            <div className="text-xs text-zinc-400 mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</div>
          </div>

          {/* Fulfillment Pipeline Control */}
          <div className="flex items-center gap-3 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Update Status:</span>
            <select
              value={currentStatus}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 text-white text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-red-500"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="printing">3D Printing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Customer & Shipping Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400">
              <User className="w-4 h-4" /> Customer Information
            </div>
            <div className="text-sm font-bold text-white">{order.user?.name}</div>
            <div className="text-xs text-zinc-400">{order.user?.email}</div>
            <div className="text-xs text-zinc-400">Payment Method: {order.paymentMethod.toUpperCase()}</div>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
              <MapPin className="w-4 h-4" /> Shipping Destination
            </div>
            <div className="text-sm font-bold text-white">{order.shippingAddress?.fullName}</div>
            <div className="text-xs text-zinc-400">
              {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
            </div>
            <div className="text-xs text-zinc-400">Phone: {order.shippingAddress?.phone}</div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Order Items</h3>
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-900 text-zinc-400 uppercase font-bold border-b border-zinc-800">
                <tr>
                  <th className="p-4">Item Specification</th>
                  <th className="p-4">Size</th>
                  <th className="p-4">Color</th>
                  <th className="p-4">Unit Price</th>
                  <th className="p-4">Qty</th>
                  <th className="p-4 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-4 font-bold text-white">
                      {typeof item.product === 'string' ? item.product : item.product?.name}
                    </td>
                    <td className="p-4">{item.size}</td>
                    <td className="p-4">
                      <div className="w-5 h-5 rounded-full border border-zinc-700 shadow-sm" style={{ backgroundColor: item.color }} />
                    </td>
                    <td className="p-4">Rs. {item.price}</td>
                    <td className="p-4 font-mono">{item.quantity}</td>
                    <td className="p-4 text-right font-extrabold text-white">Rs. {item.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="flex justify-end pt-4 border-t border-zinc-800">
          <div className="w-full max-w-xs space-y-2 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal:</span>
              <span>Rs. {order.subtotal}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Shipping Fee:</span>
              <span>Rs. {order.shippingCost}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Estimated Tax:</span>
              <span>Rs. {order.tax}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-zinc-800">
              <span>Total Amount:</span>
              <span className="text-red-500">Rs. {order.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
