export interface Currency {
  code: string
  name: string
  flag?: string
  region: string
}

export const currencies: Currency[] = [
  // Major Currencies
  { code: "USD", name: "US Dollar", region: "Americas" },
  { code: "EUR", name: "Euro", region: "Europe" },
  { code: "GBP", name: "British Pound", region: "Europe" },
  { code: "JPY", name: "Japanese Yen", region: "Asia" },
  { code: "CHF", name: "Swiss Franc", region: "Europe" },
  { code: "CAD", name: "Canadian Dollar", region: "Americas" },
  { code: "AUD", name: "Australian Dollar", region: "Oceania" },
  { code: "CNY", name: "Chinese Yuan", region: "Asia" },

  // African Currencies
  { code: "ZAR", name: "South African Rand", region: "Africa" },
  { code: "NGN", name: "Nigerian Naira", region: "Africa" },
  { code: "KES", name: "Kenyan Shilling", region: "Africa" },
  { code: "GHS", name: "Ghanaian Cedi", region: "Africa" },
  { code: "UGX", name: "Ugandan Shilling", region: "Africa" },
  { code: "TZS", name: "Tanzanian Shilling", region: "Africa" },
  { code: "EGP", name: "Egyptian Pound", region: "Africa" },
  { code: "MAD", name: "Moroccan Dirham", region: "Africa" },
  { code: "XOF", name: "West African CFA Franc", region: "Africa" },
  { code: "XAF", name: "Central African CFA Franc", region: "Africa" },
  { code: "ETB", name: "Ethiopian Birr", region: "Africa" },
  { code: "ZMW", name: "Zambian Kwacha", region: "Africa" },
  { code: "BWP", name: "Botswana Pula", region: "Africa" },
  { code: "MUR", name: "Mauritian Rupee", region: "Africa" },
  { code: "NAD", name: "Namibian Dollar", region: "Africa" },
  { code: "RWF", name: "Rwandan Franc", region: "Africa" },

  // Other Popular Currencies
  { code: "INR", name: "Indian Rupee", region: "Asia" },
  { code: "BRL", name: "Brazilian Real", region: "Americas" },
  { code: "MXN", name: "Mexican Peso", region: "Americas" },
  { code: "SGD", name: "Singapore Dollar", region: "Asia" },
  { code: "HKD", name: "Hong Kong Dollar", region: "Asia" },
  { code: "NZD", name: "New Zealand Dollar", region: "Oceania" },
  { code: "SEK", name: "Swedish Krona", region: "Europe" },
  { code: "NOK", name: "Norwegian Krone", region: "Europe" },
  { code: "DKK", name: "Danish Krone", region: "Europe" },
  { code: "PLN", name: "Polish Zloty", region: "Europe" },
  { code: "THB", name: "Thai Baht", region: "Asia" },
  { code: "MYR", name: "Malaysian Ringgit", region: "Asia" },
  { code: "IDR", name: "Indonesian Rupiah", region: "Asia" },
  { code: "PHP", name: "Philippine Peso", region: "Asia" },
  { code: "AED", name: "UAE Dirham", region: "Middle East" },
  { code: "SAR", name: "Saudi Riyal", region: "Middle East" },
]

export function getCurrencyByCode(code: string): Currency | undefined {
  return currencies.find((c) => c.code === code)
}

export function getCurrenciesByRegion(region: string): Currency[] {
  return currencies.filter((c) => c.region === region)
}
