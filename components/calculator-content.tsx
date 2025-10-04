"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, Minus, Plus, Loader2, Info } from "lucide-react"
import { currencies } from "@/lib/currencies"

interface ExchangeRates {
  base: string
  rates: Record<string, number>
  timestamp: string
  source?: string
  needsApiKey?: boolean
}

export function CalculatorContent() {
  const [amount, setAmount] = useState(100)
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("NGN")
  const [rates, setRates] = useState<ExchangeRates | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/rates?base=${fromCurrency}`)
        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch rates")
        }

        setRates(data)
      } catch (err) {
        console.error("[v0] Error fetching rates:", err)
        setError(err instanceof Error ? err.message : "Failed to load rates")
      } finally {
        setLoading(false)
      }
    }

    fetchRates()
    const interval = setInterval(fetchRates, 300000) // Refresh every 5 minutes

    return () => clearInterval(interval)
  }, [fromCurrency])

  const toRate = rates?.rates?.[toCurrency] ?? 1
  const convertedAmount = (amount * toRate).toFixed(2)
  const exchangeRate = toRate.toFixed(4)

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const getStatusMessage = () => {
    if (!rates?.source) return null

    if (rates.source === "exchangerate-api-v6") {
      return { text: "Live rates via ExchangeRate-API.com", color: "text-primary", showInfo: false }
    } else if (rates.source === "frankfurter") {
      return {
        text: "Live rates via Frankfurter API (limited currencies)",
        color: "text-primary",
        showInfo: rates.needsApiKey,
      }
    } else if (rates.source === "exchangerate-api-free") {
      return { text: "Live rates (free tier)", color: "text-primary", showInfo: rates.needsApiKey }
    } else if (rates.source.includes("fallback")) {
      return { text: "Using cached rates (API temporarily unavailable)", color: "text-amber-500", showInfo: true }
    }
    return null
  }

  const statusMessage = getStatusMessage()

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Calculator</h1>
        <p className="text-muted-foreground mt-1">Convert currencies with live exchange rates</p>
      </div>

      {rates?.needsApiKey && (
        <Card className="bg-primary/5 border-primary/20 mb-6">
          <CardContent className="p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Get more accurate rates with a free API key</p>
              <p className="text-muted-foreground mt-1">
                Currently using free APIs with limited currency support. Get a free API key from{" "}
                <a
                  href="https://www.exchangerate-api.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  ExchangeRate-API.com
                </a>{" "}
                (1,500 requests/month) and add it to your environment variables as{" "}
                <code className="bg-secondary px-1.5 py-0.5 rounded text-xs">EXCHANGERATE_API_KEY</code>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-card border-border">
        <CardContent className="p-8 space-y-6">
          <div>
            <label className="text-sm text-muted-foreground mb-3 block">Amount</label>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="flex-1 bg-background border-0 text-5xl font-bold text-foreground focus:outline-none focus:ring-0"
              />
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => setAmount(Math.max(0, amount - 10))}
                  className="h-12 w-12 bg-secondary hover:bg-secondary/80"
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => setAmount(amount + 10)}
                  className="h-12 w-12 bg-secondary hover:bg-secondary/80"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">From Currency</label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="h-14 bg-secondary border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border max-h-[300px]">
                  {currencies.map((currency) => (
                    <SelectItem
                      key={currency.code}
                      value={currency.code}
                      className="text-foreground hover:bg-secondary"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="font-bold text-xs text-primary">{currency.code}</span>
                        </div>
                        <div>
                          <div className="font-medium">{currency.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {currency.code} • {currency.region}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <Button
                size="icon"
                variant="secondary"
                onClick={handleSwap}
                className="h-12 w-12 rounded-full bg-secondary hover:bg-secondary/80"
              >
                <ArrowUpDown className="h-5 w-5" />
              </Button>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">To Currency</label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="h-14 bg-secondary border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border max-h-[300px]">
                  {currencies.map((currency) => (
                    <SelectItem
                      key={currency.code}
                      value={currency.code}
                      className="text-foreground hover:bg-secondary"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="font-bold text-xs text-primary">{currency.code}</span>
                        </div>
                        <div>
                          <div className="font-medium">{currency.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {currency.code} • {currency.region}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <Card className="bg-secondary border-border">
              <CardContent className="p-6 flex items-center justify-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-muted-foreground">Loading exchange rates...</span>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="bg-destructive/10 border-destructive/30">
              <CardContent className="p-6">
                <p className="text-destructive text-center">{error}</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-primary/10 border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-foreground">
                      {amount} {fromCurrency} = {convertedAmount} {toCurrency}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Exchange rate: 1 {fromCurrency} = {exchangeRate} {toCurrency}
                    </div>
                    {statusMessage && (
                      <div className={`text-xs ${statusMessage.color} mt-1 font-medium`}>{statusMessage.text}</div>
                    )}
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    Last updated at
                    <br />
                    {rates?.timestamp ? new Date(rates.timestamp).toLocaleTimeString() : "N/A"}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
            Process Exchange
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
