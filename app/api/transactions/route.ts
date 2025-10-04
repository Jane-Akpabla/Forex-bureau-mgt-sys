import { NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

export const dynamic = 'force-dynamic'

type TransactionRow = {
  id: string
  date: string
  time?: string
  customer: string
  from_currency: string
  to_currency: string
  amount: number
  converted: number
  rate: number
  status: string
}

let FALLBACK_TXNS: TransactionRow[] = [
  { id: 'TXN001', date: '2025-03-10', time: '10:30 AM', customer: 'John Doe', from_currency: 'USD', to_currency: 'EUR', amount: 1000, converted: 920, rate: 0.92, status: 'completed' },
  { id: 'TXN002', date: '2025-03-10', time: '10:15 AM', customer: 'Jane Smith', from_currency: 'GBP', to_currency: 'USD', amount: 500, converted: 635, rate: 1.27, status: 'completed' },
]

export async function GET(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json({ success: true, items: FALLBACK_TXNS })
    }

    const { data, error } = await supabase.from('transactions').select('*').order('created_at', { ascending: false })
    if (error) {
      console.warn('[v0] Supabase GET transactions error, using fallback', error)
      return NextResponse.json({ success: true, items: FALLBACK_TXNS })
    }
    return NextResponse.json({ success: true, items: data })
  } catch (e) {
    console.error('[v0] GET /api/transactions failed, using fallback', e)
    return NextResponse.json({ success: true, items: FALLBACK_TXNS })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!supabase) {
      FALLBACK_TXNS.unshift(body as TransactionRow)
      return NextResponse.json({ success: true, item: body })
    }

    const { data, error } = await supabase.from('transactions').insert(body).select()
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, item: data?.[0] })
  } catch (e) {
    console.error('[v0] POST /api/transactions failed', e)
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id } = body
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 })
    if (!supabase) {
      FALLBACK_TXNS = FALLBACK_TXNS.map((t) => (t.id === id ? (body as TransactionRow) : t))
      return NextResponse.json({ success: true, item: body })
    }

    const { data, error } = await supabase.from('transactions').update(body).eq('id', id).select()
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, item: data?.[0] })
  } catch (e) {
    console.error('[v0] PUT /api/transactions failed', e)
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 })
    if (!supabase) {
      const removed = FALLBACK_TXNS.find((t) => t.id === id)
      FALLBACK_TXNS = FALLBACK_TXNS.filter((t) => t.id !== id)
      return NextResponse.json({ success: true, item: removed })
    }

    const { data, error } = await supabase.from('transactions').delete().eq('id', id).select()
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, item: data?.[0] })
  } catch (e) {
    console.error('[v0] DELETE /api/transactions failed', e)
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
