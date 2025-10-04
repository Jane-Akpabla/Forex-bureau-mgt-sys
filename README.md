# Forex Bureau Management System

A modern, dark-themed forex bureau management system with real-time exchange rates for African and international currencies.

## Features

- 💱 Real-time currency exchange calculator
- 📊 Live exchange rates dashboard
- 💰 Transaction management
- 📈 Currency inventory tracking
- 🌍 Support for 16+ African currencies
- 🎨 Beautiful dark theme with lime green accents

## Supported Currencies

### African Currencies
- NGN (Nigerian Naira)
- ZAR (South African Rand)
- KES (Kenyan Shilling)
- GHS (Ghanaian Cedi)
- UGX (Ugandan Shilling)
- TZS (Tanzanian Shilling)
- EGP (Egyptian Pound)
- MAD (Moroccan Dirham)
- XOF (West African CFA Franc)
- XAF (Central African CFA Franc)
- ETB (Ethiopian Birr)
- MUR (Mauritian Rupee)
- ZMW (Zambian Kwacha)
- BWP (Botswana Pula)

### Major International Currencies
- USD, EUR, GBP, JPY, CNY, INR, AUD, CAD, and more

## Setup

### 1. Get a Free API Key

To get live exchange rates, you need a free API key from ExchangeRate-API.com:

1. Visit [https://www.exchangerate-api.com/](https://www.exchangerate-api.com/)
2. Click "Get Free Key"
3. Sign up with your email (no credit card required)
4. Copy your API key

**Free Tier Includes:**
- 1,500 requests per month
- 161 currencies including all African currencies
- Real-time exchange rates
- No credit card required

### 2. Add API Key to Your Project

#### Option A: Using Vercel (Recommended)

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add a new variable:
   - **Name:** `EXCHANGERATE_API_KEY`
   - **Value:** Your API key from step 1
4. Redeploy your project

#### Option B: Local Development

1. Create a `.env.local` file in your project root
2. Add your API key:
   \`\`\`
   EXCHANGERATE_API_KEY=your_api_key_here
   \`\`\`
3. Restart your development server

### 3. Verify It's Working

1. Open the calculator page
2. You should see "Live rates" in the result card
3. If you see "Using cached rates", check your API key setup

## Fallback System

The system includes a robust fallback mechanism:

1. **Primary:** ExchangeRate-API.com with your API key (best coverage)
2. **Backup 1:** Frankfurter API (no key needed, limited currencies)
3. **Backup 2:** ExchangeRate-API.com free tier (no key needed)
4. **Fallback:** Cached rates (if all APIs fail)

This ensures the system always works, even without an API key or if APIs are down.

## Alternative Free APIs

If you prefer a different API, here are other free options:

### CurrencyAPI.com
- 300 requests/month free
- 170+ currencies
- Get key at: [https://currencyapi.com/](https://currencyapi.com/)

### ExchangeRatesAPI.io
- 100 requests/month free
- 200+ currencies
- Get key at: [https://exchangeratesapi.io/](https://exchangeratesapi.io/)

To use a different API, modify the `app/api/rates/route.ts` file.

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **API:** ExchangeRate-API.com
- **Icons:** Lucide React

## Development

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
\`\`\`

## License

MIT
