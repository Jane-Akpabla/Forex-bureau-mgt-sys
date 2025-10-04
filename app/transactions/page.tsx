import { AppSidebar } from "@/components/app-sidebar"
import { TransactionsContent } from "@/components/transactions-content"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function TransactionsPage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto">
          <TransactionsContent />
        </main>
      </div>
    </ProtectedRoute>
  )
}
