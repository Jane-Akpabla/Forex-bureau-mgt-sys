import { AppSidebar } from "@/components/app-sidebar"
import { CalculatorContent } from "@/components/calculator-content"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function CalculatorPage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto">
          <CalculatorContent />
        </main>
      </div>
    </ProtectedRoute>
  )
}
