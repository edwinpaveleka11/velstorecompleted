'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Minus, 
  Plus,
  Truck,
  Shield,
  ArrowLeft,
  Share2
} from 'lucide-react';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useCartStore } from '@/store/cart-store';
import { useToast } from '@/components/ToastNotification';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

interface ProductDetailClientProps {
  product: any;
  relatedProducts: any[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { showToast } = useToast();
  const addItem = useCartStore((state) => state.addItem);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  const price = Number(product.price);
  const comparePrice = product.comparePrice ? Number(product.comparePrice) : undefined;
  const discount = calculateDiscount(price, comparePrice);

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    addItem({
      id: product.id,
      name: product.name,
      price: price,
      quantity: quantity,
      image: product.images[0],
      slug: product.slug,
    });
    showToast(`Added ${quantity} item(s) to cart!`, 'success');
    setTimeout(() => setIsAddingToCart(false), 1000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => router.push('/cart'), 500);
  };

  const handleAddToWishlist = async () => {
    if (!session) {
      showToast('Please login to add to wishlist', 'info');
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

      const data = await res.json();

      if (res.ok) {
        showToast('Added to wishlist!', 'success');
      } else {
        if (data.error === 'Product already in wishlist') {
          showToast('Already in your wishlist', 'info');
        } else {
          showToast(data.error || 'Failed to add to wishlist', 'error');
        }
      }
    } catch (error) {
      showToast('Something went wrong', 'error');
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / product.reviews.length
    : product.rating;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-primary-600">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-gray-600 hover:text-primary-600">Products</Link>
            <span className="text-gray-400">/</span>
            <Link href={`/products?category=${product.category.slug}`} className="text-gray-600 hover:text-primary-600">
              {product.category.name}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Images */}
          <div>
            {/* Main Image */}
            <div className="card overflow-hidden mb-4">
              <div className="aspect-square bg-gray-100 relative">
                {product.images[selectedImage] ? (
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${product.images[selectedImage]})` }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                {discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                    -{discount}% OFF
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-primary-600 ring-2 ring-primary-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${image})` }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Category Badge */}
            <div
              className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white mb-4"
              style={{ backgroundColor: product.category.color }}
            >
              {product.category.name}
            </div>

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {averageRating.toFixed(1)} ({product.reviews.length} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(price)}
                </span>
                {comparePrice && comparePrice > price && (
                  <span className="text-2xl text-gray-500 line-through">
                    {formatPrice(comparePrice)}
                  </span>
                )}
              </div>
              {comparePrice && comparePrice > price && (
                <p className="text-green-600 font-medium">
                  You save {formatPrice(comparePrice - price)} ({discount}%)
                </p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-6 pb-6 border-b">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="font-medium">In Stock ({product.stock} available)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                    disabled={product.stock === 0}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-6 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                    disabled={product.stock === 0}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  Max: {product.stock} items
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0 || isAddingToCart}
                className="flex-1 btn btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Buy Now
              </button>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
                className="flex-1 btn btn-outline flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
              <button
                onClick={handleAddToWishlist}
                disabled={isAddingToWishlist}
                className="btn btn-outline p-3 disabled:opacity-50"
              >
                <Heart className="w-5 h-5" />
              </button>
              <button className="btn btn-outline p-3">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Truck className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Free Shipping</h4>
                  <p className="text-sm text-gray-600">Orders over Rp 500.000</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Secure Payment</h4>
                  <p className="text-sm text-gray-600">100% secure transaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
            <div className="space-y-4">
              {product.reviews.map((review: any) => (
                <div key={review.id} className="card p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}