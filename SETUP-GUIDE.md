# 🚀 QUICK START GUIDE - Intelligent Journal

Follow these steps to get your journaling app running!

## ✅ Step-by-Step Setup

### 1️⃣ Install Dependencies ✓ DONE
Dependencies are already installed!

### 2️⃣ Set Up Supabase Database

1. **Go to [supabase.com](https://supabase.com)** and sign in/create account
2. **Create a new project**
   - Give it a name (e.g., "intelligent-journal")
   - Set a database password (save this!)
   - Choose a region close to you
   - Wait for project to initialize (~2 minutes)

3. **Run the database schema**
   - In your Supabase dashboard, go to **SQL Editor** (left sidebar)
   - Click **New Query**
   - Open the file `supabase-schema.sql` in this project
   - Copy ALL the SQL code
   - Paste it into the Supabase SQL Editor
   - Click **RUN** (bottom right)
   - You should see "Success. No rows returned" - this is good!

4. **Create Storage Bucket for Images**
   - Go to **Storage** (left sidebar)
   - Click **New Bucket**
   - Name: `vision-board`
   - Make it **Public**: Toggle ON
   - Click **Create Bucket**

### 3️⃣ Configure Environment Variables

1. **Get your Supabase credentials**
   - In Supabase dashboard, go to **Settings** (gear icon) > **API**
   - Copy these two values:
     - `Project URL` (looks like: https://xxxxxxxxxxxxx.supabase.co)
     - `anon public` key (under "Project API keys")

2. **Create environment file**
   - In this project folder, create a file named `.env.local`
   - Add these lines (replace with YOUR values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

   - Save the file

### 4️⃣ Start the Development Server

Open a terminal in this project folder and run:

```bash
npm run dev
```

### 5️⃣ Open the App

Open your browser and go to: **http://localhost:3000**

You should see the login page! 🎉

### 6️⃣ Create Your First Account

1. Click "Create one" (or go to register)
2. Enter your email and password
3. Click "Create Account"
4. You're in! Start journaling! ✨

---

## 🎯 First Steps in the App

1. **Today Page**: Log your mood and daily thoughts
2. **Vision Board**: Add your first vision with an image
3. **Identity**: Define who you're becoming
4. **Settings**: Personalize your profile

---

## ❗ Troubleshooting

### "Missing Supabase environment variables" error
- Make sure `.env.local` exists in the project root
- Check that you copied the URL and key correctly
- Restart the dev server (`npm run dev`)

### Can't log in after creating account
- Check the Supabase dashboard > Authentication > Users
- Verify your account appears there
- Try logging out and back in

### Images not uploading to Vision Board
- Check that you created the `vision-board` storage bucket
- Make sure it's set to **Public**
- Verify the bucket name is exactly `vision-board`

### Database errors
- Make sure you ran the ENTIRE `supabase-schema.sql` file
- Check Supabase > SQL Editor > History to see if queries ran
- Try running the schema again (it's safe to run multiple times)

---

## 📚 Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## 🎨 Customization Ideas

- Change colors in `tailwind.config.ts`
- Add more reflection themes in guided-reflections
- Customize the mood emojis in components
- Add more vision board categories

Enjoy your premium journaling experience! 🌟
