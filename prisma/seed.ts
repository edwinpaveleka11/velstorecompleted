import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared existing data');

  // Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin Velstore',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '+62812-3456-7890',
    },
  });

  // Create Customer Users
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customers = await prisma.user.createMany({
    data: [
      {
        email: 'customer1@example.com',
        name: 'Edwin Paveleka',
        password: customerPassword,
        role: 'CUSTOMER',
        phone: '+62821-1111-2222',
        address: 'Jl. Sudirman No. 123, Jakarta',
      },
      {
        email: 'customer2@example.com',
        name: 'Clara Laura',
        password: customerPassword,
        role: 'CUSTOMER',
        phone: '+62822-3333-4444',
        address: 'Jl. Gatot Subroto No. 456, Bandung',
      },
    ],
  });

  console.log('✅ Created users');

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest gadgets and electronic devices',
        color: '#3B82F6',
        image: '/categories/electronics.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Trendy clothing and accessories',
        color: '#EC4899',
        image: '/categories/fashion.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Home & Living',
        slug: 'home-living',
        description: 'Furniture and home decor',
        color: '#10B981',
        image: '/categories/home.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Beauty',
        slug: 'beauty',
        description: 'Skincare and cosmetics',
        color: '#F59E0B',
        image: '/categories/beauty.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sports',
        slug: 'sports',
        description: 'Sports equipment and activewear',
        color: '#8B5CF6',
        image: '/categories/sports.jpg',
      },
    }),
  ]);

  console.log('✅ Created categories');

  // Create Products
  const products = [
    // Electronics
    {
      name: 'Premium Wireless Headphones',
      slug: 'premium-wireless-headphones',
      description: 'Experience crystal-clear audio with active noise cancellation, 30-hour battery life, and premium comfort design.',
      price: 2499000,
      comparePrice: 3499000,
      stock: 45,
      images: ['/products/headphones-1.jpg', '/products/headphones-2.jpg'],
      featured: true,
      categoryId: categories[0].id,
      tags: ['audio', 'wireless', 'noise-cancelling'],
      rating: 4.8,
      reviewCount: 156,
    },
    {
      name: 'Smart Watch Pro',
      slug: 'smart-watch-pro',
      description: 'Track your fitness, receive notifications, and stay connected with this sleek smartwatch.',
      price: 3299000,
      comparePrice: 4299000,
      stock: 32,
      images: ['/products/smartwatch-1.jpg', '/products/smartwatch-2.jpg'],
      featured: true,
      categoryId: categories[0].id,
      tags: ['wearable', 'fitness', 'smart'],
      rating: 4.6,
      reviewCount: 89,
    },
    {
      name: '4K Action Camera',
      slug: '4k-action-camera',
      description: 'Capture stunning 4K videos with image stabilization, waterproof up to 30m.',
      price: 1899000,
      stock: 28,
      images: ['/products/camera-1.jpg'],
      featured: false,
      categoryId: categories[0].id,
      tags: ['camera', '4k', 'waterproof'],
      rating: 4.7,
      reviewCount: 67,
    },
    
    // Fashion
    {
      name: 'Premium Leather Jacket',
      slug: 'premium-leather-jacket',
      description: 'Genuine leather jacket with modern cut and superior craftsmanship.',
      price: 1899000,
      comparePrice: 2699000,
      stock: 18,
      images: ['/products/jacket-1.jpg', '/products/jacket-2.jpg'],
      featured: true,
      categoryId: categories[1].id,
      tags: ['leather', 'outerwear', 'premium'],
      rating: 4.9,
      reviewCount: 43,
    },
    {
      name: 'Designer Sneakers',
      slug: 'designer-sneakers',
      description: 'Stylish and comfortable sneakers perfect for any occasion.',
      price: 1299000,
      stock: 56,
      images: ['/products/sneakers-1.jpg'],
      featured: false,
      categoryId: categories[1].id,
      tags: ['shoes', 'casual', 'comfort'],
      rating: 4.5,
      reviewCount: 124,
    },
    {
      name: 'Luxury Handbag',
      slug: 'luxury-handbag',
      description: 'Elegant handbag made from premium materials with timeless design.',
      price: 2899000,
      comparePrice: 3499000,
      stock: 22,
      images: ['/products/handbag-1.jpg', '/products/handbag-2.jpg'],
      featured: true,
      categoryId: categories[1].id,
      tags: ['accessories', 'luxury', 'handbag'],
      rating: 4.8,
      reviewCount: 38,
    },
    
    // Home & Living
    {
      name: 'Modern Coffee Table',
      slug: 'modern-coffee-table',
      description: 'Minimalist coffee table with solid wood construction and elegant finish.',
      price: 2199000,
      stock: 12,
      images: ['/products/table-1.jpg'],
      featured: false,
      categoryId: categories[2].id,
      tags: ['furniture', 'living-room', 'wood'],
      rating: 4.7,
      reviewCount: 29,
    },
    {
      name: 'Luxury Bedding Set',
      slug: 'luxury-bedding-set',
      description: 'Premium Egyptian cotton bedding set for ultimate comfort.',
      price: 1599000,
      stock: 34,
      images: ['/products/bedding-1.jpg'],
      featured: true,
      categoryId: categories[2].id,
      tags: ['bedroom', 'cotton', 'luxury'],
      rating: 4.9,
      reviewCount: 87,
    },
    
    // Beauty
    {
      name: 'Luxury Skincare Set',
      slug: 'luxury-skincare-set',
      description: 'Complete skincare routine with premium ingredients for radiant skin.',
      price: 899000,
      comparePrice: 1299000,
      stock: 67,
      images: ['/products/skincare-1.jpg', '/products/skincare-2.jpg'],
      featured: true,
      categoryId: categories[3].id,
      tags: ['skincare', 'beauty', 'premium'],
      rating: 4.8,
      reviewCount: 234,
    },
    {
      name: 'Professional Makeup Kit',
      slug: 'professional-makeup-kit',
      description: 'Complete makeup kit with high-quality products for flawless looks.',
      price: 1299000,
      stock: 41,
      images: ['/products/makeup-1.jpg'],
      featured: false,
      categoryId: categories[3].id,
      tags: ['makeup', 'cosmetics', 'professional'],
      rating: 4.6,
      reviewCount: 178,
    },
    
    // Sports
    {
      name: 'Yoga Mat Premium',
      slug: 'yoga-mat-premium',
      description: 'Extra thick yoga mat with superior grip and cushioning.',
      price: 499000,
      stock: 89,
      images: ['/products/yoga-mat-1.jpg'],
      featured: false,
      categoryId: categories[4].id,
      tags: ['yoga', 'fitness', 'exercise'],
      rating: 4.7,
      reviewCount: 156,
    },
    {
      name: 'Running Shoes Pro',
      slug: 'running-shoes-pro',
      description: 'High-performance running shoes with advanced cushioning technology.',
      price: 1799000,
      comparePrice: 2299000,
      stock: 44,
      images: ['/products/running-shoes-1.jpg', '/products/running-shoes-2.jpg'],
      featured: true,
      categoryId: categories[4].id,
      tags: ['running', 'shoes', 'performance'],
      rating: 4.9,
      reviewCount: 203,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('✅ Created products');

  // Create Sample Orders
  const user1 = await prisma.user.findUnique({ where: { email: 'customer1@example.com' } });
  const product1 = await prisma.product.findUnique({ where: { slug: 'premium-wireless-headphones' } });
  const product2 = await prisma.product.findUnique({ where: { slug: 'smart-watch-pro' } });

  if (user1 && product1 && product2) {
    await prisma.order.create({
      data: {
        orderNumber: 'ORD-2024-0001',
        userId: user1.id,
        status: 'DELIVERED',
        paymentStatus: 'PAID',
        paymentMethod: 'Credit Card',
        subtotal: 5798000,
        tax: 579800,
        shipping: 50000,
        total: 6427800,
        shippingName: user1.name!,
        shippingEmail: user1.email,
        shippingPhone: user1.phone!,
        shippingAddress: 'Jl. Sudirman No. 123',
        shippingCity: 'Jakarta',
        shippingState: 'DKI Jakarta',
        shippingZip: '12190',
        orderItems: {
          create: [
            {
              productId: product1.id,
              quantity: 1,
              price: 2499000,
              total: 2499000,
            },
            {
              productId: product2.id,
              quantity: 1,
              price: 3299000,
              total: 3299000,
            },
          ],
        },
      },
    });
  }

  console.log('✅ Created sample orders');
  console.log('');
  console.log('✨ Seed completed successfully!');
  console.log('');
  console.log('📧 Admin Login:');
  console.log('   Email: admin@example.com');
  console.log('   Password: admin123');
  console.log('');
  console.log('📧 Customer Login:');
  console.log('   Email: customer1@example.com');
  console.log('   Password: customer123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
