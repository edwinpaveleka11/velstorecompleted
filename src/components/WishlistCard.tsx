'use client';

import Link from 'next/link';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useCartStore } from '@/store/cart-store';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface WishlistCardProps {
  wishlistItem: {
    id: string;
    product: {
      id: string;
      name: string;
      slug: string;
      price: any;
      comparePrice?: any | null;
      images: string[];
      stock: number;
      category: {
        name: string;
        color: string;
      };
    };
  };
}

export default function WishlistCard({ wishlistItem }: WishlistCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const { product } = wishlistItem;
  const price = Number(product.price);
  const comparePrice = product.comparePrice ? Number(product.comparePrice) : undefined;
  const discount = calculateDiscount(price, comparePrice);

  const handleRemoveFromWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirm('Remove this item from your wishlist?')) {
      setIsRemoving(true);
      try {
        const res = await fetch('/api/wishlist', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id }),
        });

        if (res.ok) {
          router.refresh();
        }
      } catch (error) {
        console.error('Error removing from wishlist:', error);
      } finally {
        setIsRemoving(false);
      }
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);
    addItem({
      id: product.id,
      name: product.name,
      price: price,
      quantity: 1,
      image: product.images[0],
      slug: product.slug,
    });

    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="card card-hover overflow-hidden">
        {/* Image */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {product.images[0] ? (
            <div
              className="w-full h-full bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500"
              style={{
                backgroundImage: `url(${product.images[0]})`,
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              -{discount}%
            </div>
          )}

          {/* Stock Badge */}
          {product.stock === 0 && (
            <div className="absolute top-3 right-3 bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-bold">
              Out of Stock
            </div>
          )}

          {/* Quick Actions */}
          <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleAddToCart}
              disabled={isAdding || product.stock === 0}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-primary-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Add to Cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
            <button
              onClick={handleRemoveFromWishlist}
              disabled={isRemoving}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
              title="Remove from Wishlist"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <div
            className="inline-block px-2 py-1 rounded text-xs font-medium text-white mb-2"
            style={{ backgroundColor: product.category.color }}
          >
            {product.category.name}
          </div>

          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(price)}
            </span>
            {comparePrice && comparePrice > price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(comparePrice)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {product.stock > 0 && product.stock <= 10 && (
            <p className="text-xs text-orange-600 mt-2">
              Only {product.stock} left in stock!
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}