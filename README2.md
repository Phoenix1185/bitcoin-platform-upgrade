# BitWealth Supabase Database Setup

This file contains all the SQL commands needed to set up your Supabase database for BitWealth.

## How to Use

1. Go to your Supabase Dashboard → SQL Editor
2. Create a "New Query"
3. Copy and paste the SQL below
4. Click "Run"

---

## TABLE 1: PROFILES (User Profiles)

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
  kyc_submitted_at TIMESTAMPTZ,
  kyc_documents JSONB DEFAULT '[]',
  preferred_currency TEXT DEFAULT 'USD',
  preferred_language TEXT DEFAULT 'en',
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  phone_number TEXT,
  country TEXT,
  date_of_birth DATE,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admin can update any profile" 
  ON public.profiles FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));
```

---

## Auto-Create Profile Trigger

```sql
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

---

## TABLE 2: INVESTMENT PLANS

```sql
CREATE TABLE IF NOT EXISTS public.investment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  min_amount DECIMAL(15, 2) NOT NULL,
  max_amount DECIMAL(15, 2) NOT NULL,
  daily_return DECIMAL(5, 2) NOT NULL,
  duration INTEGER NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.investment_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view investment plans" 
  ON public.investment_plans FOR SELECT 
  TO authenticated, anon 
  USING (TRUE);

CREATE POLICY "Only admin can modify investment plans" 
  ON public.investment_plans FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));

-- Insert default plans
INSERT INTO public.investment_plans (name, min_amount, max_amount, daily_return, duration, featured) VALUES
  ('Basic Plan', 100, 999, 5.00, 15, FALSE),
  ('Standard Plan', 1000, 4999, 8.00, 20, FALSE),
  ('Gold Plan', 5000, 24999, 12.00, 30, TRUE),
  ('Platinum Plan', 25000, 49999, 15.00, 45, FALSE),
  ('Diamond Plan', 50000, 1000000, 20.00, 60, FALSE)
ON CONFLICT DO NOTHING;
```

---

## TABLE 3: INVESTMENTS

```sql
CREATE TABLE IF NOT EXISTS public.investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.investment_plans(id),
  plan_name TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  daily_return DECIMAL(5, 2) NOT NULL,
  duration INTEGER NOT NULL,
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'active',
  total_earned DECIMAL(15, 2) DEFAULT 0,
  last_payout_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own investments" 
  ON public.investments FOR SELECT 
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));

CREATE POLICY "Users can create own investments" 
  ON public.investments FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin can update any investment" 
  ON public.investments FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));
```

---

## TABLE 4: TRANSACTIONS

```sql
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  method TEXT,
  address TEXT,
  description TEXT,
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" 
  ON public.transactions FOR SELECT 
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));

CREATE POLICY "Admin can manage transactions" 
  ON public.transactions FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));
```

---

## TABLE 5: DEPOSITS

```sql
CREATE TABLE IF NOT EXISTS public.deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  method TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  tx_hash TEXT,
  network TEXT,
  proof_image TEXT,
  admin_notes TEXT,
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own deposits" 
  ON public.deposits FOR SELECT 
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));

CREATE POLICY "Users can create deposits" 
  ON public.deposits FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin can update deposits" 
  ON public.deposits FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));
```

---

## TABLE 6: WITHDRAWALS

```sql
CREATE TABLE IF NOT EXISTS public.withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  method TEXT NOT NULL,
  address TEXT NOT NULL,
  network TEXT,
  status TEXT DEFAULT 'pending',
  fee DECIMAL(15, 2) DEFAULT 0,
  final_amount DECIMAL(15, 2),
  admin_notes TEXT,
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own withdrawals" 
  ON public.withdrawals FOR SELECT 
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));

CREATE POLICY "Users can create withdrawals" 
  ON public.withdrawals FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin can update withdrawals" 
  ON public.withdrawals FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));
```

---

## TABLE 7: NOTIFICATIONS

```sql
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  action_text TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" 
  ON public.notifications FOR SELECT 
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));

CREATE POLICY "Users can update own notifications" 
  ON public.notifications FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Admin can manage notifications" 
  ON public.notifications FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));
```

---

## TABLE 8: SITE SETTINGS

