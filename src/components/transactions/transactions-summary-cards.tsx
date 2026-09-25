import { DollarSign, Banknote, CreditCard, QrCode, RotateCcw } from 'lucide-react'

interface SummaryCardsProps {
  totalRevenue: number
  cashAmount: number
  cardAmount: number
  walletAmount: number
  refundAmount: number
  totalCount: number
}

const TransactionsSummaryCards = ({
  totalRevenue,
  cashAmount,
  cardAmount,
  walletAmount,
  refundAmount,
  totalCount,
}: SummaryCardsProps) => {
  const safeTotal = totalRevenue > 0 ? totalRevenue : 1
  const cashShare = Math.round((cashAmount / safeTotal) * 100)
  const cardShare = Math.round((cardAmount / safeTotal) * 100)
  const walletShare = Math.round((walletAmount / safeTotal) * 100)

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 shrink-0">
      {/* 1. Total Net Revenue */}
      <div className="col-span-2 lg:col-span-1 rounded-2xl bg-[#275344] text-white p-4 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between gap-1 mb-2">
          <span className="text-xs font-semibold text-white/80">Net Settled</span>
          <span className="flex size-7 items-center justify-center rounded-lg bg-white/15 text-white">
            <DollarSign size={16} />
          </span>
        </div>
        <div>
          <div className="text-2xl font-extrabold font-mono tracking-tight">
            ${totalRevenue.toFixed(2)}
          </div>
          <span className="text-[11px] text-white/70 block mt-0.5">
            {totalCount} total transactions
          </span>
        </div>
      </div>

      {/* 2. Cash Payments */}
      <div className="rounded-2xl bg-white p-3.5 shadow-2xs border border-stone-200/80 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className="text-xs font-semibold text-stone-500">Cash Register</span>
          <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Banknote size={15} />
          </span>
        </div>
        <div>
          <div className="text-lg font-bold font-mono text-stone-900">
            ${cashAmount.toFixed(2)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-400 mt-0.5">
            <span>In drawer</span>
            <span className="font-semibold text-emerald-600">{cashShare}% share</span>
          </div>
        </div>
      </div>

      {/* 3. Card Payments */}
      <div className="rounded-2xl bg-white p-3.5 shadow-2xs border border-stone-200/80 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className="text-xs font-semibold text-stone-500">Card Terminals</span>
          <span className="flex size-7 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
            <CreditCard size={15} />
          </span>
        </div>
        <div>
          <div className="text-lg font-bold font-mono text-stone-900">
            ${cardAmount.toFixed(2)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-400 mt-0.5">
            <span>Visa/Mastercard</span>
            <span className="font-semibold text-sky-600">{cardShare}% share</span>
          </div>
        </div>
      </div>

      {/* 4. Digital Wallets / QR */}
      <div className="rounded-2xl bg-white p-3.5 shadow-2xs border border-stone-200/80 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className="text-xs font-semibold text-stone-500">QR / E-Wallet</span>
          <span className="flex size-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <QrCode size={15} />
          </span>
        </div>
        <div>
          <div className="text-lg font-bold font-mono text-stone-900">
            ${walletAmount.toFixed(2)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-400 mt-0.5">
            <span>Apple Pay/MoMo</span>
            <span className="font-semibold text-purple-600">{walletShare}% share</span>
          </div>
        </div>
      </div>

      {/* 5. Refunds & Voids */}
      <div className="rounded-2xl bg-white p-3.5 shadow-2xs border border-stone-200/80 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className="text-xs font-semibold text-stone-500">Refunds / Voids</span>
          <span className="flex size-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
            <RotateCcw size={14} />
          </span>
        </div>
        <div>
          <div className="text-lg font-bold font-mono text-stone-900">
            ${refundAmount.toFixed(2)}
          </div>
          <span className="text-[11px] text-rose-500 block mt-0.5 font-medium">
            {refundAmount > 0 ? 'Adjustments recorded' : 'Zero refunds'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default TransactionsSummaryCards
