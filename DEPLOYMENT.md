# 🚀 Deployment Guide - Intelligent Journal

Deploy your journaling app to production with Vercel (recommended) or other platforms.

## 🌟 Recommended: Deploy to Vercel

Vercel is the easiest way to deploy Next.js apps and it's **free** for personal projects!

### Step 1: Push to GitHub

1. **Create a new repository** on GitHub
   - Go to [github.com/new](https://github.com/new)
   - Name it (e.g., "intelligent-journal")
   - Click "Create repository"

2. **Push your code** (run in your project folder):
```bash
git init
git add .
git commit -m "Initial commit - Intelligent Journal"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/intelligent-journal.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign up/login with GitHub

2. **Import your repository**
   - Click "Add New" > "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure environment variables**
   - In the "Environment Variables" section, add:
     - Key: `NEXT_PUBLIC_SUPABASE_URL`
     - Value: Your Supabase project URL
   - Add another:
     - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - Value: Your Supabase anon key

4. **Deploy!**
   - Click "Deploy"
   - Wait ~2 minutes
   - Your app is live! 🎉

### Step 3: Get Your URL

Vercel will give you a URL like: `https://your-app.vercel.app`

You can:
- Use this URL directly
- Add a custom domain (in Vercel settings)
- Share it with friends!

---

## 🔧 Alternative: Deploy to Netlify

### Quick Steps:

1. Push code to GitHub (same as above)
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" > "Import from Git"
4. Connect GitHub and select your repo
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add environment variables in Netlify settings
7. Deploy!

---

## 🐳 Alternative: Deploy with Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t intelligent-journal .
docker run -p 3000:3000 --env-file .env.local intelligent-journal
```

---

## ✅ Post-Deployment Checklist

After deploying:

- [ ] Test user registration
- [ ] Test login/logout
- [ ] Create a journal entry
- [ ] Upload an image to vision board
- [ ] Check that auto-save works
- [ ] Test on mobile device
- [ ] Verify all pages load correctly

---

## 🔒 Security Best Practices

### For Production:

1. **Environment Variables**
   - Never commit `.env.local` to GitHub
   - Always add env vars in hosting platform dashboard
   - Rotate keys if accidentally exposed

2. **Supabase Security**
   - Keep RLS policies enabled
   - Review auth settings
   - Monitor usage in Supabase dashboard

3. **Domain & HTTPS**
   - Use custom domain with HTTPS
   - Vercel/Netlify provide this automatically

---

## 📊 Monitoring & Analytics

### Add Analytics (Optional)

1. **Vercel Analytics**
   - Automatically available on Vercel
   - Enable in project settings

2. **Google Analytics**
   - Add GA4 code to `app/layout.tsx`

3. **Supabase Dashboard**
   - Monitor database usage
   - Check auth activity
   - Review storage usage

---

## 🔄 Continuous Deployment

With Vercel/Netlify, every push to `main` branch automatically deploys!

### Workflow:
```bash
# Make changes locally
git add .
git commit -m "Add new feature"
git push

# Wait ~2 minutes - changes are live!
```

---

## 💰 Pricing & Limits

### Free Tier Limits:

**Vercel (Hobby):**
- Unlimited deployments
- 100GB bandwidth/month
- Perfect for personal use

**Supabase (Free):**
- 500MB database
- 1GB file storage
- 50,000 monthly active users
- More than enough for personal journaling!

### When to Upgrade:

- You'll know when you need it
- Supabase shows usage in dashboard
- Typically not needed for personal use

---

## 🎯 Custom Domain Setup

### On Vercel:

1. Go to your project settings
2. Click "Domains"
3. Add your domain (e.g., `myjournal.com`)
4. Follow DNS setup instructions
5. Wait for DNS propagation (~24 hours max)

---

## 🐛 Deployment Troubleshooting

### Build fails with module errors
- Check all imports use correct paths
- Verify `package.json` has all dependencies
- Try `npm install` locally first

### Environment variables not working
- Make sure they start with `NEXT_PUBLIC_`
- Rebuild after adding env vars
- Check spelling exactly matches

### Images not loading in production
- Verify Supabase storage bucket is public
- Check `next.config.js` has correct image domains
- Test image URLs directly in browser

### Auth not working after deployment
- Add your production URL to Supabase > Authentication > URL Configuration
- Add to "Redirect URLs" if using OAuth

---

## 📱 Progressive Web App (Optional)

Make your journal installable on mobile!

Add to `next.config.js`:
```js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
})

module.exports = withPWA({
  // your config
})
```

Then: `npm install next-pwa`

---

## 🎉 You're Live!

Congratulations! Your premium journaling app is now accessible worldwide!

**Share it with friends:**
- Send them the URL
- They can create their own accounts
- All data is private and secure
- Each user has their own isolated journal

Enjoy your deployed app! 🌟
