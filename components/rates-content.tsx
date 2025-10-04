"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, RefreshCw, Loader2 } from "lucide-react"
import { currencies } from "@/lib/currencies"

interface RateData {
  code: string
  name: string
  rate: number
  buy: string
  sell: string
  change: string
  trend: "up" | "down"
}

export function RatesContent() {
  const [rates, setRates] = useState<RateData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string>("")
  const [usingFallback, setUsingFallback] = useState(false)

  const fetchRates = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/rates?base=USD")
      const data = await response.json()

      if (!data.success && !data.rates) {
        throw new Error(data.error || "Failed to fetch rates")
      }

      setUsingFallback(data.source?.includes("fallback") || false)

      // Focus on major currencies and African currencies
      const priorityCurrencies = [
        "EUR",
        "GBP",
        "JPY",
        "CAD",
        "AUD",
        "CHF",
        "CNY",
        "ZAR",
        "NGN",
        "KES",
        "GHS",
        "EGP",
        "MAD",
        "UGX",
        "TZS",
      ]

      const ratesData: RateData[] = priorityCurrencies
        .filter((code) => data.rates?.[code])
        .map((code) => {
          const currency = currencies.find((c) => c.code === code)
          const rate = data.rates[code]
          const spread = 0.02 // 2% spread for buy/sell
          const buy = (rate * (1 - spread)).toFixed(4)
          const sell = (rate * (1 + spread)).toFixed(4)
          const change = (Math.random() * 2 - 0.5).toFixed(2) // Simulated change

          return {
            code,
            name: currency?.name || code,
            rate,
            buy,
            sell,
            change: `${change.startsWith("-") ? "" : "+"}${change}%`,
            trend: change.startsWith("-") ? "down" : "up",
          }
        })

      setRates(ratesData)
      setLastUpdate(new Date().toLocaleTimeString())
    } catch (err) {
      console.error("[v0] Error fetching rates:", err)
      setError(err instanceof Error ? err.message : "Failed to load rates")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRates()
    const interval = setInterval(fetchRates, 300000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Exchange Rates</h1>
          <p className="text-muted-foreground mt-1">
            Current buy and sell rates for all currencies {lastUpdate && `• Updated at ${lastUpdate}`}
            {usingFallback && <span className="text-amber-500 ml-2">(Using cached rates)</span>}
          </p>
        </div>
        <Button
          onClick={fetchRates}
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Refresh Rates
        </Button>
      </div>

      {error && (
        <Card className="bg-destructive/10 border-destructive/30">
          <CardContent className="p-6">
            <p className="text-destructive text-center">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && rates.length === 0 ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          rates.map((rate) => (
            <Card key={rate.code} className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-bold text-primary">{rate.code}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg text-foreground">{rate.code}</CardTitle>
                      <p className="text-sm text-muted-foreground">{rate.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {rate.trend === "up" ? (
                      <ArrowUpRight className="h-4 w-4 text-primary" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-destructive" />
                    )}
                    <span
                      className={
                        rate.trend === "up"
                          ? "text-primary text-sm font-medium"
                          : "text-destructive text-sm font-medium"
                      }
                    >
                      {rate.change}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <span className="text-sm text-muted-foreground">Buy Rate</span>
                  <span className="font-mono font-bold text-foreground">{rate.buy}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <span className="text-sm text-muted-foreground">Sell Rate</span>
                  <span className="font-mono font-bold text-foreground">{rate.sell}</span>
                </div>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full border-border text-foreground hover:bg-secondary bg-transparent"
                  >
                    Update Rate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
