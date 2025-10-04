'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Minus, AlertTriangle, Edit, Trash2, Loader2 } from 'lucide-react'
import { supabase, type Currency } from '@/lib/supabase'
import { toast } from 'sonner'

export function InventoryContent() {
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'adjust'>('add')
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    symbol: '',
    amount: ''
  })
  const [adjustAmount, setAdjustAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadCurrencies()
  }, [])

  const loadCurrencies = async () => {
    try {
      const { data, error } = await supabase
        .from('currencies')
        .select('*')
        .order('code', { ascending: true })

      if (error) throw error
      setCurrencies(data || [])
    } catch (error) {
      console.error('Error loading currencies:', error)
      toast.error('Failed to load currencies')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCurrency = () => {
    setDialogMode('add')
    setFormData({ code: '', name: '', symbol: '', amount: '0' })
    setDialogOpen(true)
  }

  const handleEditCurrency = (currency: Currency) => {
    setDialogMode('edit')
    setSelectedCurrency(currency)
    setFormData({
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
      amount: currency.amount.toString()
    })
    setDialogOpen(true)
  }

  const handleAdjustAmount = (currency: Currency, type: 'add' | 'remove') => {
    setDialogMode('adjust')
    setSelectedCurrency(currency)
    setAdjustAmount('')
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (dialogMode === 'add') {
        const { error } = await supabase
          .from('currencies')
          .insert({
            code: formData.code.toUpperCase(),
            name: formData.name,
            symbol: formData.symbol,
            amount: parseFloat(formData.amount) || 0
          })

        if (error) throw error
        toast.success('Currency added successfully')
      } else if (dialogMode === 'edit' && selectedCurrency) {
        const { error } = await supabase
          .from('currencies')
          .update({
            name: formData.name,
            symbol: formData.symbol,
            amount: parseFloat(formData.amount) || 0,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedCurrency.id)

        if (error) throw error
        toast.success('Currency updated successfully')
      } else if (dialogMode === 'adjust' && selectedCurrency) {
        const adjustValue = parseFloat(adjustAmount) || 0
        const newAmount = selectedCurrency.amount + adjustValue

        if (newAmount < 0) {
          toast.error('Amount cannot be negative')
          return
        }

        const { error } = await supabase
          .from('currencies')
          .update({
            amount: newAmount,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedCurrency.id)

        if (error) throw error
        toast.success('Amount adjusted successfully')
      }

      await loadCurrencies()
      setDialogOpen(false)
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.message || 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteCurrency = async (currency: Currency) => {
    if (!confirm(`Are you sure you want to delete ${currency.code}?`)) return

    try {
      const { error } = await supabase
        .from('currencies')
        .delete()
        .eq('id', currency.id)

      if (error) throw error
      toast.success('Currency deleted successfully')
      await loadCurrencies()
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.message || 'Failed to delete currency')
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Currency Inventory</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage cash on hand</p>
        </div>
        <Button onClick={handleAddCurrency} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Add Currency
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currencies.map((currency) => {
          const threshold = 50000
          const percentage = (currency.amount / threshold) * 100
          const isLow = percentage < 50

          return (
            <Card key={currency.id} className={`bg-card border-border ${isLow ? 'border-destructive/50' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${isLow ? 'bg-destructive/20' : 'bg-primary/20'}`}
                    >
                      <span className={`font-bold ${isLow ? 'text-destructive' : 'text-primary'}`}>{currency.code}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg text-foreground">{currency.code}</CardTitle>
                      <p className="text-sm text-muted-foreground">{currency.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isLow && <AlertTriangle className="h-5 w-5 text-destructive" />}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditCurrency(currency)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteCurrency(currency)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Cash on Hand</span>
                    <Badge
                      variant={isLow ? 'destructive' : 'default'}
                      className={
                        isLow
                          ? 'bg-destructive/20 text-destructive border-destructive/30'
                          : 'bg-primary/20 text-primary border-primary/30'
                      }
                    >
                      {isLow ? 'Low Stock' : 'Healthy'}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-foreground font-mono">
                    {currency.symbol}{currency.amount.toLocaleString()}
                  </div>
                  <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${isLow ? 'bg-destructive' : 'bg-primary'} transition-all`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Threshold: {threshold.toLocaleString()}</div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-border text-foreground hover:bg-secondary bg-transparent"
                    onClick={() => handleAdjustAmount(currency, 'add')}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-border text-foreground hover:bg-secondary bg-transparent"
                    onClick={() => handleAdjustAmount(currency, 'remove')}
                  >
                    <Minus className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'add' && 'Add New Currency'}
              {dialogMode === 'edit' && 'Edit Currency'}
              {dialogMode === 'adjust' && 'Adjust Amount'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'add' && 'Add a new currency to your inventory.'}
              {dialogMode === 'edit' && 'Update the currency details.'}
              {dialogMode === 'adjust' && 'Add or remove from the current amount. Use negative numbers to remove.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            {dialogMode !== 'adjust' ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="code">Currency Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="USD"
                    disabled={dialogMode === 'edit'}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name">Currency Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="US Dollar"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="symbol">Symbol *</Label>
                  <Input
                    id="symbol"
                    value={formData.symbol}
                    onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                    placeholder="$"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Initial Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0"
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="adjust">Adjustment Amount *</Label>
                  <Input
                    id="adjust"
                    type="number"
                    step="0.01"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    placeholder="Enter positive to add, negative to remove"
                    required
                  />
                  {selectedCurrency && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Current: {selectedCurrency.symbol}{selectedCurrency.amount.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            )}

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
