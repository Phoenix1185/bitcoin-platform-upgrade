# Supabase Configuration Guide for BitWealth

This guide explains how to configure your Supabase project for BitWealth.

---

## 1. Environment Variables (.env file)

Create a `.env` file in your project root with these variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: Custom redirect URL after login (defaults to current domain)
VITE_REDIRECT_URL=https://your-domain.com/dashboard
```

### Getting Your Supabase Credentials:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Project Settings** → **API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public** key → `VITE_SUPABASE_ANON_KEY`

---

## 2. Authentication Settings in Supabase

### Step 1: Configure Site URL

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to your production domain:
   ```
   https://your-domain.com
   ```
3. Add **Redirect URLs** (one per line):
   ```
   https://your-domain.com/dashboard
   https://your-domain.com/login
   http://localhost:5173/dashboard    # For local development
   http://localhost:5173/login          # For local development
   ```

### Step 2: Enable Email Provider

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure settings:
   - ✅ Enable "Confirm email"
   - ✅ Enable "Secure email change"
   - Set **SMTP Settings** (optional but recommended for production)

### Step 3: Enable Google OAuth (Optional)

1. Go to **Authentication** → **Providers**
2. Find **Google** and click **Enable**
3. Add your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
4. Set **Redirect URL** in Google Cloud Console:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```

---

## 3. Database Tables Setup

Run these SQL commands in your Supabase SQL Editor:

### Table 1: Profiles
```sql
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  balance DECIMAL(15, 2) DEFAULT 0,
  total_invested DECIMAL(15, 2) DEFAULT 0,
  total_returns DECIMAL(15, 2) DEFAULT 0,
  is_admin BOOLEAN DEFAULT FALSE,
  is_frozen BOOLEAN DEFAULT FALSE,
  withdrawal_frozen BOOLEAN DEFAULT FALSE,
  kyc_verified BOOLEAN DEFAULT FALSE,
  kyc_status TEXT DEFAULT 'not_submitted',
  preferred_currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, is_admin)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    LOWER(NEW.email) = 'fredokcee1@gmail.com'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Table 2: Email Subscribers
```sql
CREATE TABLE IF NOT EXISTS public.email_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe" 
  ON public.email_subscribers FOR INSERT 
  TO anon, authenticated
  WITH CHECK (TRUE);
```

---

## 4. Vercel Environment Variables

If deploying to Vercel, add these environment variables:

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `your-anon-key` | Production, Preview, Development |
| `VITE_REDIRECT_URL` | `https://your-domain.com/dashboard` | Production |

---

## 5. Common Issues & Solutions

### Issue: Login keeps loading

**Solution:**
1. Check that `profiles` table exists
2. Check that the `handle_new_user` trigger is created
3. Check browser console for errors
4. Verify environment variables are set correctly

### Issue: Email subscription keeps loading

**Solution:**
1. Run the SQL to create `email_subscribers` table
2. Check RLS policies are configured
3. Verify Supabase URL and key are correct

### Issue: Google login not working

**Solution:**
1. Check Google OAuth credentials are correct
2. Verify redirect URL in Google Cloud Console matches Supabase callback URL
3. Add your domain to **Authorized JavaScript origins** in Google Cloud

---

## 6. Testing Locally

1. Create `.env` file:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_REDIRECT_URL=http://localhost:5173/dashboard
```

2. Run the development server:
```bash
npm run dev
```

3. Test signup/login flow

---

## 7. Production Checklist

- [ ] Environment variables set in Vercel
- [ ] Site URL configured in Supabase Auth
- [ ] Redirect URLs added in Supabase Auth
- [ ] Email provider configured (SMTP optional)
- [ ] Google OAuth configured (optional)
- [ ] All database tables created
- [ ] RLS policies configured
- [ ] Test signup flow
- [ ] Test login flow
- [ ] Test email subscription

---

## Quick Reference

### Supabase Dashboard URLs:
- **Project Settings**: `https://app.supabase.com/project/_/settings/general`
- **Auth Settings**: `https://app.supabase.com/project/_/auth/settings`
- **SQL Editor**: `https://app.supabase.com/project/_/sql`
- **Table Editor**: `https://app.supabase.com/project/_/editor`

### Replace `_` with your project ID
