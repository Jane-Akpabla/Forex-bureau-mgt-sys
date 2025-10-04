"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, AlertTriangle, Edit, Trash } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface InventoryItem {
  code: string
  name: string
  amount: number
  threshold: number
}

const INVENTORY_KEY = "forex_inventory_v1"

const INITIAL_INVENTORY: InventoryItem[] = [
  { code: "USD", name: "US Dollar", amount: 125430, threshold: 50000 },
  { code: "EUR", name: "Euro", amount: 89250, threshold: 40000 },
  { code: "GBP", name: "British Pound", amount: 45680, threshold: 30000 },
  { code: "JPY", name: "Japanese Yen", amount: 8450000, threshold: 5000000 },
  { code: "CAD", name: "Canadian Dollar", amount: 28900, threshold: 30000 },
  { code: "AUD", name: "Australian Dollar", amount: 35200, threshold: 25000 },
  { code: "CHF", name: "Swiss Franc", amount: 18750, threshold: 20000 },
  { code: "CNY", name: "Chinese Yuan", amount: 156800, threshold: 100000 },
]

function formatAmount(n: number) {
  return n.toLocaleString()
}

export function InventoryContent() {
  const [inventory, setInventory] = React.useState<InventoryItem[]>([])
  const [loading, setLoading] = React.useState(true)

  const loadInventory = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/inventory')
      const json = await res.json()
      if (json?.success && Array.isArray(json.items)) {
        setInventory(json.items)
      } else {
        // fallback to initial
        setInventory(INITIAL_INVENTORY)
      }
    } catch (e) {
      console.error('[v0] Failed to load inventory from API', e)
      setInventory(INITIAL_INVENTORY)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    loadInventory()
  }, [])

  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<InventoryItem | null>(null)
  const [form, setForm] = React.useState({ code: "", name: "", amount: "", threshold: "" })

  const openAdd = () => {
    setEditing(null)
    setForm({ code: "", name: "", amount: "", threshold: "" })
    setOpen(true)
  }

  const openEdit = (item: InventoryItem) => {
    setEditing(item)
    setForm({ code: item.code, name: item.name, amount: String(item.amount), threshold: String(item.threshold) })
    setOpen(true)
  }

  const handleDelete = async (code: string) => {
    if (!confirm(`Delete ${code} from inventory?`)) return
    try {
      const res = await fetch(`/api/inventory?code=${encodeURIComponent(code)}`, { method: 'DELETE' })
      const json = await res.json()
      if (json?.success) {
        await loadInventory()
      } else {
        alert('Failed to delete item: ' + (json?.error || 'unknown'))
      }
    } catch (e) {
      console.error('[v0] delete failed', e)
      alert('Failed to delete item')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = form.code.trim().toUpperCase()
    const name = form.name.trim()
    const amount = Number(form.amount) || 0
    const threshold = Number(form.threshold) || 0

    if (!code || !name) {
      alert("Please provide a currency code and name")
      return
    }

    const newItem: InventoryItem = { code, name, amount, threshold }

    try {
      if (editing) {
        const res = await fetch('/api/inventory', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newItem) })
        const json = await res.json()
        if (json?.success) {
          await loadInventory()
        } else {
          alert('Failed to update: ' + (json?.error || 'unknown'))
        }
      } else {
        const res = await fetch('/api/inventory', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newItem) })
        const json = await res.json()
        if (json?.success) {
          await loadInventory()
        } else {
          alert('Failed to create: ' + (json?.error || 'unknown'))
        }
      }
      setOpen(false)
    } catch (e) {
      console.error('[v0] submit failed', e)
      alert('Failed to submit')
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Currency Inventory</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage cash on hand</p>
        </div>
        <Button onClick={openAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Add Currency
        </Button>
      </div>

      {loading ? (
        <div className="col-span-full text-center text-muted-foreground py-12">Loading inventory...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventory.map((item) => {
          const percentage = (item.amount / item.threshold) * 100
          const isLow = item.amount < item.threshold

          return (
            <Card key={item.code} className={`bg-card border-border ${isLow ? "border-destructive/50" : ""}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${isLow ? "bg-destructive/20" : "bg-primary/20"}`}
                    >
                      <span className={`font-bold ${isLow ? "text-destructive" : "text-primary"}`}>{item.code}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg text-foreground">{item.code}</CardTitle>
                      <p className="text-sm text-muted-foreground">{item.name}</p>
                    </div>
                  </div>
                  {isLow && <AlertTriangle className="h-5 w-5 text-destructive" />}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Cash on Hand</span>
                    <Badge
                      variant={isLow ? "destructive" : "default"}
                      className={
                        isLow
                          ? "bg-destructive/20 text-destructive border-destructive/30"
                          : "bg-primary/20 text-primary border-primary/30"
                      }
                    >
                      {isLow ? "Low Stock" : "Healthy"}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-foreground font-mono">{formatAmount(item.amount)}</div>
                  <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${isLow ? "bg-destructive" : "bg-primary"} transition-all`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Threshold: {item.threshold.toLocaleString()}</div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => openEdit(item)}
                    className="flex-1 border-border text-foreground hover:bg-secondary bg-transparent"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDelete(item.code)}
                    className="flex-1 border-border text-foreground hover:bg-secondary bg-transparent"
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${editing.code}` : "Add Currency"}</DialogTitle>
            <DialogDescription>{editing ? "Update currency details" : "Create a new currency entry"}</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="code">Currency Code *</Label>
              <Input
                id="code"
                value={form.code}
                onChange={(e) => setForm((s) => ({ ...s, code: e.target.value }))}
                placeholder="USD"
                required
                disabled={!!editing}
              />
            </div>

            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                placeholder="US Dollar"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="1"
                  value={form.amount}
                  onChange={(e) => setForm((s) => ({ ...s, amount: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="threshold">Threshold *</Label>
                <Input
                  id="threshold"
                  type="number"
                  step="1"
                  value={form.threshold}
                  onChange={(e) => setForm((s) => ({ ...s, threshold: e.target.value }))}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editing ? "Save" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
