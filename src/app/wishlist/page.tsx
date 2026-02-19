import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import WishlistCard from '@/components/WishlistCard';
import { Heart, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

async function getWishlist(userId: string) {
  try {
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: {
        userId,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return wishlistItems;
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const wishlistItems = await getWishlist(session.user.id);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          </div>
          <p className="text-gray-600">
            {wishlistItems.length > 0
              ? `You have ${wishlistItems.length} item${wishlistItems.length > 1 ? 's' : ''} in your wishlist`
              : 'Your wishlist is empty'}
          </p>
        </div>

        {/* Wishlist Items */}
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <WishlistCard key={item.id} wishlistItem={item} />
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-600 mb-6">
              Save items you love to buy them later
            </p>
            <Link href="/products" className="btn btn-primary inline-flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}