```sql
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_name TEXT DEFAULT 'BitWealth',
  site_description TEXT DEFAULT 'Your trusted partner in cryptocurrency investment',
  contact_email TEXT DEFAULT 'support@bitwealth.com',
  contact_phone TEXT DEFAULT '+1 (555) 123-4567',
  contact_address TEXT DEFAULT '123 Crypto Street, New York, NY 10001',
  social_links JSONB DEFAULT '[
    {"name": "Twitter", "url": "https://twitter.com", "icon": "twitter"},
    {"name": "Facebook", "url": "https://facebook.com", "icon": "facebook"},
    {"name": "LinkedIn", "url": "https://linkedin.com", "icon": "linkedin"},
    {"name": "Instagram", "url": "https://instagram.com", "icon": "instagram"},
    {"name": "Telegram", "url": "https://t.me", "icon": "telegram"},
    {"name": "YouTube", "url": "https://youtube.com", "icon": "youtube"}
  ]',
  stats JSONB DEFAULT '{
    "totalInvested": 50,
    "totalInvestedSuffix": "M+",
    "activeInvestors": 25,
    "activeInvestorsSuffix": "K+",
    "totalReturns": 12,
    "totalReturnsSuffix": "M+",
    "uptime": 99.9,
    "uptimeSuffix": "%"
  }',
  deposit_addresses JSONB DEFAULT '{
    "bitcoin": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    "ethereum": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    "usdt": {
      "trc20": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
      "erc20": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      "bep20": "0x55d398326f99059fF775485246999027B3197955"
    },
    "usdc": {
      "erc20": "0xA0b86a33E6441E6C7D3D4B4f6c7D8E9f0A1B2C3D",
      "bep20": "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      "solana": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
    },
    "bnb": "bnb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
  }',
  deposit_methods JSONB DEFAULT '{
    "bitcoin": {"enabled": true, "minAmount": 50},
    "ethereum": {"enabled": true, "minAmount": 50},
    "usdt": {"enabled": true, "minAmount": 50, "networks": ["trc20", "erc20", "bep20"]},
    "usdc": {"enabled": true, "minAmount": 50, "networks": ["erc20", "bep20", "solana"]},
    "bnb": {"enabled": true, "minAmount": 50},
    "bank": {"enabled": false, "minAmount": 500, "bankName": "", "accountName": "", "accountNumber": "", "routingNumber": ""}
  }',
  withdrawal_settings JSONB DEFAULT '{
    "minAmount": 50,
    "maxAmount": 100000,
    "processingTime": "24-48 hours",
    "fee": 2,
    "feeType": "percentage"
  }',
  global_withdrawal_frozen BOOLEAN DEFAULT FALSE,
  maintenance_mode BOOLEAN DEFAULT FALSE,
  kyc_required BOOLEAN DEFAULT TRUE,
  kyc_threshold DECIMAL(15, 2) DEFAULT 1000,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings" 
  ON public.site_settings FOR SELECT 
  TO authenticated, anon 
  USING (TRUE);

CREATE POLICY "Only admin can update site settings" 
  ON public.site_settings FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));

INSERT INTO public.site_settings (id) VALUES (1) ON CONFLICT DO NOTHING;
```

---

## TABLE 9: BLOG POSTS

```sql
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  author TEXT NOT NULL,
  author_avatar TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'draft',
  featured BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id)
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published posts" 
  ON public.blog_posts FOR SELECT 
  TO authenticated, anon 
  USING (status = 'published' OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));

CREATE POLICY "Admin can manage blog posts" 
  ON public.blog_posts FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));
```

---

## TABLE 10: SUPPORT TICKETS

```sql
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'open',
  assigned_to UUID REFERENCES public.profiles(id),
  admin_response TEXT,
  responded_at TIMESTAMPTZ,
  responded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tickets" 
  ON public.support_tickets FOR SELECT 
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));

CREATE POLICY "Users can create tickets" 
  ON public.support_tickets FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin can update tickets" 
  ON public.support_tickets FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));
```

---

## TABLE 11: LIVE CHAT MESSAGES

```sql
CREATE TABLE IF NOT EXISTS public.live_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  message TEXT NOT NULL,
  is_from_user BOOLEAN DEFAULT TRUE,
  is_read BOOLEAN DEFAULT FALSE,
  admin_id UUID REFERENCES public.profiles(id),
  admin_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.live_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chat messages" 
  ON public.live_chat_messages FOR SELECT 
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));

CREATE POLICY "Users can send messages" 
  ON public.live_chat_messages FOR INSERT 
  WITH CHECK (user_id = auth.uid() AND is_from_user = TRUE);

CREATE POLICY "Admin can send messages" 
  ON public.live_chat_messages FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));
```

---

## TABLE 12: KYC DOCUMENTS

```sql
CREATE TABLE IF NOT EXISTS public.kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  front_image TEXT NOT NULL,
  back_image TEXT,
  selfie_image TEXT,
  status TEXT DEFAULT 'pending',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id),
  rejection_reason TEXT,
  notes TEXT
);

ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own KYC documents" 
  ON public.kyc_documents FOR SELECT 
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));

CREATE POLICY "Users can submit KYC documents" 
  ON public.kyc_documents FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin can review KYC documents" 
  ON public.kyc_documents FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));
```

---

## TABLE 13: EMAIL CAMPAIGNS

```sql
CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  recipients TEXT NOT NULL,
  specific_user_ids UUID[] DEFAULT '{}',
  sent_at TIMESTAMPTZ,
  status TEXT DEFAULT 'draft',
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admin can manage email campaigns" 
  ON public.email_campaigns FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));
```

---

## TABLE 14: ACTIVITY LOGS

```sql
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  description TEXT,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity logs" 
  ON public.activity_logs FOR SELECT 
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));

CREATE POLICY "System can create activity logs" 
  ON public.activity_logs FOR INSERT 
  WITH CHECK (TRUE);
```

---

## ENABLE REALTIME

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.investments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.deposits;
ALTER PUBLICATION supabase_realtime ADD TABLE public.withdrawals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
```

---

## CREATE INDEXES

```sql
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON public.investments(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_status ON public.investments(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_deposits_user_id ON public.deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_deposits_status ON public.deposits(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON public.withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON public.withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_live_chat_user_id ON public.live_chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_user_id ON public.kyc_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
```

---

## UPDATE TIMESTAMP FUNCTION

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investment_plans_updated_at BEFORE UPDATE ON public.investment_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON public.investments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## TABLE 15: EMAIL SUBSCRIBERS (For Blog Notifications)

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

CREATE POLICY "Admin can view subscribers" 
  ON public.email_subscribers FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));
```

---

## ADMIN SETUP

After signing up with `fredokcee1@gmail.com`, run this to ensure admin access:

```sql
UPDATE public.profiles SET is_admin = TRUE WHERE email = 'fredokcee1@gmail.com';
```

---

## Done!

Your Supabase database is now ready for BitWealth!
