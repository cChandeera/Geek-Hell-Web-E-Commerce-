import React, { useState } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminSettingsPage: React.FC = () => {
  const [brandName, setBrandName] = useState('GEEK HELL');
  const [contactEmail, setContactEmail] = useState('support@geekhell.com');
  const [currency, setCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState(8);

  const handleSave = () => {
    toast.success('Store configuration saved successfully!');
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Platform Store Settings</h1>
        <p className="text-xs text-zinc-400 mt-1">Configure global store brand info, taxation, shipping rates, and WebGL glow accents.</p>
      </div>

      <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Platform Brand Name</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Support Contact Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Default Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Tax Rate (%)</label>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end border-t border-zinc-800">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-red-600/30"
          >
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
