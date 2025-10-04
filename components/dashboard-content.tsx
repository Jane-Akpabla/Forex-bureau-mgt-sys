"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, Wallet } from "lucide-react"
import { SimpleAddTransaction } from "@/components/simple-add-transaction"

// Placeholder stat metadata - values will be populated from server
const statMeta = [
  { title: 'Total Revenue', icon: DollarSign },
  { title: 'Transactions Today', icon: ArrowUpRight },
  { title: 'Active Customers', icon: Users },
  { title: 'Cash on Hand', icon: Wallet },
]

// Will be loaded from server

export function DashboardContent() {
  const [recentTransactions, setRecentTransactions] = useState<any[] | null>(null)

  const loadRecent = async () => {
    try {
      const res = await fetch('/api/transactions')
      const json = await res.json()
      if (json?.success && Array.isArray(json.items)) {
        setRecentTransactions(json.items.slice(0, 5))
      } else {
        setRecentTransactions([])
      }
    } catch (e) {
      console.error('[v0] failed to load recent txns', e)
      setRecentTransactions([])
    }
  }

  useEffect(() => {
    loadRecent()
  }, [])

  const [statsValues, setStatsValues] = useState<any | null>(null)

  const loadStats = async () => {
    try {
      const res = await fetch('/api/dashboard')
      const json = await res.json()
      if (json?.success) setStatsValues(json)
      else setStatsValues(null)
    } catch (e) {
      console.error('[v0] failed to load dashboard stats', e)
      setStatsValues(null)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your bureau overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statMeta.map((meta, idx) => {
          const val = statsValues
            ? idx === 0
              ? `$${Number(statsValues.totalRevenue || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
              : idx === 1
              ? statsValues.transactionsToday
              : idx === 2
              ? statsValues.activeCustomers
              : `$${Number(statsValues.cashOnHand || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
            : idx === 0
            ? '—'
            : '—'

          return (
            <Card key={meta.title} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{meta.title}</CardTitle>
                <meta.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{val}</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-muted-foreground text-sm">from records</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions === null ? (
                <div className="py-6 text-center text-muted-foreground">Loading...</div>
              ) : recentTransactions.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground">No recent transactions</div>
              ) : (
                recentTransactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">{txn.customer}</div>
                      <div className="text-sm text-muted-foreground">
                        {txn.from || txn.from_currency} → {txn.to || txn.to_currency} • {txn.amount}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-mono text-sm text-foreground">{txn.rate}</div>
                      <div className="text-xs text-muted-foreground">{txn.time}</div>
                    </div>
                  </div>
                ))
              )}

              {/* Add transaction button below recent transactions */}
              <div className="pt-4">
                <SimpleAddTransaction onTransactionAdded={async () => {
                  await loadRecent()
                }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Top Currencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { code: "USD", name: "US Dollar", volume: "$45,230", change: "+2.4%" },
                { code: "EUR", name: "Euro", volume: "$32,100", change: "+1.8%" },
                { code: "GBP", name: "British Pound", volume: "$28,450", change: "+3.2%" },
                { code: "JPY", name: "Japanese Yen", volume: "$19,800", change: "-0.5%" },
                { code: "CAD", name: "Canadian Dollar", volume: "$15,600", change: "+1.1%" },
              ].map((currency) => (
                <div
                  key={currency.code}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <span className="font-bold text-sm text-foreground">{currency.code}</span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{currency.code}</div>
                      <div className="text-sm text-muted-foreground">{currency.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-foreground">{currency.volume}</div>
                    <div
                      className={currency.change.startsWith("+") ? "text-primary text-sm" : "text-destructive text-sm"}
                    >
                      {currency.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
