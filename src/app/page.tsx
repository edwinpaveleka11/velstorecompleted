import Link from 'next/link';
import { ArrowRight, TrendingUp, Shield, Truck, HeadphonesIcon } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { featured: true },
    take: 8,
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return products;
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    take: 6,
    orderBy: {
      name: 'asc',
    },
  });
  return categories;
}

export default async function Home() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container-custom py-20 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <TrendingUp className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">New Collection Available</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Discover Premium Quality Products
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in">
              Shop the latest trends with exclusive deals and fast delivery
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in">
              <Link href="/products" className="btn bg-white text-primary-600 hover:bg-gray-100">
                Shop Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/deals" className="btn btn-outline border-white text-white hover:bg-white/10">
                View Deals
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-20 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: Truck,
                title: 'Free Shipping',
                description: 'On orders over Rp 500.000',
              },
              {
                icon: Shield,
                title: 'Secure Payment',
                description: '100% secure transactions',
              },
              {
                icon: HeadphonesIcon,
                title: '24/7 Support',
                description: 'Dedicated customer service',
              },
              {
                icon: TrendingUp,
                title: 'Best Prices',
                description: 'Competitive pricing guaranteed',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Shop by Category</h2>
              <p className="text-gray-600">Browse our wide selection of products</p>
            </div>
            <Link href="/categories" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group"
              >
                <div className="card card-hover p-6 text-center">
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                  </div>
                  <h3 className="font-semibold group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-gray-600">Handpicked items just for you</p>
            </div>
            <Link href="/products" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Newsletter
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Subscribe to get special offers, free giveaways, and exclusive deals
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button type="submit" className="btn bg-white text-primary-600 hover:bg-gray-100">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
