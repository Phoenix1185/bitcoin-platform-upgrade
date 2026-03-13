# BitWealth - Bitcoin Investment Platform

<p align="center">
  <img src="public/favicon.svg" alt="BitWealth Logo" width="100" />
</p>

<p align="center">
  <strong>Your trusted partner in cryptocurrency investment</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#admin-panel">Admin Panel</a> •
  <a href="#api-integration">API Integration</a>
</p>

---

## 🚀 Features

### For Users
- **🔐 Secure Authentication** - Email/password and Google OAuth login
- **💰 Multi-Currency Support** - 15+ currencies including USD, EUR, GBP, BTC, ETH
- **📊 Live Crypto Prices** - Real-time cryptocurrency prices with charts
- **💵 Investment Plans** - 5 tiered plans with daily returns (5% - 20%)
- **💳 Easy Deposits** - Multiple cryptocurrency deposit options
- **🏧 Fast Withdrawals** - Quick withdrawal processing with low fees
- **📈 Portfolio Tracking** - Track investments, earnings, and returns
- **🎫 Support Tickets** - Create and manage support requests
- **💬 Live Chat** - 24/7 AI-powered chat support
- **🔔 Notifications** - Email and in-app notifications for all activities
- **📱 Responsive Design** - Works on desktop, tablet, and mobile

### For Admins
- **📊 Dashboard Analytics** - Real-time statistics and user insights
- **✅ Transaction Management** - Approve/reject deposits, withdrawals, investments
- **👥 User Management** - Freeze/unfreeze accounts, manage funds
- **📝 Content Management** - Blog posts, FAQ, guides
- **⚙️ Site Settings** - Edit stats, plans, social links, deposit addresses
- **🚫 Withdrawal Controls** - Global and per-user withdrawal freeze
- **🎫 Support Management** - Handle support tickets and live chat
- **📧 Email Templates** - Customizable notification templates

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui |
| **State Management** | React Context API |
| **Backend** | Supabase (PostgreSQL, Auth, Realtime) |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Notifications** | Sonner |
| **Crypto Prices** | CoinGecko API |

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for backend)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/bitwealth.git
cd bitwealth
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open in browser**
Navigate to `http://localhost:5173`

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variables in project settings
- Deploy!

3. **Environment Variables in Vercel**
```
VITE_SUPABASE_URL = your_supabase_project_url
VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
```

### Build for Production
```bash
npm run build
```

The build output will be in the `dist/` directory.

---

## 🔐 Admin Panel

### Access
- **Email:** `fredokcee1@gmail.com`
- **Password:** (set during first login)

### Admin Features

#### Quick Actions
- Edit Site Statistics ($50M+ Invested, etc.)
- Edit Investment Plans
- Edit Social Media Links
- Edit Deposit Addresses
- Global Withdrawal Freeze

#### Tabs
1. **Deposits** - Approve/reject pending deposits
2. **Withdrawals** - Approve/reject pending withdrawals
3. **Investments** - Approve/reject pending investments
4. **Users** - Manage users, freeze accounts, add/remove funds
5. **Blog** - Create, edit, delete blog posts

---

## 🔌 API Integration

### Supabase Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Enable Authentication**
   - Go to Authentication → Providers
   - Enable Email provider
   - Enable Google OAuth (optional)

3. **Create Database Tables**

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  balance DECIMAL(15,2) DEFAULT 0,
  total_invested DECIMAL(15,2) DEFAULT 0,
  total_returns DECIMAL(15,2) DEFAULT 0,
  is_admin BOOLEAN DEFAULT false,
  is_frozen BOOLEAN DEFAULT false,
  withdrawal_frozen BOOLEAN DEFAULT false,
  kyc_verified BOOLEAN DEFAULT false,
  preferred_currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Investment plans table
CREATE TABLE investment_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  min_amount DECIMAL(15,2) NOT NULL,
  max_amount DECIMAL(15,2) NOT NULL,
  daily_return DECIMAL(5,2) NOT NULL,
  duration INTEGER NOT NULL,
  featured BOOLEAN DEFAULT false
);

-- Investments table
CREATE TABLE investments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  plan_id UUID REFERENCES investment_plans(id),
  amount DECIMAL(15,2) NOT NULL,
  daily_return DECIMAL(5,2) NOT NULL,
  duration INTEGER NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  status TEXT DEFAULT 'active',
  total_earned DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  type TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  method TEXT,
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Site settings table
CREATE TABLE site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  site_name TEXT DEFAULT 'BitWealth',
  contact_email TEXT,
  contact_phone TEXT,
  contact_address TEXT,
  stats JSONB DEFAULT '{}',
  deposit_addresses JSONB DEFAULT '{}',
  global_withdrawal_frozen BOOLEAN DEFAULT false,
  maintenance_mode BOOLEAN DEFAULT false
);

-- Support tickets table
CREATE TABLE support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT,
  tags TEXT[],
  status TEXT DEFAULT 'draft',
  featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📁 Project Structure

```
bitwealth/
├── public/                 # Static assets
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/         # Reusable components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── LivePrices.tsx
│   │   ├── LiveChat.tsx
│   │   └── CurrencySelector.tsx
│   ├── lib/               # Utilities & services
│   │   ├── supabase.ts
│   │   ├── cryptoPrices.ts
│   │   ├── investmentCalculator.ts
│   │   ├── supportService.ts
│   │   └── security.ts
│   ├── pages/             # Page components
│   │   ├── HomePage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── AdminPage.tsx
│   │   ├── SupportPage.tsx
│   │   └── ...
│   ├── sections/          # Page sections
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   └── ...
│   ├── store/             # State management
│   │   └── index.tsx
│   ├── types/             # TypeScript types
│   │   ├── index.ts
│   │   └── support.ts
│   ├── App.tsx
│   └── main.tsx
├── .env                   # Environment variables
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🎨 Customization

### Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  'crypto-dark': '#0a0a0f',
  'crypto-card': '#12121a',
  'crypto-border': '#2a2a3a',
  'crypto-yellow': '#fbbf24',
  'crypto-yellow-light': '#fcd34d',
  'crypto-yellow-dark': '#f59e0b',
}
```

### Investment Plans
Edit in Admin Panel or update the database directly.

### Email Templates
Edit in `src/lib/supportService.ts`:
```typescript
export const emailTemplates = {
  accountFrozen: (userName: string) => ({
    subject: '...',
    body: '...',
  }),
  // ...
};
```

---

## 🔒 Security Features

- ✅ Rate limiting for API requests
- ✅ Input sanitization (XSS protection)
- ✅ Password strength validation
- ✅ CSRF token protection
- ✅ Session expiration handling
- ✅ Suspicious activity detection
- ✅ Content Security Policy headers

---

## 📧 Email Notifications

The platform sends notifications for:
- Account frozen/unfrozen
- Deposit confirmed
- Withdrawal approved/declined
- Investment started/completed
- Support ticket replies
- Security alerts

---

## 🌐 SEO

- Sitemap.xml for search engines
- Robots.txt for crawler control
- Meta tags for social sharing
- Semantic HTML structure

---

## 📝 License

This project is licensed under the MIT License.

---

## 🤝 Support

- 📧 Email: support@bitwealth.com
- 💬 Live Chat: Available 24/7 on the website
- 🎫 Tickets: Create a ticket from your dashboard

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Supabase](https://supabase.com/) for backend services
- [CoinGecko](https://www.coingecko.com/) for crypto price data
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

<p align="center">
  Made with ❤️ by BitWealth Team
</p>
