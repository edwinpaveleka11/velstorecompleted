import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import { Tag, TrendingDown } from 'lucide-react';

async function getDeals() {
  try {
    const products = await prisma.product.findMany({
      where: {
        comparePrice: {
          not: null,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Filter products with actual discounts
    return products.filter((p) => {
      const price = Number(p.price);
      const comparePrice = p.comparePrice ? Number(p.comparePrice) : 0;
      return comparePrice > price;
    });
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}

export default async function DealsPage() {
  const deals = await getDeals();

  // Calculate average discount
  const avgDiscount =
    deals.length > 0
      ? Math.round(
          deals.reduce((acc, product) => {
            const price = Number(product.price);
            const comparePrice = Number(product.comparePrice || 0);
            const discount = ((comparePrice - price) / comparePrice) * 100;
            return acc + discount;
          }, 0) / deals.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <Tag className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Special Offers</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Amazing Deals & Discounts
            </h1>
            <p className="text-xl text-white/90">
              Save up to {avgDiscount}% on selected products. Limited time offers!
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b">
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">
                {deals.length}
              </div>
              <div className="text-gray-600">Products on Sale</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">
                Up to {avgDiscount}%
              </div>
              <div className="text-gray-600">Average Discount</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">
                <TrendingDown className="w-8 h-8 inline" />
              </div>
              <div className="text-gray-600">Best Prices</div>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="container-custom py-12">
        {deals.length > 0 ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                All Deals ({deals.length})
              </h2>
              <p className="text-gray-600">Don't miss out on these amazing offers</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {deals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No deals available right now
            </h3>
            <p className="text-gray-600 mb-6">
              Check back later for amazing offers
            </p>
          </div>
        )}
      </div>
    </div>
  );
}