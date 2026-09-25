import { Link } from '@tanstack/react-router'
import { Plus, Flame, CheckCircle2, Clock, CheckCheck } from 'lucide-react'
import type { DateFilterState } from './orders-date-filter'
import OrdersDateFilter from './orders-date-filter'

interface OrdersHeaderProps {
  totalOrders: number
  inPrepCount: number
  readyCount: number
  completedCount: number
  dateFilter: DateFilterState
  onDateFilterChange: (val: DateFilterState) => void
}

const OrdersHeader = ({
  totalOrders,
  inPrepCount,
  readyCount,
  completedCount,
  dateFilter,
  onDateFilterChange,
}: OrdersHeaderProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 shrink-0 py-0.5">
      {/* Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0f172a]">
            Orders
          </h1>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live POS
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#64748b] mt-0.5">
          Manage kitchen tickets, active dine-in tables, and checkout
        </p>
      </div>

      {/* Stats summary & New Order CTA */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Quick status counters */}
        <div className="hidden lg:flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 shadow-2xs border border-stone-200/80">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 px-1.5">
            <Clock size={14} className="text-stone-400" />
            <span>Active:</span>
            <span className="font-bold text-stone-900">{totalOrders}</span>
          </div>

          <div className="h-3.5 w-px bg-stone-200" />

          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 px-1.5">
            <Flame size={14} className="text-amber-500" />
            <span>Cooking:</span>
            <span className="font-bold">{inPrepCount}</span>
          </div>

          <div className="h-3.5 w-px bg-stone-200" />

          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 px-1.5">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span>Ready:</span>
            <span className="font-bold">{readyCount}</span>
          </div>

          <div className="h-3.5 w-px bg-stone-200" />

          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 px-1.5">
            <CheckCheck size={14} className="text-stone-400" />
            <span>Done:</span>
            <span className="font-bold text-stone-700">{completedCount}</span>
          </div>
        </div>

        {/* Date / Month / Range Filter */}
        <OrdersDateFilter value={dateFilter} onChange={onDateFilterChange} />

        {/* New Order Button */}
        <Link
          to="/"
          className="flex items-center gap-1.5 rounded-lg bg-[#275344] hover:bg-[#1f4337] px-3.5 py-2 text-xs sm:text-sm font-medium text-white shadow-xs transition-colors cursor-pointer whitespace-nowrap active:scale-98"
        >
          <Plus size={16} />
          <span>New Order</span>
        </Link>
      </div>
    </div>
  )
}

export default OrdersHeader
