'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Filter } from "lucide-react"
import { SimpleAddTransaction } from "@/components/simple-add-transaction"

const initialTransactions = [
  {
    id: "TXN001",
    date: "2025-03-10",
    time: "10:30 AM",
    customer: "John Doe",
    from: "USD",
    to: "EUR",
    amount: "1,000.00",
    converted: "920.00",
    rate: "0.9200",
    status: "completed",
  },
  {
    id: "TXN002",
    date: "2025-03-10",
    time: "10:15 AM",
    customer: "Jane Smith",
    from: "GBP",
    to: "USD",
    amount: "500.00",
    converted: "635.00",
    rate: "1.2700",
    status: "completed",
  },
  {
    id: "TXN003",
    date: "2025-03-10",
    time: "09:45 AM",
    customer: "Mike Johnson",
    from: "EUR",
    to: "GBP",
    amount: "750.00",
    converted: "645.00",
    rate: "0.8600",
    status: "completed",
  },
  {
    id: "TXN004",
    date: "2025-03-10",
    time: "09:30 AM",
    customer: "Sarah Williams",
    from: "USD",
    to: "JPY",
    amount: "2,000.00",
    converted: "299,000.00",
    rate: "149.5000",
    status: "pending",
  },
  {
    id: "TXN005",
    date: "2025-03-10",
    time: "09:00 AM",
    customer: "David Brown",
    from: "CAD",
    to: "USD",
    amount: "1,200.00",
    converted: "888.00",
    rate: "0.7400",
    status: "completed",
  },
  {
    id: "TXN006",
    date: "2025-03-09",
    time: "04:30 PM",
    customer: "Emma Wilson",
    from: "USD",
    to: "EUR",
    amount: "3,500.00",
    converted: "3,220.00",
    rate: "0.9200",
    status: "completed",
  },
  {
    id: "TXN007",
    date: "2025-03-09",
    time: "03:15 PM",
    customer: "James Taylor",
    from: "GBP",
    to: "CAD",
    amount: "800.00",
    converted: "1,368.00",
    rate: "1.7100",
    status: "completed",
  },
  {
    id: "TXN008",
    date: "2025-03-09",
    time: "02:00 PM",
    customer: "Olivia Martinez",
    from: "EUR",
    to: "USD",
    amount: "1,500.00",
    converted: "1,630.00",
    rate: "1.0867",
    status: "cancelled",
  },
]

export function TransactionsContent() {
  const [transactions, setTransactions] = useState(initialTransactions)

  const handleTransactionAdded = (transaction: any) => {
    setTransactions([transaction, ...transactions])
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground mt-1">View and manage all currency exchanges</p>
        </div>
        <div className="flex gap-3">
          <SimpleAddTransaction onTransactionAdded={handleTransactionAdded} />
          <Button variant="outline" className="border-border text-foreground hover:bg-secondary bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="border-border text-foreground hover:bg-secondary bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search transactions..." className="pl-9 bg-secondary border-border text-foreground" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Transaction ID</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date & Time</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">From</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">To</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Converted</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Rate</th>
                  <th className="text-center p-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="p-4">
                      <span className="font-mono text-sm text-foreground">{txn.id}</span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-foreground">{txn.date}</div>
                      <div className="text-xs text-muted-foreground">{txn.time}</div>
                    </td>
                    <td className="p-4 text-sm text-foreground">{txn.customer}</td>
                    <td className="p-4">
                      <Badge variant="outline" className="border-border text-foreground">
                        {txn.from}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="border-border text-foreground">
                        {txn.to}
                      </Badge>
                    </td>
                    <td className="p-4 text-right font-mono text-sm text-foreground">{txn.amount}</td>
                    <td className="p-4 text-right font-mono text-sm text-foreground">{txn.converted}</td>
                    <td className="p-4 text-right font-mono text-sm text-muted-foreground">{txn.rate}</td>
                    <td className="p-4 text-center">
                      <Badge
                        variant={
                          txn.status === "completed"
                            ? "default"
                            : txn.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                        className={
                          txn.status === "completed"
                            ? "bg-primary/20 text-primary border-primary/30"
                            : txn.status === "pending"
                              ? "bg-secondary text-foreground"
                              : "bg-destructive/20 text-destructive border-destructive/30"
                        }
                      >
                        {txn.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
