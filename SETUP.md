# Soccer AI Coach — Setup Guide

## Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli eas-cli`
- Supabase CLI: `brew install supabase/tap/supabase`
- Apple Developer Account ($99/year) — for iOS
- Google Play Developer Account ($25 one-time) — for Android

---

## Step 1: Supabase Setup

### 1.1 Create Project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Name: `soccer-ai-coach`
3. Note your **Project URL** and **anon key** (Settings → API)

### 1.2 Run Database Migration
In Supabase dashboard → SQL Editor, run the contents of:
```
supabase/migrations/001_initial_schema.sql
```

### 1.3 Deploy Edge Functions
```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase secrets set REVENUECAT_WEBHOOK_SECRET=your-secret
supabase functions deploy ai-coach
supabase functions deploy generate-training-plan
supabase functions deploy revenuecat-webhook
supabase functions deploy send-notifications
supabase functions deploy coppa-consent-confirm
```

### 1.4 Set Up Cron Job (for daily notifications)
In Supabase dashboard → Database → Extensions → enable `pg_cron`

```sql
SELECT cron.schedule(
  'daily-push-notifications',
  '0 9 * * *',  -- 9 AM daily (UTC)
  $$
  SELECT net.http_post(
    url := current_setting('supabase.functions_url') || '/send-notifications',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('supabase.service_role_key') || '"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
```

---

## Step 2: Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Fill in:
```
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_...
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_...
```

---

## Step 3: RevenueCat Setup

1. Create account at [revenuecat.com](https://revenuecat.com)
2. Create a new project → `Soccer AI Coach`
3. **iOS Setup:**
   - App Store Connect → My Apps → `+` → Create app
   - Go to App Store Connect → Subscriptions → Create:
     - `soccer_monthly` — $12.99/month
     - `soccer_annual` — $99.99/year
   - Link your app to RevenueCat (API keys in Settings)
4. **Android Setup:**
   - Google Play Console → Create app
   - Monetize → Subscriptions → Create matching products
   - Link to RevenueCat
5. Create an **Entitlement** named `premium`
6. Create **Offerings** with monthly + annual packages
7. **Webhook:**
   - RevenueCat → Project Settings → Webhooks
   - URL: `https://your-project.supabase.co/functions/v1/revenuecat-webhook`
   - Header: `Authorization: Bearer your-webhook-secret`
8. Get your API keys → add to `.env`

---

## Step 4: Run the App

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android
```

---

## Step 5: Build for App Stores

### iOS (TestFlight)
```bash
eas build --platform ios --profile preview
```

### Android (Internal Track)
```bash
eas build --platform android --profile preview
```

### Configure EAS Build
Create `eas.json`:
```json
{
  "cli": { "version": ">= 7.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": { "simulator": false }
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

---

## Legal Checklist Before Launch

- [ ] Draft Privacy Policy (include COPPA section for under-13)
- [ ] Draft Terms of Service (include FTC Click-to-Cancel language)
- [ ] Host both at socceraicoach.app/privacy and /terms
- [ ] App Store rating: 4+ (if COPPA flow is complete) or 17+
- [ ] Health disclaimer on plan generation and nutrition screens ✅ (already in code)
- [ ] Nutrition disclaimer ✅ (already in code)
- [ ] COPPA consent flow ✅ (already in code)
- [ ] "Restore Purchases" button ✅ (already in paywall)
- [ ] Cancel subscription link ✅ (already in profile)
- [ ] PAR-Q health screening ✅ (already in onboarding)

---

## Costs Reference

| Service | Monthly Cost |
|---|---|
| Supabase Free | $0 (to 500MB DB, 50K MAU) |
| Supabase Pro | $25/month (when you outgrow free) |
| Claude API (Sonnet) | ~$50-150/month (scales with usage) |
| RevenueCat | Free until $2,500/mo tracked revenue |
| Expo EAS | Free (30 builds/month) |
| **Total MVP** | **~$50-175/month** |

---

## Architecture Overview

```
[React Native App]
       |
       ├── Supabase JS SDK ──► [Supabase]
       |                          ├── PostgreSQL (profiles, plans, sessions, chat)
       |                          ├── Auth (email/password)
       |                          └── Edge Functions
       |                                ├── ai-coach ──► [Claude API]
       |                                ├── generate-training-plan ──► [Claude API]
       |                                ├── revenuecat-webhook
       |                                ├── send-notifications ──► [Expo Push]
       |                                └── coppa-consent-confirm
       |
       ├── RevenueCat SDK ──► [RevenueCat]
       |                          ├── iOS In-App Purchase (APNs)
       |                          └── Android Billing
       |
       └── Expo Push SDK ──► [Expo Push Service]
                                  ├── APNs (Apple)
                                  └── FCM (Google)
```
