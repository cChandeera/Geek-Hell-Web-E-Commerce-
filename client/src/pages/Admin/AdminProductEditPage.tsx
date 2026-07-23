import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Marvel');
  const [brand, setBrand] = useState('Geek Hell');
  const [basePrice, setBasePrice] = useState<number>(65);
  const [discountPrice, setDiscountPrice] = useState<number>(0);
  const [gender, setGender] = useState<'men' | 'women' | 'unisex'>('unisex');
  const [stock, setStock] = useState<number>(50);
  const [description, setDescription] = useState('');
  const [availableColors, setAvailableColors] = useState('#09090b, #ed1d24, #ffffff');
  const [tags, setTags] = useState('Superhero, Oversized');
  const [isFeatured, setIsFeatured] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      adminService
        .getProductById(id)
        .then((product) => {
          setName(product.name);
          setSlug(product.slug);
          setCategory(product.category);
          setBrand(product.brand);
          setBasePrice(product.basePrice);
          setDiscountPrice(product.discountPrice || 0);
          setGender(product.gender);
          setStock(product.stock);
          setDescription(product.description);
          setAvailableColors(product.availableColors?.join(', ') || '#09090b');
          setTags(product.tags?.join(', ') || '');
          setIsFeatured(product.isFeatured);
          setIsActive(product.isActive);
        })
        .catch(() => {
          toast.error('Failed to load product details');
        });
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Garment name is required');
      return;
    }
    if (!category) {
      toast.error('Category is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category,
        brand,
        basePrice,
        discountPrice,
        gender,
        stock,
        description,
        availableColors: availableColors.split(',').map((c) => c.trim()),
        tags: tags.split(',').map((t) => t.trim()),
        isFeatured,
        isActive,
      };

      if (isEditing && id) {
        await adminService.updateProduct(id, payload);
        toast.success('Garment updated successfully!');
      } else {
        await adminService.createProduct(payload);
        toast.success('New superhero garment created successfully!');
      }

      navigate('/admin/products');
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Back CTA */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/products')}
          className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Product Catalog
        </button>
      </div>

      <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-6 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white">
              {isEditing ? 'Edit Garment Product' : 'Create Superhero Apparel'}
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Configure garment specifications, prices, colors & 3D model properties.</p>
          </div>
          <Sparkles className="w-6 h-6 text-red-500" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Garment Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Iron Man Arc Reactor Oversized Tee"
                className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Category Franchise</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none"
              >
                <option value="Marvel">Marvel</option>
                <option value="DC">DC</option>
                <option value="Geek Original">Geek Original</option>
                <option value="Anime">Anime</option>
                <option value="Apparel">Apparel</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Base Price (Rs.)</label>
              <input
                type="number"
                step="0.01"
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Stock Units</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description, fabric info, and print specifications..."
              className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Available Colors (Comma Separated Hex)</label>
            <input
              type="text"
              value={availableColors}
              onChange={(e) => setAvailableColors(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-6 pt-4 border-t border-zinc-800">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-300 font-semibold">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-red-600 focus:ring-0"
              />
              Feature on Homepage Hero
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-300 font-semibold">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-red-600 focus:ring-0"
              />
              Active in Storefront
            </label>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-600/30 disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {isSubmitting ? 'Saving...' : 'Save Product Specs'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
