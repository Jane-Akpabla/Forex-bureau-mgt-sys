import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, AlertTriangle } from "lucide-react"

const inventory = [
  { code: "USD", name: "US Dollar", amount: "125,430", status: "healthy", threshold: 50000 },
  { code: "EUR", name: "Euro", amount: "89,250", status: "healthy", threshold: 40000 },
  { code: "GBP", name: "British Pound", amount: "45,680", status: "healthy", threshold: 30000 },
  { code: "JPY", name: "Japanese Yen", amount: "8,450,000", status: "healthy", threshold: 5000000 },
  { code: "CAD", name: "Canadian Dollar", amount: "28,900", status: "low", threshold: 30000 },
  { code: "AUD", name: "Australian Dollar", amount: "35,200", status: "healthy", threshold: 25000 },
  { code: "CHF", name: "Swiss Franc", amount: "18,750", status: "low", threshold: 20000 },
  { code: "CNY", name: "Chinese Yuan", amount: "156,800", status: "healthy", threshold: 100000 },
]

export function InventoryContent() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Currency Inventory</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage cash on hand</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Add Currency
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventory.map((item) => {
          const percentage = (Number.parseFloat(item.amount.replace(/,/g, "")) / item.threshold) * 100
          const isLow = item.status === "low"

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
                  <div className="text-2xl font-bold text-foreground font-mono">{item.amount}</div>
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
                    className="flex-1 border-border text-foreground hover:bg-secondary bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-border text-foreground hover:bg-secondary bg-transparent"
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
    </div>
  )
}
