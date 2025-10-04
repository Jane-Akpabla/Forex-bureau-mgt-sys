'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Plus } from 'lucide-react'
import { currencies } from '@/lib/currencies'

interface SimpleAddTransactionProps {
  onTransactionAdded: (transaction: any) => void
}

export function SimpleAddTransaction({ onTransactionAdded }: SimpleAddTransactionProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customerName: '',
    fromCurrency: '',
    toCurrency: '',
    amount: '',
  })
  const [exchangeRate, setExchangeRate] = useState<number | null>(null)
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Fetch exchange rate when both currencies are selected
    if (field === 'fromCurrency' || field === 'toCurrency') {
      const newData = { ...formData, [field]: value }
      if (newData.fromCurrency && newData.toCurrency && newData.fromCurrency !== newData.toCurrency) {
        fetchExchangeRate(newData.fromCurrency, newData.toCurrency)
      }
    }
    
    // Calculate converted amount when amount changes
    if (field === 'amount' && exchangeRate) {
      const amount = parseFloat(value)
      if (!isNaN(amount)) {
        setConvertedAmount(amount * exchangeRate)
      }
    }
  }

  const fetchExchangeRate = async (from: string, to: string) => {
    try {
      const response = await fetch(`/api/rates?base=${from}`)
      const data = await response.json()
      
      if (data.success && data.rates && data.rates[to]) {
        const rate = data.rates[to]
        setExchangeRate(rate)
        
        // Recalculate converted amount if amount is already entered
        if (formData.amount) {
          const amount = parseFloat(formData.amount)
          if (!isNaN(amount)) {
            setConvertedAmount(amount * rate)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching exchange rate:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.customerName || !formData.fromCurrency || !formData.toCurrency || !formData.amount) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    
    try {
      // Generate transaction ID
      const transactionId = `TXN${Date.now().toString().slice(-6)}`
      
      // Get current date and time
      const now = new Date()
      const date = now.toISOString().split('T')[0]
      const time = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })

      // Create transaction object
      const transaction = {
        id: transactionId,
        date,
        time,
        customer: formData.customerName,
        from: formData.fromCurrency,
        to: formData.toCurrency,
        amount: parseFloat(formData.amount).toFixed(2),
        converted: convertedAmount?.toFixed(2) || '0.00',
        rate: exchangeRate?.toFixed(4) || '0.0000',
        status: 'completed',
      }

      // Call the callback to add the transaction
      onTransactionAdded(transaction)

      // Reset form and close dialog
      setFormData({
        customerName: '',
        fromCurrency: '',
        toCurrency: '',
        amount: '',
      })
      setExchangeRate(null)
      setConvertedAmount(null)
      setOpen(false)
    } catch (error) {
      console.error('Error creating transaction:', error)
      alert('Error creating transaction. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Transaction
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
            <DialogDescription>
              Create a new currency exchange transaction.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                placeholder="Enter customer name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fromCurrency">From Currency *</Label>
                <Select value={formData.fromCurrency} onValueChange={(value) => handleInputChange('fromCurrency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="toCurrency">To Currency *</Label>
                <Select value={formData.toCurrency} onValueChange={(value) => handleInputChange('toCurrency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies
                      .filter(currency => currency.code !== formData.fromCurrency)
                      .map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                placeholder="Enter amount"
                required
              />
            </div>

            {/* Exchange Rate Display */}
            {formData.fromCurrency && formData.toCurrency && exchangeRate && (
              <Card className="bg-secondary/50">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Exchange Rate:</span>
                      <Badge variant="outline">
                        1 {formData.fromCurrency} = {exchangeRate.toFixed(4)} {formData.toCurrency}
                      </Badge>
                    </div>
                    
                    {convertedAmount && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Converted Amount:</span>
                        <span className="font-mono font-medium">
                          {convertedAmount.toFixed(2)} {formData.toCurrency}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !convertedAmount}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Transaction'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
