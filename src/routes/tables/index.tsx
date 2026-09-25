import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import LayoutRoot from '#/components/layout/layout-root'
import type { SelectOption } from '@/components/common/select'
import Select from '@/components/common/select'
import FloorPlanCanvas from '#/components/tables/floor-plan-canvas'
import TableSidebar from '#/components/tables/table-sidebar'
import { TableCanvasProvider } from '@/contexts/table-canvas-context'

export const Route = createFileRoute('/tables/')({
  component: RouteComponent,
})

const FLOOR_OPTIONS: SelectOption[] = [
  { value: 'floor-1', label: 'Floor 1' },
  { value: 'floor-2', label: 'Floor 2' },
  { value: 'floor-3', label: 'Floor 3' },
  { value: 'outdoor', label: 'Outdoor' },
]

function RouteComponent() {
  const [selectedFloor, setSelectedFloor] = useState('floor-1')

  return (
    <LayoutRoot mainClassName="flex flex-col gap-3 overflow-hidden p-2 sm:p-4 md:py-3 md:px-6">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 shrink-0 py-0.5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0f172a]">
            Tables
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] mt-0.5">
            Manage your restaurant tables and current orders
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-28 sm:w-32">
            <Select
              options={FLOOR_OPTIONS}
              value={selectedFloor}
              onChange={setSelectedFloor}
              variant="default"
              size="md"
              className="w-full text-xs sm:text-sm"
            />
          </div>

          <Link
            to="/orders"
            className="flex items-center gap-1.5 rounded-lg bg-[#275344] hover:bg-[#1f4337] px-3.5 py-2 text-xs sm:text-sm font-medium text-white shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus size={16} />
            <span>New Order</span>
          </Link>
        </div>
      </div>

      {/* Main Floor Plan Area (Sidebar + Canvas) */}
      <TableCanvasProvider>
        <div className="relative flex flex-1 min-h-0 gap-2 sm:gap-4 overflow-hidden">
          <TableSidebar />
          <FloorPlanCanvas />
        </div>
      </TableCanvasProvider>
    </LayoutRoot>
  )
}
