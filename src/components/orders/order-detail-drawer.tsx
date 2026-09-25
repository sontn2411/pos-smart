import type { Order, OrderStatus } from '@/types/order'
import {
  X,
  Printer,
  Receipt,
  User,
  Utensils,
  ShoppingBag,
  Bike,
  AlertCircle,
  CreditCard,
  Flame,
  CheckCircle2,
  Check,
  Ban,
} from 'lucide-react'
import { cn } from '#/utils/styles'

interface OrderDetailDrawerProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void
  onTogglePayment: (orderId: string) => void
  onCancelOrder: (orderId: string) => void
}

const steps: Array<{ id: OrderStatus; label: string }> = [
  { id: 'new', label: 'Received' },
  { id: 'in_prep', label: 'Cooking' },
  { id: 'ready', label: 'Ready' },
  { id: 'completed', label: 'Completed' },
]

const OrderDetailDrawer = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onTogglePayment,
  onCancelOrder,
}: OrderDetailDrawerProps) => {
  if (!isOpen || !order) return null

  const currentStepIdx = steps.findIndex((s) => s.id === order.status)

  const handlePrint = (type: 'kitchen' | 'receipt') => {
    window.alert(`[POS Print] Sending ${type} ticket for ${order.orderNumber} to printer...`)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] transition-opacity animate-in fade-in"
      />

      {/* Drawer Panel */}
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-2xl transition-transform duration-300 ease-out animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4 shrink-0 bg-stone-50/60">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-base font-extrabold text-stone-900">
                {order.orderNumber}
              </span>
              <span className="rounded-full bg-stone-200/80 px-2.5 py-0.5 text-xs font-bold text-stone-700">
                {order.tableName || order.customerName || order.orderType}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Date: <span className="font-semibold text-stone-700">{order.date}</span> • {order.createdAt} ({order.elapsedMinutes} mins ago)
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-xl text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {/* Status Stepper Timeline */}
          {order.status !== 'cancelled' ? (
            <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Order Progression
                </span>
                <span className="text-xs font-semibold text-primary capitalize">
                  Current: {order.status.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {steps.map((st, idx) => {
                  const isDone = currentStepIdx >= idx
                  const isCurrent = currentStepIdx === idx
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => onUpdateStatus(order.id, st.id)}
                      className={cn(
                        'flex flex-col items-center gap-1 rounded-xl p-2 text-center transition-all cursor-pointer',
                        isCurrent
                          ? 'bg-[#275344] text-white shadow-xs font-bold'
                          : isDone
                            ? 'bg-stone-200/80 text-stone-800 font-semibold hover:bg-stone-300/80'
                            : 'bg-white text-stone-400 border border-stone-200/60 hover:bg-stone-100',
                      )}
                    >
                      <span className="text-[10px] uppercase tracking-wider">0{idx + 1}</span>
                      <span className="text-xs">{st.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-rose-700 text-xs font-bold border border-rose-200">
              <AlertCircle size={16} />
              <span>This order has been cancelled and voided.</span>
            </div>
          )}

          {/* Metadata Row: Server, Type, Guests */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-stone-50 p-3 border border-stone-100">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                Server
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 truncate">
                <User size={13} className="text-stone-400 shrink-0" />
                <span className="truncate">{order.serverName}</span>
              </div>
            </div>

            <div className="rounded-xl bg-stone-50 p-3 border border-stone-100">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                Type
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 capitalize">
                {order.orderType === 'dine_in' && <Utensils size={13} className="text-stone-400" />}
                {order.orderType === 'takeaway' && <ShoppingBag size={13} className="text-stone-400" />}
                {order.orderType === 'delivery' && <Bike size={13} className="text-stone-400" />}
                <span>{order.orderType.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="rounded-xl bg-stone-50 p-3 border border-stone-100">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                Payment
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <span
                  className={cn(
                    'size-1.5 rounded-full shrink-0',
                    order.paymentStatus === 'paid' ? 'bg-emerald-500' : 'bg-rose-500',
                  )}
                />
                <span
                  className={
                    order.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-rose-700'
                  }
                >
                  {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                </span>
              </div>
            </div>
          </div>

          {/* Kitchen Note */}
          {order.kitchenNote && (
            <div className="rounded-xl bg-amber-50/80 border border-amber-200/80 p-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                <AlertCircle size={14} className="text-amber-600" />
                <span>Kitchen / Server Instructions</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                {order.kitchenNote}
              </p>
            </div>
          )}

          {/* Ordered Line Items (Card-based Ticket List - NO <table>) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-stone-900">
                Order Items ({order.items.reduce((s, it) => s + it.quantity, 0)})
              </h4>
              <span className="text-xs text-stone-500">Unit / Subtotal</span>
            </div>

            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl bg-stone-50 p-3 border border-stone-200/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-lg bg-stone-200/80 font-mono font-bold text-xs text-stone-800">
                        {item.quantity}x
                      </span>
                      <div>
                        <h5 className="text-xs font-bold text-stone-900">{item.name}</h5>
                        {item.modifiers && item.modifiers.length > 0 && (
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            {item.modifiers.join(' • ')}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-[11px] font-medium text-amber-700 mt-0.5">
                            Note: {item.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold font-mono text-stone-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono">
                        ${item.price.toFixed(2)} each
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Bill Breakdown */}
          <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200/80 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span className="font-mono font-semibold">${order.subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-stone-600">
              <span>Sales Tax (8%)</span>
              <span className="font-mono font-semibold">${order.tax.toFixed(2)}</span>
            </div>

            {order.discount !== undefined && order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount / Promo</span>
                <span className="font-mono">-${order.discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between items-baseline pt-2 border-t border-stone-200 text-sm font-bold text-stone-900">
              <span>Total Amount</span>
              <span className="font-mono text-lg text-stone-900 font-extrabold">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Quick Action Toolbar */}
        <div className="border-t border-stone-200 p-4 shrink-0 bg-stone-50/80 space-y-2.5">
          {/* Top Button Row: Print buttons & Toggle Payment */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handlePrint('kitchen')}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-white border border-stone-200 px-3 py-2 text-xs font-bold text-stone-700 shadow-2xs hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <Printer size={14} className="text-stone-500" />
              <span>Kitchen</span>
            </button>

            <button
              type="button"
              onClick={() => handlePrint('receipt')}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-white border border-stone-200 px-3 py-2 text-xs font-bold text-stone-700 shadow-2xs hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <Receipt size={14} className="text-stone-500" />
              <span>Receipt</span>
            </button>

            <button
              type="button"
              onClick={() => onTogglePayment(order.id)}
              className={cn(
                'flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors cursor-pointer shadow-2xs',
                order.paymentStatus === 'paid'
                  ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
              )}
            >
              <CreditCard size={14} />
              <span>{order.paymentStatus === 'paid' ? 'Mark Unpaid' : 'Mark Paid'}</span>
            </button>
          </div>

          {/* Bottom Primary Progression Button */}
          <div className="flex items-center gap-2">
            {order.status === 'new' && (
              <button
                type="button"
                onClick={() => onUpdateStatus(order.id, 'in_prep')}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white py-2.5 px-4 text-xs font-bold shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                <Flame size={15} />
                <span>Send Ticket to Kitchen</span>
              </button>
            )}

            {order.status === 'in_prep' && (
              <button
                type="button"
                onClick={() => onUpdateStatus(order.id, 'ready')}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white py-2.5 px-4 text-xs font-bold shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                <CheckCircle2 size={15} />
                <span>Mark Food Ready to Serve</span>
              </button>
            )}

            {order.status === 'ready' && (
              <button
                type="button"
                onClick={() => onUpdateStatus(order.id, 'completed')}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 text-xs font-bold shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                <Check size={15} />
                <span>Complete Order & Close</span>
              </button>
            )}

            {order.status !== 'cancelled' && order.status !== 'completed' && (
              <button
                type="button"
                onClick={() => onCancelOrder(order.id)}
                title="Cancel & Void order"
                className="flex items-center justify-center gap-1 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-500 hover:text-rose-600 px-3 py-2.5 text-xs font-bold transition-colors cursor-pointer"
              >
                <Ban size={14} />
                <span>Void</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

export default OrderDetailDrawer
