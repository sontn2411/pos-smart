import type { Order, OrderStatus } from '@/types/order'
import {
  Clock,
  Utensils,
  ShoppingBag,
  Bike,
  AlertCircle,
  Check,
  ChevronRight,
  Flame,
  CheckCircle2,
  DollarSign,
} from 'lucide-react'
import { cn } from '#/utils/styles'

interface OrderCardProps {
  order: Order
  isSelected?: boolean
  onSelect: (order: Order) => void
  onAdvanceStatus: (orderId: string, currentStatus: OrderStatus, e: React.MouseEvent) => void
}

const statusConfig: Record<
  OrderStatus,
  { label: string; badge: string; dot: string; icon: typeof Check }
> = {
  new: {
    label: 'New Order',
    badge: 'bg-sky-50 text-sky-700 border-sky-200/80',
    dot: 'bg-sky-500',
    icon: Clock,
  },
  in_prep: {
    label: 'In Kitchen',
    badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
    dot: 'bg-amber-500 animate-pulse',
    icon: Flame,
  },
  ready: {
    label: 'Ready to Serve',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dot: 'bg-emerald-500',
    icon: CheckCircle2,
  },
  completed: {
    label: 'Completed',
    badge: 'bg-stone-100 text-stone-600 border-stone-200',
    dot: 'bg-stone-400',
    icon: Check,
  },
  cancelled: {
    label: 'Cancelled',
    badge: 'bg-rose-50 text-rose-600 border-rose-200',
    dot: 'bg-rose-500',
    icon: AlertCircle,
  },
}

const orderTypeConfig = {
  dine_in: { label: 'Dine-In', icon: Utensils, badge: 'bg-stone-100 text-stone-700' },
  takeaway: { label: 'Takeaway', icon: ShoppingBag, badge: 'bg-orange-50 text-orange-700' },
  delivery: { label: 'Delivery', icon: Bike, badge: 'bg-purple-50 text-purple-700' },
}

