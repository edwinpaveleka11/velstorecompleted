'use client';

import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useCartStore } from '@/store/cart-store';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: any;
  comparePrice?: any | null;
  images: string[];
  rating: number;
  reviewCount: number;
  category?: {
    name: string;
    color: string;
  };
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  // Convert Prisma Decimal to number
  const price = Number(product.price);
  const comparePrice = product.comparePrice ? Number(product.comparePrice) : undefined;

  const discount = calculateDiscount(price, comparePrice);

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

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push('/login');
      return;
    }

    setIsAddingToWishlist(true);
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });

      if (res.ok) {
        // Show success feedback
        alert('Added to wishlist!');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to add to wishlist');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Failed to add to wishlist');
    } finally {
      setIsAddingToWishlist(false);
    }
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

          {/* Category Badge */}
          {product.category && (
            <div
              className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: product.category.color }}
            >
              {product.category.name}
            </div>
          )}

          {/* Quick Actions */}
          <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-primary-600 hover:text-white transition-colors disabled:opacity-50"
              title="Add to Cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
            <button
              onClick={handleAddToWishlist}
              disabled={isAddingToWishlist}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
              title="Add to Wishlist"
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600">({product.reviewCount})</span>
          </div>

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
        </div>
      </div>
    </Link>
  );
}