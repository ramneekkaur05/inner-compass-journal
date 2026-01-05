# ⚡ QUICK START - GET YOUR APP RUNNING IN 10 MINUTES!

## 🎯 What You Need

1. ✅ Project files (done - already created!)
2. ⏳ Supabase account (free)
3. ⏳ 10 minutes

---

## 📋 STEP-BY-STEP CHECKLIST

### ✅ STEP 1: Create Supabase Project (3 minutes)

1. **Go to** → [supabase.com](https://supabase.com)
2. **Click** → "Start your project"
3. **Sign up** with GitHub (easiest) or email
4. **Click** → "New Project"
5. **Fill in**:
   - Organization: Create new (any name)
   - Name: `intelligent-journal`
   - Database Password: Create a STRONG password
   - Region: Choose closest to you
6. **Click** → "Create new project"
7. **Wait** → ~2 minutes while it sets up

---

### ✅ STEP 2: Set Up Database (2 minutes)

1. **In Supabase dashboard**, click **"SQL Editor"** (left sidebar, lightning icon)
2. **Click** → "New Query"
3. **Open this file** in VS Code: `supabase-schema.sql`
4. **Select ALL** the SQL code (Ctrl+A)
5. **Copy it** (Ctrl+C)
6. **Paste** into Supabase SQL Editor (Ctrl+V)
7. **Click** → "RUN" (bottom right corner)
8. **You should see**: "Success. No rows returned" ✅

---

### ✅ STEP 3: Create Storage Bucket (1 minute)

1. **In Supabase dashboard**, click **"Storage"** (left sidebar, folder icon)
2. **Click** → "New bucket"
3. **Enter name**: `vision-board` (exactly this!)
4. **Toggle ON** → "Public bucket"
5. **Click** → "Create bucket"
6. **Done!** ✅

---

### ✅ STEP 4: Get Your Credentials (1 minute)

1. **In Supabase dashboard**, click **Settings** (gear icon, bottom left)
2. **Click** → "API" (in settings menu)
3. **Find** these two values:
   - **Project URL** (starts with https://)
   - **anon public** key (long string under "Project API keys")
4. **Keep this tab open** - you'll need these in the next step!

---

### ✅ STEP 5: Configure Your App (2 minutes)

1. **Open this file** in VS Code: `.env.local`
2. **Replace** the placeholder values with YOUR credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-from-supabase
```

3. **Make sure**:
   - No quotes around the values
   - No spaces
   - Copy the ENTIRE URL and key
4. **Save** the file (Ctrl+S)

---

### ✅ STEP 6: Start Your App (1 minute)

1. **Open terminal** in VS Code (Ctrl+`)
2. **Run this command**:
```bash
npm run dev
```
3. **Wait** ~10 seconds
4. **You should see**: "Ready in Xms" and a URL

---

### ✅ STEP 7: Open & Test! (1 minute)

1. **Open browser** → Go to: http://localhost:3000
2. **You should see** → Beautiful login page! 🎉
3. **Click** → "Create one" (or "Create Account")
4. **Enter**:
   - Email: your-email@example.com
   - Password: at least 6 characters
5. **Click** → "Create Account"
6. **You're in!** Start journaling! ✨

---

## 🎨 Try These Features First

Now that you're logged in:

### 1. **Today Page** (you're already here!)
- Select your mood
- Write in "Daily Recap"
- Add gratitude
- Create a checklist item
- **Watch it auto-save!** ✓

### 2. **Vision Board**
- Click "Vision Board" in sidebar
- Click "+ Add Vision Item"
- Choose a category
- Write an affirmation
- Upload an image (optional)
- Click "Add Item"

### 3. **Identity Page**
- Click "Identity" in sidebar
- Add who you're becoming
- Add your core values
- Everything auto-saves!

### 4. **Insights**
- Click "Insights" in sidebar
- See your mood trends
- (Add more journal entries to see better charts!)

---

## ❗ TROUBLESHOOTING

### "Missing Supabase environment variables"
→ Check `.env.local` file exists
→ Make sure you copied the FULL URL and key
→ Restart dev server: Stop (Ctrl+C) and run `npm run dev` again

### Can't create account / Login not working
→ Check Supabase > Authentication > Users
→ See if your user was created
→ Try different email
→ Check password is 6+ characters

### "Failed to fetch" errors
→ Check internet connection
→ Verify Supabase project is running (check dashboard)
→ Confirm credentials in `.env.local` are correct

### Images won't upload to Vision Board
→ Make sure storage bucket is named exactly `vision-board`
→ Verify it's set to "Public"
→ Check Supabase > Storage > vision-board exists

---

## 🎉 YOU'RE DONE!

Congratulations! You now have a fully functional, premium journaling app running locally!

### What's Next?

- **Use it daily** - Build the habit!
- **Explore all pages** - Try every feature
- **Customize it** - Change colors, add features
- **Deploy it** - See DEPLOYMENT.md to put it online
- **Share it** - Deploy and give friends the URL

---

## 📚 Documentation Files

Need more help? Check these files:

| File | What It Does |
|------|--------------|
| `README.md` | Full project overview |
| `SETUP-GUIDE.md` | Detailed setup instructions |
| `DEPLOYMENT.md` | How to deploy to production |
| `PROJECT-SUMMARY.md` | Complete feature list |
| `supabase-schema.sql` | Database structure |

---

## 💡 Pro Tips

1. **Auto-save works!** - Just type and it saves. No "Save" button needed!
2. **Navigate with sidebar** - All features are in the left menu
3. **Try everything** - Each page has unique features
4. **Journal daily** - The more you use it, the better the insights
5. **Mobile friendly** - Try it on your phone's browser!

---

## 🚀 Want to Deploy?

Ready to put your app online? It's FREE with Vercel:

1. Push code to GitHub
2. Sign up at vercel.com
3. Import your repo
4. Add environment variables
5. Deploy!

Full instructions in `DEPLOYMENT.md`

---

**Enjoy your premium journaling experience!** ✨

Questions? Check the documentation files or Supabase/Next.js docs.
