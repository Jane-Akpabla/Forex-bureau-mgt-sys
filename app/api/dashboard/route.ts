import { NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

export const dynamic = 'force-dynamic'

async function fetchRates(base = 'USD', originUrl?: string) {
  try {
    // Build an absolute URL for server-side fetch
    const url = originUrl ? new URL(`/api/rates?base=${base}`, originUrl).toString() : `/api/rates?base=${base}`
    const res = await fetch(url)
    const json = await res.json()
    if (json?.success && json.rates) return json.rates
  } catch (e) {
    console.warn('[v0] failed to fetch rates for dashboard', e)
  }
  return null
}

export async function GET(request: Request) {
  try {
    // Transactions
    let transactions: any[] = []
    if (supabase) {
      const { data, error } = await supabase.from('transactions').select('*')
      if (!error && Array.isArray(data)) transactions = data
    }

    // Inventory
    let inventory: any[] = []
    if (supabase) {
      const { data, error } = await supabase.from('inventory').select('*')
      if (!error && Array.isArray(data)) inventory = data
    }

    // Compute stats
    const today = new Date().toISOString().split('T')[0]
    const transactionsToday = transactions.filter((t) => t.date === today).length
    const activeCustomers = new Set(transactions.map((t) => t.customer)).size

    // Total revenue: prefer summed 'converted' (assumed USD), fall back to 'amount' if converted missing
    const totalRevenue = transactions.reduce((sum, t) => {
      const conv = Number(t.converted ?? NaN)
      if (!Number.isNaN(conv) && conv > 0) return sum + conv
      const amt = Number(t.amount ?? 0)
      return sum + (Number.isNaN(amt) ? 0 : amt)
    }, 0)

    // Cash on hand: attempt to convert inventory amounts to USD using rates
  const origin = new URL(request.url).origin
  const rates = await fetchRates('USD', origin)
    let cashOnHand = 0
    if (rates && inventory.length > 0) {
      for (const item of inventory) {
        const code = item.code
        const amount = Number(item.amount || 0)
        const rate = rates[code] ?? 1
        // If rates[code] is the amount of code per USD, we need to convert to USD
        // Assuming rates are in USD base: rates[code] = 1 USD = x CODE, so USD value = amount / rates[code]
        const usdValue = rate ? amount / rate : amount
        cashOnHand += usdValue
      }
    }
    else {
      // If we couldn't fetch rates, assume inventory amounts are already in USD and sum them
      cashOnHand = inventory.reduce((s, i) => s + Number(i.amount || 0), 0)
    }

    return NextResponse.json({
      success: true,
      totalRevenue,
      transactionsToday,
      activeCustomers,
      cashOnHand,
    })
  } catch (e) {
    console.error('[v0] dashboard aggregation failed', e)
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
