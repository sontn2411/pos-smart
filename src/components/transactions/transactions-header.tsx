import { Download, ShieldCheck } from 'lucide-react'
import type { DateFilterState } from '@/components/orders/orders-date-filter'
import OrdersDateFilter from '@/components/orders/orders-date-filter'

interface TransactionsHeaderProps {
  completedCount?: number
  dateFilter: DateFilterState
  onDateFilterChange: (val: DateFilterState) => void
  onExport: () => void
}

const TransactionsHeader = ({
  completedCount,
  dateFilter,
  onDateFilterChange,
  onExport,
}: TransactionsHeaderProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 shrink-0 py-0.5">
      {/* Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0f172a]">
            Transactions
          </h1>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
            <ShieldCheck size={13} className="text-emerald-600" />
            Settled Live
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#64748b] mt-0.5">
          Payment reconciliation, register audit, and digital receipts
          {typeof completedCount === 'number' && completedCount > 0 && (
            <span className="ml-2 font-medium text-stone-700">
              ({completedCount} settled)
            </span>
          )}
        </p>
      </div>

      {/* Date Selector & Action buttons */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Date Filter */}
        <OrdersDateFilter value={dateFilter} onChange={onDateFilterChange} />

        {/* Export Report Button */}
        <button
          type="button"
          onClick={onExport}
          className="flex items-center gap-1.5 rounded-xl bg-white border border-stone-200 px-3.5 py-2 text-xs sm:text-sm font-semibold text-stone-700 shadow-2xs hover:bg-stone-50 transition-colors cursor-pointer"
        >
          <Download size={15} className="text-stone-500" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  )
}

export default TransactionsHeader
