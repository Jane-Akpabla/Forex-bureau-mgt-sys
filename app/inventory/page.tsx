import { AppSidebar } from "@/components/app-sidebar"
import { InventoryContent } from "@/components/inventory-content"

export default function InventoryPage() {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <InventoryContent />
      </main>
    </div>
  )
}
