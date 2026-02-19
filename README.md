# 🛍️ VelStore - E-Commerce & Admin Dashboard

Aplikasi e-commerce modern dengan admin dashboard yang elegan, dibangun menggunakan Next.js 14, TypeScript, Prisma, PostgreSQL, dan NextAuth.

## ✨ Fitur Utama

### 🎨 Frontend E-Commerce
- **Homepage Modern**: Hero section dengan gradient yang menarik
- **Product Catalog**: Grid produk dengan filter dan search
- **Product Detail**: Halaman detail produk dengan gambar, review, dan related products
- **Shopping Cart**: Keranjang belanja dengan real-time update
- **Checkout Process**: Proses checkout yang smooth dengan form validasi
- **User Authentication**: Login/Register dengan NextAuth
- **Wishlist**: Simpan produk favorit
- **Order History**: Riwayat pesanan customer
- **Responsive Design**: Tampilan optimal di semua device

### 📊 Admin Dashboard
- **Dashboard Overview**: Statistik penjualan dan order
- **Product Management**: CRUD produk dengan upload gambar
- **Order Management**: Kelola pesanan dan status
- **Customer Management**: Lihat data customer
- **Category Management**: Kelola kategori produk
- **Analytics**: Grafik penjualan dengan Recharts
- **Role-Based Access**: Admin-only pages

### 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React

## 📋 Prerequisites

Sebelum memulai, pastikan kamu sudah install:
- Node.js 18+ 
- PostgreSQL 14+
- npm atau yarn

## 🚀 Cara Install & Setup

### 1. Clone atau Extract Project

Jika sudah extract, masuk ke folder project:
```bash
cd luxeshop-premium
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database PostgreSQL

#### Opsi A: Menggunakan PostgreSQL Lokal

1. Install PostgreSQL dari https://www.postgresql.org/download/
2. Buat database baru:
```sql
CREATE DATABASE luxeshop;
```

#### Opsi B: Menggunakan Railway (Free Cloud PostgreSQL)

1. Buka https://railway.app/
2. Sign up (gratis dengan GitHub)
3. Klik "New Project" → "Provision PostgreSQL"
4. Copy connection string dari tab "Connect"

#### Opsi C: Menggunakan Supabase (Free Cloud PostgreSQL)

1. Buka https://supabase.com
2. Sign up dan buat project baru
3. Di Settings → Database, copy connection string (mode "Session")

### 4. Konfigurasi Environment Variables

Buat file `.env` di root folder:

```bash
cp .env.example .env
```

Edit file `.env` dan isi dengan data berikut:

```env
# Database URL - Pilih salah satu format sesuai setup kamu:

# Untuk PostgreSQL Lokal:
DATABASE_URL="postgresql://postgres:password@localhost:5432/luxeshop?schema=public"

# Untuk Railway:
DATABASE_URL="postgresql://postgres:PASSWORD@HOST:PORT/railway?schema=public"

# Untuk Supabase:
DATABASE_URL="postgresql://postgres:PASSWORD@HOST:5432/postgres?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generated-secret-key-here"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Generate NEXTAUTH_SECRET:**
```bash
# Di terminal, jalankan:
openssl rand -base64 32

# Atau gunakan online generator:
# https://generate-secret.vercel.app/32
```

### 5. Setup Database Schema & Seed Data

```bash
# Push schema ke database
npm run db:push

# Seed database dengan sample data
npm run db:seed
```

Perintah `db:seed` akan otomatis membuat:
- 1 Admin user
- 2 Customer users
- 5 Categories
- 12 Products dengan berbagai kategori
- Sample orders

### 6. Jalankan Development Server

```bash
npm run dev
```

Buka browser dan akses: **http://localhost:3000**

## 🔐 Login Credentials

Setelah seeding, gunakan credentials berikut untuk login:

### Admin Access
```
Email: admin@luxeshop.com
Password: admin123
```
- Akses ke Admin Dashboard (/admin)
- Manage products, orders, customers

### Customer Access
```
Email: customer1@example.com
Password: customer123
```
- Shopping experience
- View orders, wishlist

## 📁 Struktur Project

