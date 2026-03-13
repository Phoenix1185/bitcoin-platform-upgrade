-- =====================================================
-- BITWEALTH SUPABASE DATABASE SCHEMA
-- Run these tables one by one in your Supabase SQL Editor
-- =====================================================

-- =====================================================
-- TABLE 1: PROFILES (User profiles - auto-created via trigger)
-- =====================================================
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
  kyc_status TEXT DEFAULT 'not_submitted', -- not_submitted, pending, approved, rejected
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

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profile policies
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

-- Function to auto-create profile on signup
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

-- Trigger to create profile after signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- TABLE 2: INVESTMENT PLANS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.investment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  min_amount DECIMAL(15, 2) NOT NULL,
  max_amount DECIMAL(15, 2) NOT NULL,
  daily_return DECIMAL(5, 2) NOT NULL, -- percentage (e.g., 5.00 = 5%)
  duration INTEGER NOT NULL, -- days
  featured BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.investment_plans ENABLE ROW LEVEL SECURITY;

-- Policies
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

-- =====================================================
-- TABLE 3: INVESTMENTS (User investments)
-- =====================================================
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
  status TEXT DEFAULT 'active', -- active, completed, cancelled
  total_earned DECIMAL(15, 2) DEFAULT 0,
  last_payout_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

-- Policies
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

-- =====================================================
-- TABLE 4: TRANSACTIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- deposit, withdrawal, investment, return, bonus, penalty
  amount DECIMAL(15, 2) NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  method TEXT, -- bitcoin, ethereum, usdt, usdc, bank, etc.
  address TEXT,
  description TEXT,
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Policies
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

-- =====================================================
-- TABLE 5: DEPOSITS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  method TEXT NOT NULL, -- bitcoin, ethereum, usdt_trc20, usdt_erc20, usdt_bep20, etc.
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  tx_hash TEXT,
  network TEXT, -- for crypto deposits
  proof_image TEXT, -- URL to proof image
  admin_notes TEXT,
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

-- Policies
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

-- =====================================================
-- TABLE 6: WITHDRAWALS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  method TEXT NOT NULL, -- bitcoin, ethereum, usdt, usdc, bank
  address TEXT NOT NULL,
  network TEXT, -- for crypto withdrawals
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  fee DECIMAL(15, 2) DEFAULT 0,
  final_amount DECIMAL(15, 2),
  admin_notes TEXT,
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- Policies
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

-- =====================================================
-- TABLE 7: NOTIFICATIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- deposit, withdrawal, investment, return, kyc, account, system, support, announcement
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  action_text TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies
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

-- =====================================================
-- TABLE 8: SITE SETTINGS
-- =====================================================
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

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view site settings" 
  ON public.site_settings FOR SELECT 
  TO authenticated, anon 
  USING (TRUE);

CREATE POLICY "Only admin can update site settings" 
  ON public.site_settings FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));

-- Insert default settings
INSERT INTO public.site_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

-- =====================================================
-- TABLE 9: BLOG POSTS
-- =====================================================
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
  status TEXT DEFAULT 'draft', -- draft, published, archived
  featured BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id)
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Policies
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

-- Insert sample blog posts
INSERT INTO public.blog_posts (title, slug, excerpt, content, author, category, status, featured, published_at) VALUES
  (
    'Getting Started with Cryptocurrency Investment',
    'getting-started-with-cryptocurrency-investment',
    'Learn the basics of cryptocurrency investment and how to start your journey with BitWealth.',
    '<h2>Introduction to Cryptocurrency Investment</h2><p>Cryptocurrency has revolutionized the way we think about money and investment. With BitWealth, you can start your investment journey with confidence.</p><h2>Why Invest in Cryptocurrency?</h2><p>Cryptocurrencies offer several advantages over traditional investments: High potential returns, 24/7 market access, Global accessibility, Portfolio diversification</p>',
    'BitWealth Team',
    'Getting Started',
    'published',
    TRUE,
    NOW()
  ),
  (
    'Understanding Daily Returns in Crypto Investment',
    'understanding-daily-returns',
    'Discover how daily returns work and how to maximize your earnings with our investment plans.',
    '<h2>What Are Daily Returns?</h2><p>Daily returns are the profits you earn on your investment every day. At BitWealth, we offer competitive daily return rates ranging from 5% to 20%.</p>',
    'Sarah Johnson',
    'Education',
    'published',
    FALSE,
    NOW()
  )
ON CONFLICT DO NOTHING;

-- =====================================================
-- TABLE 10: SUPPORT TICKETS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT NOT NULL, -- deposit, withdrawal, investment, account, technical, other
  priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
  status TEXT DEFAULT 'open', -- open, in_progress, resolved, closed
  assigned_to UUID REFERENCES public.profiles(id),
  admin_response TEXT,
  responded_at TIMESTAMPTZ,
  responded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Policies
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

-- =====================================================
-- TABLE 11: LIVE CHAT MESSAGES
-- =====================================================
CREATE TABLE IF NOT EXISTS public.live_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  message TEXT NOT NULL,
  is_from_user BOOLEAN DEFAULT TRUE, -- true = from user, false = from admin/support
  is_read BOOLEAN DEFAULT FALSE,
  admin_id UUID REFERENCES public.profiles(id),
  admin_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.live_chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies
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

-- =====================================================
-- TABLE 12: KYC DOCUMENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- passport, drivers_license, national_id, utility_bill, bank_statement
  front_image TEXT NOT NULL,
  back_image TEXT,
  selfie_image TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id),
  rejection_reason TEXT,
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;

-- Policies
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

-- =====================================================
-- TABLE 13: EMAIL CAMPAIGNS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  recipients TEXT NOT NULL, -- all, specific
  specific_user_ids UUID[] DEFAULT '{}',
  sent_at TIMESTAMPTZ,
  status TEXT DEFAULT 'draft', -- draft, sending, sent
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Only admin can manage email campaigns" 
  ON public.email_campaigns FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));

-- =====================================================
-- TABLE 14: ACTIVITY LOGS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- login, logout, deposit, withdrawal, investment, etc.
  description TEXT,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own activity logs" 
  ON public.activity_logs FOR SELECT 
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));

CREATE POLICY "System can create activity logs" 
  ON public.activity_logs FOR INSERT 
  WITH CHECK (TRUE);

-- =====================================================
-- REALTIME SUBSCRIPTIONS (Enable realtime for key tables)
-- =====================================================
-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Enable realtime for investments
ALTER PUBLICATION supabase_realtime ADD TABLE public.investments;

-- Enable realtime for deposits
ALTER PUBLICATION supabase_realtime ADD TABLE public.deposits;

-- Enable realtime for withdrawals
ALTER PUBLICATION supabase_realtime ADD TABLE public.withdrawals;

-- Enable realtime for live chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_chat_messages;

-- Enable realtime for support tickets
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_tickets;

-- Enable realtime for profiles
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
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

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to tables
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

-- =====================================================
-- ADMIN USER SETUP (Run this after creating the admin account)
-- =====================================================
-- To make a user admin, run this query with their email:
-- UPDATE public.profiles SET is_admin = TRUE WHERE email = 'admin@example.com';
