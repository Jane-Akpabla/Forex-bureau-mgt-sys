import { AppSidebar } from "@/components/app-sidebar"
import { CalculatorContent } from "@/components/calculator-content"

export default function CalculatorPage() {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <CalculatorContent />
      </main>
    </div>
  )
}
