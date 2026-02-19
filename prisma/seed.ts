import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Unsplash image URLs by category
const productImages = {
  electronics: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800", // Headphones
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800", // Watch
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800", // Camera
    "https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=800", // Laptop
  ],
  fashion: [
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800", // Leather Jacket
    "https://images.unsplash.com/photo-1704677982224-89cd6d039fa6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZGVzaWduZXIlMjBzbmVha2VyfGVufDB8fDB8fHww", // Sneakers
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800", // Handbag
    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800", // Dress
  ],
  home: [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800", // Living room
    "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800", // Bedroom
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800", // Furniture
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800", // Decor
  ],
  beauty: [
    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800", // Skincare
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800", // Makeup
    "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800", // Beauty products
    "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800", // Cosmetics
  ],
  sports: [
    "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800", // Yoga mat
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800", // Running shoes
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800", // Gym
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800", // Sports
  ],
};

async function main() {
  console.log("🌱 Starting seed...");

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

  console.log("✅ Cleared existing data");

  // Create Admin User
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin Velstore",
      password: hashedPassword,
      role: "ADMIN",
      phone: "+62812-3456-7890",
    },
  });

  // Create Customer Users
  const customerPassword = await bcrypt.hash("customer123", 10);
  const customers = await prisma.user.createMany({
    data: [
      {
        email: "edwin@example.com",
        name: "Edwin Pavel",
        password: customerPassword,
        role: "CUSTOMER",
        phone: "+62821-1111-2222",
        address: "Jl. Sudirman No. 123, Jakarta",
      },
      {
        email: "clare@example.com",
        name: "Clarissa Na'ila",
        password: customerPassword,
        role: "CUSTOMER",
        phone: "+62822-3333-4444",
        address: "Jl. Gatot Subroto No. 456, Bandung",
      },
    ],
  });

  console.log("✅ Created users");

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Electronics",
        slug: "electronics",
        description: "Latest gadgets and electronic devices",
        color: "#3B82F6",
      },
    }),
    prisma.category.create({
      data: {
        name: "Fashion",
        slug: "fashion",
        description: "Trendy clothing and accessories",
        color: "#EC4899",
      },
    }),
    prisma.category.create({
      data: {
        name: "Home & Living",
        slug: "home-living",
        description: "Furniture and home decor",
        color: "#10B981",
      },
    }),
    prisma.category.create({
      data: {
        name: "Beauty",
        slug: "beauty",
        description: "Skincare and cosmetics",
        color: "#F59E0B",
      },
    }),
    prisma.category.create({
      data: {
        name: "Sports",
        slug: "sports",
        description: "Sports equipment and activewear",
        color: "#8B5CF6",
      },
    }),
  ]);

  console.log("✅ Created categories");

  // Create Products with real images
  const products = [
    // Electronics
    {
      name: "Premium Wireless Headphones",
      slug: "premium-wireless-headphones",
      description:
        "Experience crystal-clear audio with active noise cancellation, 30-hour battery life, and premium comfort design.",
      price: 2499000,
      comparePrice: 3499000,
      stock: 45,
      images: [productImages.electronics[0], productImages.electronics[0]],
      featured: true,
      categoryId: categories[0].id,
      tags: ["audio", "wireless", "noise-cancelling"],
      rating: 4.8,
      reviewCount: 156,
    },
    {
      name: "Smart Watch Pro",
      slug: "smart-watch-pro",
      description:
        "Track your fitness, receive notifications, and stay connected with this sleek smartwatch.",
      price: 3299000,
      comparePrice: 4299000,
      stock: 32,
      images: [productImages.electronics[1]],
      featured: true,
      categoryId: categories[0].id,
      tags: ["wearable", "fitness", "smart"],
      rating: 4.6,
      reviewCount: 89,
    },
    {
      name: "4K Action Camera",
      slug: "4k-action-camera",
      description:
        "Capture stunning 4K videos with image stabilization, waterproof up to 30m.",
      price: 1899000,
      stock: 28,
      images: [productImages.electronics[2]],
      featured: false,
      categoryId: categories[0].id,
      tags: ["camera", "4k", "waterproof"],
      rating: 4.7,
      reviewCount: 67,
    },

    // Fashion
    {
      name: "Premium Leather Jacket",
      slug: "premium-leather-jacket",
      description:
        "Genuine leather jacket with modern cut and superior craftsmanship.",
      price: 1899000,
      comparePrice: 2699000,
      stock: 18,
      images: [productImages.fashion[0], productImages.fashion[0]],
      featured: true,
      categoryId: categories[1].id,
      tags: ["leather", "outerwear", "premium"],
      rating: 4.9,
      reviewCount: 43,
    },
    {
      name: "Designer Sneakers",
      slug: "designer-sneakers",
      description: "Stylish and comfortable sneakers perfect for any occasion.",
      price: 1299000,
      stock: 56,
      images: [productImages.fashion[1]],
      featured: false,
      categoryId: categories[1].id,
      tags: ["shoes", "casual", "comfort"],
      rating: 4.5,
      reviewCount: 124,
    },
    {
      name: "Luxury Handbag",
      slug: "luxury-handbag",
      description:
        "Elegant handbag made from premium materials with timeless design.",
      price: 2899000,
      comparePrice: 3499000,
      stock: 22,
      images: [productImages.fashion[2], productImages.fashion[2]],
      featured: true,
      categoryId: categories[1].id,
      tags: ["accessories", "luxury", "handbag"],
      rating: 4.8,
      reviewCount: 38,
    },

    // Home & Living
    {
      name: "Modern Coffee Table",
      slug: "modern-coffee-table",
      description:
        "Minimalist coffee table with solid wood construction and elegant finish.",
      price: 2199000,
      stock: 12,
      images: [productImages.home[0]],
      featured: false,
      categoryId: categories[2].id,
      tags: ["furniture", "living-room", "wood"],
      rating: 4.7,
      reviewCount: 29,
    },
    {
      name: "Luxury Bedding Set",
      slug: "luxury-bedding-set",
      description: "Premium Egyptian cotton bedding set for ultimate comfort.",
      price: 1599000,
      stock: 34,
      images: [productImages.home[1]],
      featured: true,
      categoryId: categories[2].id,
      tags: ["bedroom", "cotton", "luxury"],
      rating: 4.9,
      reviewCount: 87,
    },

    // Beauty
    {
      name: "Luxury Skincare Set",
      slug: "luxury-skincare-set",
      description:
        "Complete skincare routine with premium ingredients for radiant skin.",
      price: 899000,
      comparePrice: 1299000,
      stock: 67,
      images: [productImages.beauty[0], productImages.beauty[0]],
      featured: true,
      categoryId: categories[3].id,
      tags: ["skincare", "beauty", "premium"],
      rating: 4.8,
      reviewCount: 234,
    },
    {
      name: "Professional Makeup Kit",
      slug: "professional-makeup-kit",
      description:
        "Complete makeup kit with high-quality products for flawless looks.",
      price: 1299000,
      stock: 41,
      images: [productImages.beauty[1]],
      featured: false,
      categoryId: categories[3].id,
      tags: ["makeup", "cosmetics", "professional"],
      rating: 4.6,
      reviewCount: 178,
    },

    // Sports
    {
      name: "Yoga Mat Premium",
      slug: "yoga-mat-premium",
      description: "Extra thick yoga mat with superior grip and cushioning.",
      price: 499000,
      stock: 89,
      images: [productImages.sports[0]],
      featured: false,
      categoryId: categories[4].id,
      tags: ["yoga", "fitness", "exercise"],
      rating: 4.7,
      reviewCount: 156,
    },
    {
      name: "Running Shoes Pro",
      slug: "running-shoes-pro",
      description:
        "High-performance running shoes with advanced cushioning technology.",
      price: 1799000,
      comparePrice: 2299000,
      stock: 44,
      images: [productImages.sports[1], productImages.sports[1]],
      featured: true,
      categoryId: categories[4].id,
      tags: ["running", "shoes", "performance"],
      rating: 4.9,
      reviewCount: 203,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log("✅ Created products with Unsplash images");

  // Create Sample Orders
  const user1 = await prisma.user.findUnique({
    where: { email: "customer1@example.com" },
  });
  const product1 = await prisma.product.findUnique({
    where: { slug: "premium-wireless-headphones" },
  });
  const product2 = await prisma.product.findUnique({
    where: { slug: "smart-watch-pro" },
  });

  if (user1 && product1 && product2) {
    await prisma.order.create({
      data: {
        orderNumber: "ORD-2024-0001",
        userId: user1.id,
        status: "DELIVERED",
        paymentStatus: "PAID",
        paymentMethod: "Credit Card",
        subtotal: 5798000,
        tax: 579800,
        shipping: 50000,
        total: 6427800,
        shippingName: user1.name!,
        shippingEmail: user1.email,
        shippingPhone: user1.phone!,
        shippingAddress: "Jl. Sudirman No. 123",
        shippingCity: "Jakarta",
        shippingState: "DKI Jakarta",
        shippingZip: "12190",
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

  console.log("✅ Created sample orders");
  console.log("");
  console.log("✨ Seed completed successfully!");
  console.log("");
  console.log("📸 All products now have real images from Unsplash!");
  console.log("");
  console.log("📧 Login Credentials:");
  console.log("   Admin: admin@example.com / admin123");
  console.log("   Customer: customer1@example.com / customer123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
