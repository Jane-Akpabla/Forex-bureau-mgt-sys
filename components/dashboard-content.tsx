import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, Wallet } from "lucide-react"

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Transactions Today",
    value: "127",
    change: "+12.5%",
    trend: "up",
    icon: ArrowUpRight,
  },
  {
    title: "Active Customers",
    value: "2,345",
    change: "+8.2%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Cash on Hand",
    value: "$125,430",
    change: "-3.1%",
    trend: "down",
    icon: Wallet,
  },
]

const recentTransactions = [
  { id: "TXN001", customer: "John Doe", from: "USD", to: "EUR", amount: "1,000", rate: "0.92", time: "10:30 AM" },
  { id: "TXN002", customer: "Jane Smith", from: "GBP", to: "USD", amount: "500", rate: "1.27", time: "10:15 AM" },
  { id: "TXN003", customer: "Mike Johnson", from: "EUR", to: "GBP", amount: "750", rate: "0.86", time: "09:45 AM" },
  {
    id: "TXN004",
    customer: "Sarah Williams",
    from: "USD",
    to: "JPY",
    amount: "2,000",
    rate: "149.50",
    time: "09:30 AM",
  },
  { id: "TXN005", customer: "David Brown", from: "CAD", to: "USD", amount: "1,200", rate: "0.74", time: "09:00 AM" },
]

export function DashboardContent() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your bureau overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-destructive" />
                )}
                <span className={stat.trend === "up" ? "text-primary text-sm" : "text-destructive text-sm"}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground text-sm">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((txn) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="space-y-1">
                    <div className="font-medium text-foreground">{txn.customer}</div>
                    <div className="text-sm text-muted-foreground">
                      {txn.from} → {txn.to} • {txn.amount}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-mono text-sm text-foreground">{txn.rate}</div>
                    <div className="text-xs text-muted-foreground">{txn.time}</div>
                  </div>
                </div>
              ))}
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
