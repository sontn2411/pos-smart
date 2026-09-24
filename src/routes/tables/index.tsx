import Header from '#/components/layout/header'
import FloorPlanCanvas from '#/components/tables/floor-plan-canvas'
import TableSidebar from '#/components/tables/table-sidebar'
import { TableCanvasProvider } from '@/contexts/table-canvas-context'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tables/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#f5f3ef]">
      <div className="shrink-0">
        <Header />
      </div>

      <main className="flex-1 overflow-hidden p-2 sm:p-4 md:py-3 md:px-6">
        <TableCanvasProvider>
          <div className="relative flex h-full gap-2 sm:gap-4 overflow-hidden">
            <TableSidebar />
            <FloorPlanCanvas />
          </div>
        </TableCanvasProvider>
      </main>
    </div>
  )
}
