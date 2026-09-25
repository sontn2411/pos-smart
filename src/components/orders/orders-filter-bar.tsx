import { Search, X, Utensils, ShoppingBag, Bike, Layers } from 'lucide-react'
import type { OrderStatus, OrderType } from '@/types/order'
import { cn } from '#/utils/styles'

interface OrdersFilterBarProps {
  searchQuery: string
  onSearchChange: (q: string) => void
  selectedType: OrderType | 'all'
  onTypeChange: (t: OrderType | 'all') => void
  selectedStatus: OrderStatus | 'all'
  onStatusChange: (s: OrderStatus | 'all') => void
  statusCounts: Record<OrderStatus | 'all', number>
  typeCounts: Record<OrderType | 'all', number>
  onClearFilters: () => void
  hasActiveFilters: boolean
}

const OrdersFilterBar = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  statusCounts,
  typeCounts,
  onClearFilters,
  hasActiveFilters,
}: OrdersFilterBarProps) => {
  const typeTabs: Array<{
    id: OrderType | 'all'
    label: string
    icon: typeof Layers
  }> = [
    { id: 'all', label: 'All Types', icon: Layers },
    { id: 'dine_in', label: 'Dine-in', icon: Utensils },
    { id: 'takeaway', label: 'Takeaway', icon: ShoppingBag },
    { id: 'delivery', label: 'Delivery', icon: Bike },
  ]

  const statusPills: Array<{
    id: OrderStatus | 'all'
    label: string
    color: string
    dotColor: string
  }> = [
    {
      id: 'all',
      label: 'All Orders',
      color: 'bg-stone-900 text-white',
      dotColor: 'bg-white',
    },
    {
      id: 'new',
      label: 'New',
      color: 'bg-sky-600 text-white',
      dotColor: 'bg-sky-400',
    },
    {
      id: 'in_prep',
      label: 'In Kitchen',
      color: 'bg-amber-600 text-white',
      dotColor: 'bg-amber-400',
    },
    {
      id: 'ready',
      label: 'Ready to Serve',
      color: 'bg-emerald-600 text-white',
      dotColor: 'bg-emerald-400',
    },
    {
      id: 'completed',
      label: 'Completed',
      color: 'bg-stone-600 text-white',
      dotColor: 'bg-stone-400',
    },
  ]

  return (
    <div className="flex flex-col gap-2.5 shrink-0 rounded-2xl bg-white p-3 shadow-xs border border-stone-200/80">
      {/* Top Row: Search Input + Type Tabs + Reset */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by order #, table name, customer..."
            className="w-full rounded-xl bg-stone-50 border border-stone-200/90 pl-9 pr-8 py-2 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/20 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Order Type Segmented Tabs */}
        <div className="flex items-center gap-1 rounded-xl bg-stone-100/80 p-1 border border-stone-200/60 overflow-x-auto custom-scrollbar">
          {typeTabs.map((tab) => {
            const isSelected = selectedType === tab.id
            const Icon = tab.icon
            const count = typeCounts[tab.id]
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTypeChange(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
                  isSelected
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/50',
                )}
              >
                <Icon
                  size={13}
                  className={isSelected ? 'text-primary' : 'text-stone-400'}
                />
                <span>{tab.label}</span>
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.2 text-[10px]',
                    isSelected
                      ? 'bg-stone-100 text-stone-700 font-bold'
                      : 'text-stone-400',
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <X size={13} />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Bottom Row: Status Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pt-1 border-t border-stone-100">
        <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider pr-1 shrink-0">
          Status:
        </span>
        {statusPills.map((pill) => {
          const isSelected = selectedStatus === pill.id
          const count = statusCounts[pill.id]
          return (
            <button
              key={pill.id}
              type="button"
              onClick={() => onStatusChange(pill.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 border',
                isSelected
                  ? cn(pill.color, 'border-transparent shadow-2xs')
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50',
              )}
            >
              <span
                className={cn(
                  'size-1.5 rounded-full shrink-0',
                  isSelected ? 'bg-white' : pill.dotColor,
                )}
              />
              <span>{pill.label}</span>
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.2 text-[10px] font-bold',
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-stone-100 text-stone-600',
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OrdersFilterBar
