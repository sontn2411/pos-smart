import type { Transaction } from '@/types/transaction'
import {
  X,
  Printer,
  Receipt,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Banknote,
  QrCode,
  ArrowLeftRight,
  ShieldCheck,
} from 'lucide-react'

interface DrawerProps {
  transaction: Transaction | null
  isOpen: boolean
  onClose: () => void
  onIssueRefund: (txnId: string) => void
}

const TransactionDetailDrawer = ({
  transaction,
  isOpen,
  onClose,
  onIssueRefund,
}: DrawerProps) => {
  if (!isOpen || !transaction) return null

  const handlePrint = (slipType: 'customer' | 'merchant') => {
    window.alert(`[POS Receipt Print] Printing ${slipType} slip for ${transaction.code}...`)
  }

  const isRefunded = transaction.status === 'refunded'

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] transition-opacity animate-in fade-in"
      />

      {/* Drawer */}
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out animate-in slide-in-from-right">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4 shrink-0 bg-stone-50/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-extrabold text-stone-900">
                {transaction.code}
              </span>
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-xs font-bold capitalize">
                {transaction.status}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Settlement slip for {transaction.orderNumber}
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

        {/* Receipt Paper Simulation (Visual Receipt Slip) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-5">
          <div className="rounded-2xl border border-stone-200 bg-stone-50/60 p-5 shadow-xs font-mono text-xs text-stone-700 space-y-4">
            {/* Merchant Header */}
            <div className="text-center pb-3 border-b border-dashed border-stone-300">
              <h4 className="text-sm font-bold text-stone-900 font-sans uppercase tracking-wider">
                POS SMART RESTAURANT
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5 font-sans">
                124 Nguyen Hue Blvd, District 1, HCMC
              </p>
              <p className="text-[11px] text-stone-400 font-sans">Tax ID: 0318492042 • Tel: (028) 3822-9999</p>
            </div>

            {/* Audit Metadata */}
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-stone-500">Transaction:</span>
                <span className="font-bold text-stone-900">{transaction.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Order ID:</span>
                <span className="font-bold text-stone-900">{transaction.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Table / Guest:</span>
                <span className="font-bold text-stone-900">{transaction.tableOrCustomer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Date & Time:</span>
                <span>{transaction.date} {transaction.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Cashier:</span>
                <span>{transaction.cashier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Terminal:</span>
                <span>{transaction.terminal}</span>
              </div>
            </div>

            {/* Items Summary */}
            <div className="py-2.5 border-y border-dashed border-stone-300">
              <span className="text-[10px] uppercase text-stone-400 block mb-1">
                Purchased Items:
              </span>
              <p className="text-stone-800 font-sans text-xs leading-relaxed font-medium">
                {transaction.itemsSummary}
              </p>
            </div>

            {/* Payment Method Details */}
            <div className="space-y-1 text-[11px] pb-3 border-b border-dashed border-stone-300">
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Payment Method:</span>
                <span className="font-bold capitalize flex items-center gap-1">
                  {transaction.method === 'card' && <CreditCard size={12} />}
                  {transaction.method === 'cash' && <Banknote size={12} />}
                  {transaction.method === 'qr_wallet' && <QrCode size={12} />}
                  {transaction.method === 'bank_transfer' && <ArrowLeftRight size={12} />}
                  {transaction.method.replace('_', ' ')}
                </span>
              </div>
              {transaction.cardBrand && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Card Provider:</span>
                  <span className="uppercase">{transaction.cardBrand}</span>
                </div>
              )}
              {transaction.cardLast4 && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Card Number:</span>
                  <span>•••• •••• •••• {transaction.cardLast4}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-400">
                <span>Auth Code:</span>
                <span>AUTH_9841_OK</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Ref Number:</span>
                <span>REF_{transaction.id.toUpperCase()}</span>
              </div>
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span>${transaction.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Sales Tax (8%):</span>
                <span>${transaction.tax.toFixed(2)}</span>
              </div>
              {transaction.tip !== undefined && transaction.tip > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>Tip / Gratuity:</span>
                  <span>+${transaction.tip.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-300">
                <span>TOTAL SETTLED:</span>
                <span>${transaction.amount.toFixed(2)}</span>
              </div>
            </div>

            {/* Verification Stamp */}
            <div className="pt-2 text-center text-[10px] text-stone-400 space-y-0.5">
              <div className="flex items-center justify-center gap-1 text-emerald-700 font-bold">
                <ShieldCheck size={13} />
                <span>ELECTRONIC TRANSACTION VERIFIED</span>
              </div>
              <p>Thank you for dining with us!</p>
            </div>
          </div>

          {/* Refund Notice if already refunded */}
          {isRefunded && (
            <div className="rounded-xl bg-amber-50 p-3.5 border border-amber-200/80 text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle size={14} className="text-amber-600" />
                <span>Refund Processed (${transaction.refundAmount?.toFixed(2)})</span>
              </div>
              <p className="text-[11px] text-amber-800 font-medium">
                Reason: {transaction.refundReason || 'Customer refund requested and approved.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-stone-200 p-4 shrink-0 bg-stone-50/80 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handlePrint('customer')}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-white border border-stone-200 py-2.5 text-xs font-bold text-stone-700 shadow-2xs hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <Receipt size={14} className="text-stone-500" />
              <span>Customer Receipt</span>
            </button>

            <button
              type="button"
              onClick={() => handlePrint('merchant')}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-white border border-stone-200 py-2.5 text-xs font-bold text-stone-700 shadow-2xs hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <Printer size={14} className="text-stone-500" />
              <span>Merchant Copy</span>
            </button>
          </div>

          {!isRefunded ? (
            <button
              type="button"
              onClick={() => onIssueRefund(transaction.id)}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-stone-100 hover:bg-amber-50 text-stone-700 hover:text-amber-800 py-2.5 text-xs font-bold transition-colors cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Issue Partial / Full Refund</span>
            </button>
          ) : (
            <div className="flex items-center justify-center gap-1.5 rounded-xl bg-stone-100 py-2 text-xs font-bold text-stone-500">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>Refund Completed</span>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

export default TransactionDetailDrawer
