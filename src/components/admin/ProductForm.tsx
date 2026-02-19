'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

interface ProductFormProps {
  categories: Category[];
  product?: any;
}

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price ? Number(product.price) : '',
    comparePrice: product?.comparePrice ? Number(product.comparePrice) : '',
    stock: product?.stock || '',
    categoryId: product?.categoryId || '',
    featured: product?.featured || false,
    images: product?.images?.join('\n') || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Convert images string to array
      const imagesArray = formData.images
        .split('\n')
        .map((url: string) => url.trim())
        .filter((url: any) => url);

      const payload = {
        ...formData,
        price: parseFloat(formData.price as string),
        comparePrice: formData.comparePrice
          ? parseFloat(formData.comparePrice as string)
          : null,
        stock: parseInt(formData.stock as string),
        images: imagesArray,
      };

      const url: string = product
        ? `/api/admin/products/${product.id}`
        : '/api/admin/products';
      
      const method: 'PUT' | 'POST' = product ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save product');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-8">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            required
            className="input"
            placeholder="e.g. Premium Wireless Headphones"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            rows={4}
            className="input"
            placeholder="Product description..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Price & Compare Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (Rp) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              className="input"
              placeholder="2499000"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compare Price (Rp)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="input"
              placeholder="3499000"
              value={formData.comparePrice}
              onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">Original price (for discount display)</p>
          </div>
        </div>

        {/* Stock & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock *
            </label>
            <input
              type="number"
              required
              min="0"
              className="input"
              placeholder="100"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              required
              className="input"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URLs
          </label>
          <textarea
            rows={3}
            className="input"
            placeholder="Enter image URLs, one per line&#10;https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            value={formData.images}
            onChange={(e) => setFormData({ ...formData, images: e.target.value })}
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter image URLs, one per line. Use placeholder images for now.
          </p>
        </div>

        {/* Featured */}
        <div className="flex items-center">
          <input
            id="featured"
            type="checkbox"
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
          />
          <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
            Featured Product (show on homepage)
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-8">
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary flex items-center disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              {product ? 'Update Product' : 'Create Product'}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn btn-secondary flex items-center"
        >
          <X className="w-5 h-5 mr-2" />
          Cancel
        </button>
      </div>
    </form>
  );
}