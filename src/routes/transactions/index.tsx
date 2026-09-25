import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Receipt, RotateCcw } from 'lucide-react'
import LayoutRoot from '#/components/layout/layout-root'
import { MOCK_TRANSACTIONS } from '@/data/mock-transactions'
import type { Transaction, PaymentMethod, TransactionStatus } from '@/types/transaction'
import type { DateFilterState } from '@/components/orders/orders-date-filter'
import TransactionsHeader from '@/components/transactions/transactions-header'
import TransactionsSummaryCards from '@/components/transactions/transactions-summary-cards'
import TransactionsFilterBar from '@/components/transactions/transactions-filter-bar'
import TransactionCard from '@/components/transactions/transaction-card'
import TransactionDetailDrawer from '@/components/transactions/transaction-detail-drawer'

export const Route = createFileRoute('/transactions/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<TransactionStatus | 'all'>('all')
  const [selectedTxnId, setSelectedTxnId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [dateFilter, setDateFilter] = useState<DateFilterState>({
    preset: 'today',
    startDate: '2026-09-24',
    endDate: '2026-09-24',
  })

  // Filtered transactions list
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      // Method filter
      if (selectedMethod !== 'all' && txn.method !== selectedMethod) {
        return false
      }

      // Status filter
      if (selectedStatus !== 'all' && txn.status !== selectedStatus) {
        return false
      }

      // Date range filter
      if (dateFilter.preset !== 'all') {
        if (dateFilter.startDate && txn.date < dateFilter.startDate) {
          return false
        }
        if (dateFilter.endDate && txn.date > dateFilter.endDate) {
          return false
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchesCode = txn.code.toLowerCase().includes(q)
        const matchesOrder = txn.orderNumber.toLowerCase().includes(q)
        const matchesCust = txn.tableOrCustomer.toLowerCase().includes(q)
        const matchesCashier = txn.cashier.toLowerCase().includes(q)
        const matchesTerm = txn.terminal.toLowerCase().includes(q)
        return matchesCode || matchesOrder || matchesCust || matchesCashier || matchesTerm
      }

      return true
    })
  }, [transactions, selectedMethod, selectedStatus, dateFilter, searchQuery])

  // Aggregate KPI financial metrics based on filtered date/scope
  const metrics = useMemo(() => {
    let revenue = 0
    let cash = 0
    let card = 0
    let wallet = 0
    let refunds = 0

    for (const txn of filteredTransactions) {
      if (txn.status === 'completed') {
        revenue += txn.amount
        if (txn.method === 'cash') cash += txn.amount
        else if (txn.method === 'card') card += txn.amount
        else wallet += txn.amount
      } else if (txn.status === 'refunded') {
        refunds += txn.amount
      }
    }

    return {
      totalRevenue: revenue,
      cashAmount: cash,
      cardAmount: card,
      walletAmount: wallet,
      refundAmount: refunds,
      totalCount: filteredTransactions.length,
    }
  }, [filteredTransactions])

  // Method counts
  const methodCounts = useMemo(() => {
    const counts: Record<PaymentMethod | 'all', number> = {
      all: transactions.length,
      cash: 0,
      card: 0,
      qr_wallet: 0,
      bank_transfer: 0,
    }
    for (const t of transactions) {
      counts[t.method]++
    }
    return counts
  }, [transactions])

  // Status counts
  const statusCounts = useMemo(() => {
    const counts: Record<TransactionStatus | 'all', number> = {
      all: transactions.length,
      completed: 0,
      pending: 0,
      refunded: 0,
      failed: 0,
    }
    for (const t of transactions) {
      counts[t.status]++
    }
    return counts
  }, [transactions])

  // Active transaction object
  const activeTxn = useMemo(() => {
    return transactions.find((t) => t.id === selectedTxnId) ?? null
  }, [transactions, selectedTxnId])

  const handleSelectTxn = (txn: Transaction) => {
    setSelectedTxnId(txn.id)
    setIsDrawerOpen(true)
  }

  const handleIssueRefund = (txnId: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txnId
          ? {
              ...t,
              status: 'refunded',
              refundAmount: t.amount,
              refundReason: 'Customer refund approved by manager.',
            }
          : t,
      ),
    )
  }

  const handleExportCSV = () => {
    const rows = [
      ['Code', 'Order', 'Customer/Table', 'Method', 'Amount', 'Status', 'Date', 'Time', 'Cashier'],
      ...filteredTransactions.map((t) => [
        t.code,
        t.orderNumber,
        t.tableOrCustomer,
        t.method,
        t.amount.toString(),
        t.status,
        t.date,
        t.time,
        t.cashier,
      ]),
    ]
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `POS_Transactions_${dateFilter.preset}_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedMethod('all')
    setSelectedStatus('all')
    setDateFilter({ preset: 'all', startDate: '', endDate: '' })
  }

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedMethod !== 'all' ||
    selectedStatus !== 'all' ||
    dateFilter.preset !== 'all'

  return (
    <LayoutRoot mainClassName="flex flex-col gap-3 overflow-hidden p-2 sm:p-4 md:py-3 md:px-6">
      {/* 1. Page Header */}
      <TransactionsHeader
        completedCount={statusCounts.completed}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        onExport={handleExportCSV}
      />

      {/* 2. KPI Financial Summary Cards */}
      <TransactionsSummaryCards
        totalRevenue={metrics.totalRevenue}
        cashAmount={metrics.cashAmount}
        cardAmount={metrics.cardAmount}
        walletAmount={metrics.walletAmount}
        refundAmount={metrics.refundAmount}
        totalCount={metrics.totalCount}
      />

      {/* 3. Search & Payment Method Filter Bar */}
      <TransactionsFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedMethod={selectedMethod}
        onMethodChange={setSelectedMethod}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        methodCounts={methodCounts}
        statusCounts={statusCounts}
      />

      {/* 4. Transactions Ledger Grid (NO <table>) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 pr-1">
        {filteredTransactions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 pb-4">
            {filteredTransactions.map((txn) => (
              <TransactionCard
                key={txn.id}
                transaction={txn}
                isSelected={txn.id === selectedTxnId && isDrawerOpen}
                onSelect={handleSelectTxn}
              />
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-2xl bg-white p-8 text-center border border-stone-200/80 shadow-2xs">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-400 mb-3">
              <Receipt size={26} />
            </div>
            <h3 className="text-base font-bold text-stone-900">No transactions found</h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-sm mt-1 mb-4">
              {hasActiveFilters
                ? 'No payments match your active method, status or date filters.'
                : 'There are no recorded transactions for this period.'}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="flex items-center gap-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Reset all filters</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 5. Transaction Detail & Receipt Slide-Over Drawer */}
      <TransactionDetailDrawer
        transaction={activeTxn}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onIssueRefund={handleIssueRefund}
      />
    </LayoutRoot>
  )
}