const OrderCard = ({
  order,
  isSelected,
  onSelect,
  onAdvanceStatus,
}: OrderCardProps) => {
  const statusInfo = statusConfig[order.status]
  const typeInfo = orderTypeConfig[order.orderType]
  const TypeIcon = typeInfo.icon
  const isUrgent = order.status === 'in_prep' && order.elapsedMinutes > 15
  const totalItemCount = order.items.reduce((acc, it) => acc + it.quantity, 0)

  return (
    <article
      onClick={() => onSelect(order)}
      className={cn(
        'group relative flex flex-col justify-between rounded-2xl bg-white p-4 transition-all duration-200 cursor-pointer border select-none',
        isSelected
          ? 'ring-2 ring-primary border-primary/60 shadow-md'
          : 'border-stone-200/90 shadow-2xs hover:shadow-md hover:border-stone-300',
      )}
    >
      {/* Top Section: Header & Metadata */}
      <div>
        {/* Row 1: Destination (Table or Takeaway) + Order ID + Status Badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold shrink-0',
                order.orderType === 'dine_in'
                  ? 'bg-[#275344]/10 text-[#275344]'
                  : typeInfo.badge,
              )}
            >
              <TypeIcon size={13} />
              <span>{order.tableName || order.customerName || typeInfo.label}</span>
            </span>

            <span className="text-xs font-mono font-bold text-stone-500">
              {order.orderNumber}
            </span>
          </div>

          {/* Status Badge */}
          <span
            className={cn(
              'flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold border shrink-0',
              statusInfo.badge,
            )}
          >
            <span className={cn('size-1.5 rounded-full shrink-0', statusInfo.dot)} />
            <span>{statusInfo.label}</span>
          </span>
        </div>

        {/* Row 2: Timing, Server & Guest Count */}
        <div className="flex items-center justify-between text-[11px] text-stone-500 mb-3 pb-2.5 border-b border-stone-100">
          <div className="flex items-center gap-1.5">
            <Clock size={12} className={isUrgent ? 'text-rose-500' : 'text-stone-400'} />
            <span
              className={cn(
                'font-medium',
                isUrgent && 'font-bold text-rose-600 bg-rose-50 px-1 rounded',
              )}
            >
              {order.date === '2026-09-24'
                ? `${order.elapsedMinutes}m ago (${order.createdAt})`
                : `${order.date} • ${order.createdAt}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {order.guestCount && (
              <span className="text-stone-600 font-medium">
                {order.guestCount} {order.guestCount > 1 ? 'guests' : 'guest'}
              </span>
            )}
            <span className="text-stone-300">•</span>
            <span className="truncate max-w-[100px] text-stone-500">{order.serverName}</span>
          </div>
        </div>

        {/* Items List (Card Ticket Body) */}
        <div className="space-y-1.5 mb-3">
          {order.items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-start justify-between text-xs gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-stone-100 font-mono font-bold text-[11px] text-stone-800">
                    {item.quantity}x
                  </span>
                  <span className="font-semibold text-stone-800 truncate">{item.name}</span>
                </div>
                {item.modifiers && item.modifiers.length > 0 && (
                  <p className="text-[10px] text-stone-400 pl-6.5 truncate">
                    + {item.modifiers.join(', ')}
                  </p>
                )}
              </div>
              <span className="font-mono text-stone-600 text-xs shrink-0 font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          {order.items.length > 3 && (
            <p className="text-[11px] text-stone-400 font-medium pl-6.5 pt-0.5">
              +{order.items.length - 3} more items...
            </p>
          )}
        </div>

        {/* Kitchen Special Note Alert */}
        {order.kitchenNote && (
          <div className="flex items-start gap-1.5 rounded-xl bg-amber-50/80 border border-amber-200/70 p-2 text-[11px] text-amber-900 mb-3">
            <AlertCircle size={13} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="line-clamp-2 leading-relaxed font-medium">{order.kitchenNote}</p>
          </div>
        )}
      </div>

      {/* Card Footer: Total Amount, Payment Badge & Quick Actions */}
      <div className="pt-2.5 border-t border-stone-100 mt-1">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div>
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
              Total ({totalItemCount} items)
            </span>
            <span className="text-base font-extrabold font-mono text-stone-900">
              ${order.total.toFixed(2)}
            </span>
          </div>

          {/* Payment Status Pill */}
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-tight',
              order.paymentStatus === 'paid'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-50 text-rose-700 border border-rose-200/60',
            )}
          >
            {order.paymentStatus === 'paid' ? '● Paid' : '○ Unpaid'}
          </span>
        </div>

        {/* Action Button Row */}
        <div className="flex items-center gap-1.5">
          {order.status === 'new' && (
            <button
              type="button"
              onClick={(e) => onAdvanceStatus(order.id, 'new', e)}
              className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-sky-600 hover:bg-sky-700 text-white py-1.5 px-3 text-xs font-bold transition-all active:scale-98 shadow-xs cursor-pointer"
            >
              <Flame size={13} />
              <span>Send to Kitchen</span>
            </button>
          )}

          {order.status === 'in_prep' && (
            <button
              type="button"
              onClick={(e) => onAdvanceStatus(order.id, 'in_prep', e)}
              className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white py-1.5 px-3 text-xs font-bold transition-all active:scale-98 shadow-xs cursor-pointer"
            >
              <CheckCircle2 size={13} />
              <span>Mark Ready</span>
            </button>
          )}

          {order.status === 'ready' && (
            <button
              type="button"
              onClick={(e) => onAdvanceStatus(order.id, 'ready', e)}
              className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-3 text-xs font-bold transition-all active:scale-98 shadow-xs cursor-pointer"
            >
              <DollarSign size={13} />
              <span>Complete & Settle</span>
            </button>
          )}

          {order.status === 'completed' && (
            <div className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-stone-100 text-stone-600 py-1.5 px-3 text-xs font-bold">
              <Check size={13} className="text-emerald-600" />
              <span>Order Finished</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => onSelect(order)}
            title="View details"
            className="flex size-7 items-center justify-center rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer shrink-0"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </article>
  )
}

export default OrderCard
