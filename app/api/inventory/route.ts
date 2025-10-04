import { NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

export const dynamic = 'force-dynamic'

type InventoryRow = {
  code: string
  name: string
  amount: number
  threshold: number
}

// Simple in-memory fallback if supabase isn't configured in dev
let FALLBACK: InventoryRow[] = [
  { code: 'USD', name: 'US Dollar', amount: 125430, threshold: 50000 },
  { code: 'EUR', name: 'Euro', amount: 89250, threshold: 40000 },
]

export async function GET(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json({ success: true, items: FALLBACK })
    }

    const { data, error } = await supabase.from('inventory').select('*')
    if (error) {
      console.warn('[v0] Supabase GET inventory error, using fallback', error)
      return NextResponse.json({ success: true, items: FALLBACK })
    }
    return NextResponse.json({ success: true, items: data })
  } catch (e) {
    console.error('[v0] GET /api/inventory failed, using fallback', e)
    return NextResponse.json({ success: true, items: FALLBACK })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!supabase) {
      FALLBACK.unshift(body as InventoryRow)
      return NextResponse.json({ success: true, item: body })
    }

    const { data, error } = await supabase.from('inventory').insert(body).select()
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, item: data?.[0] })
  } catch (e) {
    console.error('[v0] POST /api/inventory failed', e)
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { code } = body
    if (!code) return NextResponse.json({ success: false, error: 'Missing code' }, { status: 400 })
    if (!supabase) {
      FALLBACK = FALLBACK.map((i) => (i.code === code ? (body as InventoryRow) : i))
      return NextResponse.json({ success: true, item: body })
    }

    const { data, error } = await supabase.from('inventory').update(body).eq('code', code).select()
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, item: data?.[0] })
  } catch (e) {
    console.error('[v0] PUT /api/inventory failed', e)
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    if (!code) return NextResponse.json({ success: false, error: 'Missing code' }, { status: 400 })
    if (!supabase) {
      const removed = FALLBACK.find((i) => i.code === code)
      FALLBACK = FALLBACK.filter((i) => i.code !== code)
      return NextResponse.json({ success: true, item: removed })
    }

    const { data, error } = await supabase.from('inventory').delete().eq('code', code).select()
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, item: data?.[0] })
  } catch (e) {
    console.error('[v0] DELETE /api/inventory failed', e)
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
