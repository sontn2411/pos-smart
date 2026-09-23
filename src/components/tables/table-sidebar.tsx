import {
  table1,
  table2,
  table3,
  table4,
  table5,
  table6,
  table7,
  table8,
  table9,
  table10,
  table11,
  table12,
} from '@/assets'
import { useTableCanvasContext } from '@/contexts/table-canvas-context'
import { GripVertical, Plus, Info, PanelLeftClose } from 'lucide-react'
import { cn } from '#/utils/styles'

interface TableTemplate {
  type: string
  name: string
  image: string
  subtitle: string
  capacity: string
}

const TABLE_TEMPLATES: TableTemplate[] = [
  {
    type: 'table1',
    name: 'Table 1',
    image: table1,
    subtitle: 'Standard round table',
    capacity: '4 seats',
  },
  {
    type: 'table2',
    name: 'Table 2',
    image: table2,
    subtitle: 'Square dining table',
    capacity: '4 seats',
  },
  {
    type: 'table3',
    name: 'Table 3',
    image: table3,
    subtitle: 'Compact square table',
    capacity: '2 seats',
  },
  {
    type: 'table4',
    name: 'Table 4',
    image: table4,
    subtitle: 'Rectangle dining table',
    capacity: '6 seats',
  },
  {
    type: 'table5',
    name: 'Table 5',
    image: table5,
    subtitle: 'Round bistro table',
    capacity: '2 seats',
  },
  {
    type: 'table6',
    name: 'Table 6',
    image: table6,
    subtitle: 'Large banquet table',
    capacity: '8 seats',
  },
  {
    type: 'table7',
    name: 'Table 7',
    image: table7,
    subtitle: 'Long feast table',
    capacity: '8 seats',
  },
  {
    type: 'table8',
    name: 'Table 8',
    image: table8,
    subtitle: 'Family banquet table',
    capacity: '10 seats',
  },
  {
    type: 'table9',
    name: 'Table 9',
    image: table9,
    subtitle: 'Cafe bistro table',
    capacity: '2 seats',
  },
  {
    type: 'table10',
    name: 'Table 10',
    image: table10,
    subtitle: 'Booth dining table',
    capacity: '4 seats',
  },
  {
    type: 'table11',
    name: 'Table 11',
    image: table11,
    subtitle: 'Bar high-top table',
    capacity: '2 seats',
  },
  {
    type: 'table12',
    name: 'Table 12',
    image: table12,
    subtitle: 'VIP conference table',
    capacity: '12 seats',
  },
]

const TableSidebar = () => {
  const { handleTemplateDragStart, handleQuickAdd, isSidebarOpen, setIsSidebarOpen } =
    useTableCanvasContext()

  return (
    <aside
      className={cn(
        'flex flex-col overflow-hidden rounded-2xl bg-white shadow-xs border border-stone-200/80 transition-all duration-300 ease-in-out',
        isSidebarOpen
          ? 'w-72 shrink-0 p-4 opacity-100'
          : 'w-0 shrink-0 p-0 border-0 opacity-0 pointer-events-none -mr-4',
      )}
    >
      <div className="mb-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-stone-900 whitespace-nowrap">Table Templates</h2>
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-600 whitespace-nowrap">
              {TABLE_TEMPLATES.length} types
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            title="Collapse templates sidebar"
            className="flex size-7 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <PanelLeftClose size={16} />
          </button>
        </div>
        <p className="text-xs text-stone-500 mt-0.5 whitespace-nowrap">
          Drag onto floor plan or click '+' to add
        </p>
      </div>

      {/* Scrollable Templates List */}
      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto custom-scrollbar pr-1 min-h-0">
        {TABLE_TEMPLATES.map((tmpl) => (
          <div
            key={tmpl.type}
            draggable
            onDragStart={(e) => handleTemplateDragStart(e, tmpl.type)}
            className="group relative flex cursor-grab items-center gap-3 rounded-xl border border-stone-200 bg-stone-50/70 p-2.5 transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-xs active:cursor-grabbing"
          >
            <div className="flex size-13 shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-xs border border-stone-100">
              <img
                src={tmpl.image}
                alt={tmpl.name}
                className="size-11 object-contain pointer-events-none"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800">
                  {tmpl.name}
                </span>
                <GripVertical
                  size={14}
                  className="text-stone-400 group-hover:text-primary transition-colors"
                />
              </div>
              <p className="text-[11px] text-stone-500 truncate mt-0.5">
                {tmpl.subtitle}
              </p>
              <span className="inline-block text-[10px] font-medium text-primary">
                {tmpl.capacity}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleQuickAdd(tmpl.type)}
              title={`Add ${tmpl.name} to floor plan`}
              className="size-7 shrink-0 flex items-center justify-center rounded-lg bg-white border border-stone-200 text-stone-600 hover:bg-primary hover:text-white hover:border-primary transition-colors shadow-2xs cursor-pointer"
            >
              <Plus size={13} />
            </button>
          </div>
        ))}
      </div>

      {/* Tips / Instructions */}
      <div className="mt-3 shrink-0 rounded-xl bg-stone-50 p-2.5 border border-stone-200/60">
        <div className="flex items-start gap-2">
          <Info size={14} className="text-stone-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-stone-600 leading-relaxed">
            Drag templates onto the canvas, rotate 360° or resize to fit your floor plan.
          </p>
        </div>
      </div>
    </aside>
  )
}

export default TableSidebar
