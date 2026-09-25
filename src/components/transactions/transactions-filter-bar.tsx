import { Search, X, Layers, Banknote, CreditCard, QrCode, ArrowLeftRight } from 'lucide-react'
import type { PaymentMethod, TransactionStatus } from '@/types/transaction'
import { cn } from '#/utils/styles'

interface FilterBarProps {
  searchQuery: string
  onSearchChange: (q: string) => void
  selectedMethod: PaymentMethod | 'all'
  onMethodChange: (m: PaymentMethod | 'all') => void
  selectedStatus: TransactionStatus | 'all'
  onStatusChange: (s: TransactionStatus | 'all') => void
  onClearFilters: () => void
  hasActiveFilters: boolean
  methodCounts: Record<PaymentMethod | 'all', number>
  statusCounts: Record<TransactionStatus | 'all', number>
}

const TransactionsFilterBar = ({
  searchQuery,
  onSearchChange,
  selectedMethod,
  onMethodChange,
  selectedStatus,
  onStatusChange,
  onClearFilters,
  hasActiveFilters,
  methodCounts,
  statusCounts,
}: FilterBarProps) => {
  const methodTabs: Array<{ id: PaymentMethod | 'all'; label: string; icon: typeof Layers }> = [
    { id: 'all', label: 'All Methods', icon: Layers },
    { id: 'cash', label: 'Cash', icon: Banknote },
    { id: 'card', label: 'Credit Card', icon: CreditCard },
    { id: 'qr_wallet', label: 'QR / E-Wallet', icon: QrCode },
    { id: 'bank_transfer', label: 'Bank Transfer', icon: ArrowLeftRight },
  ]

  const statusPills: Array<{
    id: TransactionStatus | 'all'
    label: string
    color: string
    dot: string
  }> = [
    { id: 'all', label: 'All Statuses', color: 'bg-stone-900 text-white', dot: 'bg-white' },
    { id: 'completed', label: 'Settled', color: 'bg-emerald-600 text-white', dot: 'bg-emerald-400' },
    { id: 'pending', label: 'Pending', color: 'bg-sky-600 text-white', dot: 'bg-sky-400' },
    { id: 'refunded', label: 'Refunded', color: 'bg-amber-600 text-white', dot: 'bg-amber-400' },
    { id: 'failed', label: 'Failed', color: 'bg-rose-600 text-white', dot: 'bg-rose-400' },
  ]

  return (
    <div className="flex flex-col gap-2.5 shrink-0 rounded-2xl bg-white p-3 shadow-xs border border-stone-200/80">
      {/* Top Row: Search + Method Segmented Tabs + Reset */}
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
            placeholder="Search by TXN #, Order #, Table, Cashier..."
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

        {/* Payment Method Segmented Tabs */}
        <div className="flex items-center gap-1 rounded-xl bg-stone-100/80 p-1 border border-stone-200/60 overflow-x-auto custom-scrollbar">
          {methodTabs.map((tab) => {
            const isSelected = selectedMethod === tab.id
            const Icon = tab.icon
            const count = methodCounts[tab.id]
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onMethodChange(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
                  isSelected
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/50',
                )}
              >
                <Icon size={13} className={isSelected ? 'text-primary' : 'text-stone-400'} />
                <span>{tab.label}</span>
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.2 text-[10px]',
                    isSelected ? 'bg-stone-100 text-stone-700 font-bold' : 'text-stone-400',
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Clear Filters Button */}
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

      {/* Bottom Row: Status Pills */}
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
                className={cn('size-1.5 rounded-full shrink-0', isSelected ? 'bg-white' : pill.dot)}
              />
              <span>{pill.label}</span>
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.2 text-[10px] font-bold',
                  isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600',
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

export default TransactionsFilterBar
