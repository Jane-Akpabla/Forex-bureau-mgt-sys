import { AppSidebar } from "@/components/app-sidebar"
import { RatesContent } from "@/components/rates-content"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function RatesPage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto">
          <RatesContent />
        </main>
      </div>
    </ProtectedRoute>
  )
}
