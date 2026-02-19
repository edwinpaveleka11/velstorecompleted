# 🚀 Quick Start Guide - LuxeShop Premium

Panduan cepat untuk menjalankan aplikasi dalam 5 menit!

## ⚡ Setup Super Cepat

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database (Pilih Salah Satu)

#### Opsi A: PostgreSQL Lokal (Recommended untuk Development)
```bash
# Install PostgreSQL
# Windows: https://www.postgresql.org/download/windows/
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql

# Create database
createdb luxeshop

# Set DATABASE_URL di .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/luxeshop"
```

#### Opsi B: Railway (Cloud - Paling Mudah!)
1. Buka https://railway.app
2. Sign up dengan GitHub (gratis)
3. New Project → Provision PostgreSQL
4. Copy connection string
5. Paste ke .env

#### Opsi C: Supabase (Cloud - Alternative)
1. Buka https://supabase.com
2. New project
3. Settings → Database → Copy connection string (session mode)
4. Paste ke .env

### 3. Copy Environment File
```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="your-database-url-here"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
```

### 4. Setup Database & Seed
```bash
npm run db:push
npm run db:seed
```

### 5. Run Development Server
```bash
npm run dev
```

Buka: **http://localhost:3000**

## 🔑 Login Credentials

### Admin
```
Email: admin@luxeshop.com
Password: admin123
URL: /admin
```

### Customer
```
Email: customer1@example.com
Password: customer123
```

## 🎯 What's Next?

1. **Explore Homepage** - Lihat featured products
2. **Browse Products** - /products
3. **Login as Admin** - /admin (manage products, orders)
4. **Test Checkout** - Add items to cart dan checkout
5. **View Orders** - Check order history

## 🛠️ Useful Commands

```bash
# Development
npm run dev              # Start dev server

# Database
npm run db:push          # Update database schema
npm run db:seed          # Seed sample data
npm run db:studio        # Open Prisma Studio (database GUI)

# Production
npm run build            # Build for production
npm run start            # Start production server
```

## 🎨 Customize

### Change Colors
Edit `tailwind.config.js`:
```js
colors: {
  primary: { /* your colors */ }
}
```

### Add Products
1. Login as admin
2. Go to /admin/products
3. Click "Add New Product"

### Update Logo
Replace in `src/components/Header.tsx` and `Footer.tsx`

## 🐛 Common Issues

### Database Connection Error
- Check DATABASE_URL format
- Ensure PostgreSQL is running
- Test with: `npm run db:studio`

### Port Already in Use
```bash
# Kill process on port 3000
# Mac/Linux: lsof -ti:3000 | xargs kill
# Windows: netstat -ano | findstr :3000
```

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Learn More

- [Full Documentation](./README.md)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)

---

Need help? Check the main [README.md](./README.md) for detailed instructions!
