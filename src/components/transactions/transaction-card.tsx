import type { Transaction, PaymentMethod, TransactionStatus } from '@/types/transaction'
import {
  Banknote,
  CreditCard,
  QrCode,
  ArrowLeftRight,
  ChevronRight,
  Clock,
  User,
  Store,
  RotateCcw,
} from 'lucide-react'
import { cn } from '#/utils/styles'

interface TransactionCardProps {
  transaction: Transaction
  isSelected?: boolean
  onSelect: (txn: Transaction) => void
}

const methodConfig: Record<
  PaymentMethod,
  { label: string; icon: typeof CreditCard; color: string }
> = {
  cash: { label: 'Cash', icon: Banknote, color: 'bg-emerald-50 text-emerald-700 border-emerald-200/80' },
  card: { label: 'Card', icon: CreditCard, color: 'bg-sky-50 text-sky-700 border-sky-200/80' },
  qr_wallet: { label: 'QR / E-Wallet', icon: QrCode, color: 'bg-purple-50 text-purple-700 border-purple-200/80' },
  bank_transfer: { label: 'Bank Transfer', icon: ArrowLeftRight, color: 'bg-indigo-50 text-indigo-700 border-indigo-200/80' },
}

const statusConfig: Record<
  TransactionStatus,
  { label: string; badge: string; dot: string }
> = {
  completed: {
    label: 'Settled',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  pending: {
    label: 'Pending',
    badge: 'bg-sky-50 text-sky-700 border-sky-200',
    dot: 'bg-sky-500 animate-pulse',
  },
  refunded: {
    label: 'Refunded',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  failed: {
    label: 'Failed',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
  },
}

const TransactionCard = ({
  transaction,
  isSelected,
  onSelect,
}: TransactionCardProps) => {
  const method = methodConfig[transaction.method]
  const status = statusConfig[transaction.status]
  const MethodIcon = method.icon
  const isRefund = transaction.status === 'refunded'

  return (
    <article
      onClick={() => onSelect(transaction)}
      className={cn(
        'group relative flex flex-col justify-between rounded-2xl bg-white p-4 transition-all duration-200 cursor-pointer border select-none',
        isSelected
          ? 'ring-2 ring-primary border-primary/60 shadow-md'
          : 'border-stone-200/90 shadow-2xs hover:shadow-md hover:border-stone-300',
      )}
    >
      <div>
        {/* Top Row: Method Badge + TXN Code + Status Badge */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold border',
                method.color,
              )}
            >
              <MethodIcon size={13} />
              <span>
                {transaction.cardBrand
                  ? `${transaction.cardBrand.toUpperCase()} ${transaction.cardLast4 ? `•••• ${transaction.cardLast4}` : ''}`
                  : method.label}
              </span>
            </span>

            <span className="text-xs font-mono font-bold text-stone-500">
              {transaction.code}
            </span>
          </div>

          <span
            className={cn(
              'flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold border shrink-0',
              status.badge,
            )}
          >
            <span className={cn('size-1.5 rounded-full shrink-0', status.dot)} />
            <span>{status.label}</span>
          </span>
        </div>

        {/* Destination & Order Title */}
        <div className="flex items-baseline justify-between gap-2 mb-1.5">
          <h3 className="text-sm font-bold text-stone-900 truncate">
            {transaction.tableOrCustomer}
          </h3>
          <span className="text-xs font-mono font-semibold text-primary shrink-0">
            {transaction.orderNumber}
          </span>
        </div>

        {/* Items Summary line */}
        <p className="text-xs text-stone-500 line-clamp-1 mb-3 font-medium">
          {transaction.itemsSummary}
        </p>

        {/* Cashier & Terminal Details */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-500 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-1.5 truncate">
            <User size={12} className="text-stone-400 shrink-0" />
            <span className="truncate">{transaction.cashier}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate text-right justify-end">
            <Store size={12} className="text-stone-400 shrink-0" />
            <span className="truncate">{transaction.terminal}</span>
          </div>
        </div>
      </div>

      {/* Footer: Date & Time + Amount + View Button */}
      <div className="pt-2.5 flex items-center justify-between gap-2 mt-1">
        <div className="flex items-center gap-1 text-[11px] text-stone-400 font-medium">
          <Clock size={12} />
          <span>
            {transaction.date} • {transaction.time}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span
              className={cn(
                'text-base font-extrabold font-mono tracking-tight',
                isRefund ? 'text-amber-600' : 'text-stone-900',
              )}
            >
              {isRefund ? `-$${transaction.amount.toFixed(2)}` : `+$${transaction.amount.toFixed(2)}`}
            </span>
          </div>

          <div className="flex size-7 items-center justify-center rounded-xl bg-stone-100 group-hover:bg-stone-200 text-stone-600 transition-colors">
            {isRefund ? <RotateCcw size={13} className="text-amber-600" /> : <ChevronRight size={14} />}
          </div>
        </div>
      </div>
    </article>
  )
}

export default TransactionCard