```
luxeshop-premium/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Sample data seeder
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── admin/         # Admin dashboard pages
│   │   ├── product/       # Product detail pages
│   │   ├── cart/          # Shopping cart
│   │   ├── checkout/      # Checkout flow
│   │   ├── login/         # Login page
│   │   └── page.tsx       # Homepage
│   ├── components/        # React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ProductCard.tsx
│   ├── lib/
│   │   ├── prisma.ts      # Prisma client
│   │   ├── auth.ts        # NextAuth config
│   │   └── utils.ts       # Utility functions
│   ├── store/
│   │   └── cart-store.ts  # Zustand cart state
│   └── types/             # TypeScript types
├── public/                # Static assets
├── .env                   # Environment variables
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## 🎯 Fitur-Fitur Utama

### Customer Features
1. **Browse Products** - Lihat semua produk dengan filter kategori
2. **Product Detail** - Detail lengkap dengan rating dan reviews
3. **Add to Cart** - Tambah produk ke keranjang
4. **Checkout** - Proses pembelian dengan form shipping
5. **Order Tracking** - Lihat status pesanan
6. **Wishlist** - Simpan produk favorit

### Admin Features
1. **Dashboard** - Overview sales, orders, revenue
2. **Product Management** - CRUD operations untuk produk
3. **Order Management** - Update order status
4. **Customer List** - Lihat semua customer
5. **Category Management** - Kelola kategori
6. **Analytics** - Grafik penjualan bulanan

## 🎨 Design System

### Warna Utama
- **Primary**: Purple (#8B5CF6)
- **Secondary**: Pink (#D946EF)
- **Success**: Green (#10B981)
- **Danger**: Red (#EF4444)

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, berbagai ukuran
- **Body**: Regular, 16px base

### Components
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Multiple variants (primary, secondary, outline)
- **Inputs**: Clean dengan focus states
- **Badges**: Status indicators dengan warna

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:push      # Push schema to database
npm run db:seed      # Seed sample data
npm run db:studio    # Open Prisma Studio (database GUI)

# Code Quality
npm run lint         # Run ESLint
```

## 📊 Database Schema Overview

### Core Models
- **User** - Customer & Admin accounts
- **Product** - Product catalog
- **Category** - Product categories
- **Order** - Customer orders
- **OrderItem** - Order line items
- **Review** - Product reviews
- **WishlistItem** - Customer wishlist

## 🚀 Deployment

### Deploy ke Vercel (Recommended)

1. Push code ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Set environment variables di Vercel dashboard
4. Deploy!

Vercel otomatis:
- Build Next.js app
- Setup serverless functions
- Configure CDN

### Database untuk Production

Gunakan:
- **Supabase** (Free tier: 500MB)
- **Railway** (Free tier: 500MB)
- **Neon** (Free tier: 1GB)
- **PlanetScale** (Free tier: 5GB)

## 📝 Customization Tips

### Mengubah Warna Theme
Edit `tailwind.config.js`:
```js
colors: {
  primary: {
    // ubah nilai hex di sini
  }
}
```

### Menambah Kategori
Jalankan Prisma Studio:
```bash
npm run db:studio
```
Tambah kategori baru melalui GUI

### Upload Gambar Produk
Untuk production, integrate dengan:
- **Cloudinary** (image hosting)
- **Uploadthing** (Next.js friendly)
- **Vercel Blob** (built-in)

## 🐛 Troubleshooting

### Database Connection Error
```
Error: Can't reach database server
```
**Solusi:**
- Check DATABASE_URL di .env
- Pastikan PostgreSQL running
- Test connection dengan Prisma Studio

### NextAuth Error
```
Error: NEXTAUTH_SECRET is not set
```
**Solusi:**
- Generate secret: `openssl rand -base64 32`
- Tambahkan ke .env

### Module Not Found
```
Error: Cannot find module 'X'
```
**Solusi:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **NextAuth**: https://next-auth.js.org

## 📄 License

MIT License - Free to use for personal and commercial projects

---

**Dibuat dengan ❤️ menggunakan Next.js, TypeScript, dan Tailwind CSS**

Selamat menggunakan LuxeShop Premium! 🎉
