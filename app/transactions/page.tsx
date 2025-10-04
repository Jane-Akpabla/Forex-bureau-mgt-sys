import { AppSidebar } from "@/components/app-sidebar"
import { TransactionsContent } from "@/components/transactions-content"

export default function TransactionsPage() {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <TransactionsContent />
      </main>
    </div>
  )
}
