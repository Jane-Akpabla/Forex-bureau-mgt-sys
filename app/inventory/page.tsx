import { AppSidebar } from "@/components/app-sidebar"
import { InventoryContent } from "@/components/inventory-content"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function InventoryPage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto">
          <InventoryContent />
        </main>
      </div>
    </ProtectedRoute>
  )
}
