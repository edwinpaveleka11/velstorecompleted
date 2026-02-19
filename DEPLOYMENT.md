# 🚀 Deployment Guide - VelStore

Panduan lengkap untuk deploy aplikasi ke production.

## 📋 Pre-Deployment Checklist

- [ ] Test semua fitur di local
- [ ] Setup production database
- [ ] Generate secure NEXTAUTH_SECRET
- [ ] Prepare environment variables
- [ ] Review security settings

## 🌐 Deploy ke Vercel (Recommended)

Vercel adalah platform terbaik untuk Next.js apps dengan setup otomatis.

### Step 1: Prepare Repository

```bash
# Initialize git (jika belum)
git init
git add .
git commit -m "Initial commit"

# Push ke GitHub
git remote add origin https://github.com/username/velstore_completed.git
git push -u origin main
```

### Step 2: Deploy di Vercel

1. Buka https://vercel.com
2. Sign up/Login dengan GitHub
3. Click "New Project"
4. Import repository `velstore`
5. Configure project:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 3: Setup Environment Variables

Di Vercel dashboard, masuk ke Settings → Environment Variables:

```env
DATABASE_URL=your-production-database-url
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secure-secret-key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Step 4: Deploy Database Schema

Setelah deploy, run migrations di Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Run database setup
vercel env pull .env.production
DATABASE_URL=production-url npm run db:push
DATABASE_URL=production-url npm run db:seed
```

### Step 5: Custom Domain (Optional)

1. Di Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Configure DNS records di provider domain kamu

## 🗄️ Production Database Options

### Option 1: Supabase (Recommended)

**Pros:**
- Free tier: 500MB storage
- PostgreSQL compatible
- Built-in auth & storage
- Easy setup

**Setup:**
1. Buka https://supabase.com
2. New Project
3. Copy connection string:
   ```
   postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
   ```

### Option 2: Railway

**Pros:**
- Free tier: 500MB storage
- One-click PostgreSQL
- Auto backups

**Setup:**
1. Buka https://railway.app
2. New Project → PostgreSQL
3. Copy connection string dari Variables tab

### Option 3: Neon

**Pros:**
- Free tier: 1GB storage
- Serverless PostgreSQL
- Auto-scaling

**Setup:**
1. Buka https://neon.tech
2. New Project
3. Copy connection string

### Option 4: PlanetScale

**Pros:**
- Free tier: 5GB storage
- MySQL-based (modify schema accordingly)
- Branching database

**Note:** Requires schema changes for MySQL compatibility.

## 🔒 Security Checklist

### Environment Variables

✅ Never commit `.env` file
✅ Use strong NEXTAUTH_SECRET (min 32 characters)
✅ Use production database with SSL
✅ Limit CORS if using API routes

### Database

✅ Use connection pooling
✅ Enable SSL connections
✅ Regular backups
✅ Limit public access

### Code

✅ Remove console.logs in production
✅ Minify assets
✅ Enable CSP headers
✅ Implement rate limiting

## ⚡ Performance Optimization

### 1. Image Optimization

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-cdn.com'],
    formats: ['image/avif', 'image/webp'],
  },
};
```

### 2. Database Connection Pooling

```env
# Add to DATABASE_URL
DATABASE_URL="...?connection_limit=5&pool_timeout=2"
```

### 3. Enable Caching

```typescript
// In your API routes
export const revalidate = 3600; // Revalidate every hour
```

## 📊 Monitoring

### Vercel Analytics

Enable di Vercel dashboard:
1. Analytics tab
2. Enable Web Analytics
3. View real-time metrics

### Error Tracking

Integrate Sentry:
```bash
npm install @sentry/nextjs
```

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}
```

## 🧪 Post-Deployment Testing

1. **Functionality Test**
   - [ ] Homepage loads
   - [ ] Products listing works
   - [ ] Login/Register works
   - [ ] Cart functionality
   - [ ] Checkout process
   - [ ] Admin dashboard

2. **Performance Test**
   - [ ] Page load time < 3s
   - [ ] Images optimized
   - [ ] No console errors

3. **Security Test**
   - [ ] HTTPS enabled
   - [ ] Auth working
   - [ ] Admin routes protected

## 🆘 Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Database Connection Issues

```bash
# Test connection
npx prisma db pull
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support Resources

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Prisma Production: https://www.prisma.io/docs/guides/deployment

## 🎉 Success!

Your app is now live! Share your production URL:
- Homepage: https://your-app.vercel.app
- Admin: https://your-app.vercel.app/admin

---

**Need help?** Create an issue or check the main README.md
