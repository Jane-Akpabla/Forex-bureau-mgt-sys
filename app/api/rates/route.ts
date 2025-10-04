import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const FALLBACK_RATES: Record<string, Record<string, number>> = {
  USD: {
    EUR: 0.92,
    GBP: 0.79,
    NGN: 1650.0,
    ZAR: 18.5,
    KES: 129.0,
    GHS: 15.8,
    UGX: 3700.0,
    TZS: 2500.0,
    EGP: 49.5,
    MAD: 10.2,
    XOF: 605.0,
    XAF: 605.0,
    ETB: 125.0,
    MUR: 46.5,
    ZMW: 27.5,
    BWP: 13.8,
    JPY: 149.5,
    CNY: 7.24,
    INR: 83.2,
    AUD: 1.52,
    CAD: 1.36,
  },
  EUR: {
    USD: 1.09,
    GBP: 0.86,
    NGN: 1793.0,
    ZAR: 20.1,
    KES: 140.0,
    GHS: 17.2,
    UGX: 4020.0,
    TZS: 2715.0,
    EGP: 53.8,
    MAD: 11.1,
    XOF: 656.0,
    XAF: 656.0,
    ETB: 136.0,
    MUR: 50.5,
    ZMW: 29.9,
    BWP: 15.0,
    JPY: 162.5,
    CNY: 7.87,
    INR: 90.4,
    AUD: 1.65,
    CAD: 1.48,
  },
}

function convertRates(rates: Record<string, number>, fromBase: string, toBase: string): Record<string, number> {
  if (fromBase === toBase) return rates

  const converted: Record<string, number> = {}
  const baseRate = rates[toBase]

  if (!baseRate) return rates

  for (const [currency, rate] of Object.entries(rates)) {
    converted[currency] = rate / baseRate
  }

  converted[fromBase] = 1 / baseRate
  converted[toBase] = 1

  return converted
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const base = searchParams.get("base") || "USD"

  try {
    let data: any = null
    let apiUsed = ""

    const apiKey = process.env.EXCHANGERATE_API_KEY || "2d34c41a20fed24cd45d3e45"
    if (apiKey && apiKey.length > 20) {
      try {
        const exchangeRateResponse = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`, {
          next: { revalidate: 300 },
        })

        if (exchangeRateResponse.ok) {
          const result = await exchangeRateResponse.json()
          if (result.result === "success") {
            data = {
              base: result.base_code,
              date: new Date(result.time_last_update_unix * 1000).toISOString().split("T")[0],
              rates: result.conversion_rates,
            }
            apiUsed = "exchangerate-api-v6"
          }
        } else {
          const errorData = await exchangeRateResponse.json()
          if (errorData["error-type"] === "invalid-key") {
            console.log("[v0] Invalid API key detected, using free APIs")
          }
        }
      } catch (e) {
        console.log("[v0] ExchangeRate-API.com with key failed, trying fallback")
      }
    }

    if (!data) {
      try {
        const frankfurterResponse = await fetch(`https://api.frankfurter.app/latest?from=${base}`, {
          next: { revalidate: 300 },
        })

        if (frankfurterResponse.ok) {
          data = await frankfurterResponse.json()
          apiUsed = "frankfurter"
          console.log("[v0] Using Frankfurter API")
        }
      } catch (e) {
        console.log("[v0] Frankfurter API failed, trying next fallback")
      }
    }

    if (!data) {
      try {
        const exchangeRateResponse = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`, {
          next: { revalidate: 300 },
        })

        if (exchangeRateResponse.ok) {
          data = await exchangeRateResponse.json()
          apiUsed = "exchangerate-api-free"
          console.log("[v0] Using ExchangeRate API free tier")
        }
      } catch (e) {
        console.log("[v0] All external APIs failed, using fallback data")
      }
    }

    if (!data) {
      console.log("[v0] All APIs failed, using fallback rates")
      const baseRates = FALLBACK_RATES[base] || FALLBACK_RATES.USD
      const convertedRates = base !== "USD" ? convertRates(FALLBACK_RATES.USD, "USD", base) : baseRates

      return NextResponse.json({
        success: true,
        base: base,
        date: new Date().toISOString().split("T")[0],
        rates: { ...convertedRates, [base]: 1 },
        timestamp: new Date().toISOString(),
        source: "fallback",
        needsApiKey: true,
      })
    }

    return NextResponse.json({
      success: true,
      base: data.base || base,
      date: data.date || new Date().toISOString().split("T")[0],
      rates: { ...data.rates, [base]: 1 },
      timestamp: new Date().toISOString(),
      source: apiUsed,
      needsApiKey: !apiKey || apiKey.length <= 20,
    })
  } catch (error) {
    console.error("[v0] Error fetching exchange rates:", error)

    const baseRates = FALLBACK_RATES[base] || FALLBACK_RATES.USD
    const convertedRates = base !== "USD" ? convertRates(FALLBACK_RATES.USD, "USD", base) : baseRates

    return NextResponse.json({
      success: true,
      base: base,
      date: new Date().toISOString().split("T")[0],
      rates: { ...convertedRates, [base]: 1 },
      timestamp: new Date().toISOString(),
      source: "fallback-error",
      needsApiKey: true,
    })
  }
}
