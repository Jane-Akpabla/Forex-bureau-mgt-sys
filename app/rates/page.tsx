import { AppSidebar } from "@/components/app-sidebar"
import { RatesContent } from "@/components/rates-content"

export default function RatesPage() {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <RatesContent />
      </main>
    </div>
  )
}
