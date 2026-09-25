import { useState, useMemo } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ShoppingBag, RotateCcw, Plus } from 'lucide-react'
import LayoutRoot from '#/components/layout/layout-root'
import { MOCK_ORDERS } from '@/data/mock-orders'
import type { Order, OrderStatus, OrderType } from '@/types/order'
import type { DateFilterState } from '@/components/orders/orders-date-filter'
import OrdersHeader from '@/components/orders/orders-header'
import OrdersFilterBar from '@/components/orders/orders-filter-bar'
import OrderCard from '@/components/orders/order-card'
import OrderDetailDrawer from '@/components/orders/order-detail-drawer'

export const Route = createFileRoute('/orders/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<OrderType | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [dateFilter, setDateFilter] = useState<DateFilterState>({
    preset: 'today',
    startDate: '2026-09-24',
    endDate: '2026-09-24',
  })

  // Status counts for filter pills
  const statusCounts = useMemo(() => {
    const counts: Record<OrderStatus | 'all', number> = {
      all: orders.length,
      new: 0,
      in_prep: 0,
      ready: 0,
      completed: 0,
      cancelled: 0,
    }
    for (const ord of orders) {
      counts[ord.status]++
    }
    return counts
  }, [orders])

  // Order type counts
  const typeCounts = useMemo(() => {
    const counts: Record<OrderType | 'all', number> = {
      all: orders.length,
      dine_in: 0,
      takeaway: 0,
      delivery: 0,
    }
    for (const ord of orders) {
      counts[ord.orderType]++
    }
    return counts
  }, [orders])

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // Filter by type
      if (selectedType !== 'all' && ord.orderType !== selectedType) {
        return false
      }

      // Filter by status
      if (selectedStatus !== 'all' && ord.status !== selectedStatus) {
        return false
      }

      // Filter by date range / period
      if (dateFilter.preset !== 'all') {
        if (dateFilter.startDate && ord.date < dateFilter.startDate) {
          return false
        }
        if (dateFilter.endDate && ord.date > dateFilter.endDate) {
          return false
        }
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchesNumber = ord.orderNumber.toLowerCase().includes(q)
        const matchesTable = ord.tableName?.toLowerCase().includes(q)
        const matchesCustomer = ord.customerName?.toLowerCase().includes(q)
        const matchesPhone = ord.customerPhone?.toLowerCase().includes(q)
        const matchesItem = ord.items.some((it) => it.name.toLowerCase().includes(q))
        return matchesNumber || matchesTable || matchesCustomer || matchesPhone || matchesItem
      }

      return true
    })
  }, [orders, selectedType, selectedStatus, searchQuery, dateFilter])

  // Selected order object
  const activeOrder = useMemo(() => {
    return orders.find((o) => o.id === selectedOrderId) ?? null
  }, [orders, selectedOrderId])

  // Select order to inspect detail
  const handleSelectOrder = (order: Order) => {
    setSelectedOrderId(order.id)
    setIsDrawerOpen(true)
  }

  // Quick advance order status from card action button
  const handleAdvanceStatus = (
    orderId: string,
    currentStatus: OrderStatus,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation()
    let nextStatus: OrderStatus = currentStatus
    if (currentStatus === 'new') nextStatus = 'in_prep'
    else if (currentStatus === 'in_prep') nextStatus = 'ready'
    else if (currentStatus === 'ready') nextStatus = 'completed'

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o)),
    )
  }

  // Update specific status from drawer
  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    )
  }

  // Toggle paid / unpaid status
  const handleTogglePayment = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              paymentStatus: o.paymentStatus === 'paid' ? 'unpaid' : 'paid',
            }
          : o,
      ),
    )
  }

  // Cancel order
  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' } : o)),
    )
  }

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedType('all')
    setSelectedStatus('all')
    setDateFilter({ preset: 'all', startDate: '', endDate: '' })
  }

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedType !== 'all' ||
    selectedStatus !== 'all' ||
    dateFilter.preset !== 'all'

  return (
    <LayoutRoot mainClassName="flex flex-col gap-3 overflow-hidden p-2 sm:p-4 md:py-3 md:px-6">
      {/* 1. Header: Live Metrics & Date Selector & New Order Action */}
      <OrdersHeader
        totalOrders={orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length}
        inPrepCount={statusCounts.in_prep}
        readyCount={statusCounts.ready}
        completedCount={statusCounts.completed}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
      />

      {/* 2. Controls & Search Filter Bar */}
      <OrdersFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        statusCounts={statusCounts}
        typeCounts={typeCounts}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* 3. Orders Grid View (Touch POS Ticket Cards - NO <table>) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 pr-1">
        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4 pb-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isSelected={order.id === selectedOrderId && isDrawerOpen}
                onSelect={handleSelectOrder}
                onAdvanceStatus={handleAdvanceStatus}
              />
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl bg-white p-8 text-center border border-stone-200/80 shadow-2xs">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-400 mb-3">
              <ShoppingBag size={26} />
            </div>
            <h3 className="text-base font-bold text-stone-900">No orders found</h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-sm mt-1 mb-4">
              {hasActiveFilters
                ? 'No tickets match your active search and filter conditions.'
                : 'There are currently no active orders in the system.'}
            </p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={handleClearFilters}
                className="flex items-center gap-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Reset all filters</span>
              </button>
            ) : (
              <Link
                to="/"
                className="flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary/95 text-white px-4 py-2 text-xs font-bold transition-all shadow-xs"
              >
                <Plus size={15} />
                <span>Create First Order</span>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* 4. Slide-Over Detail Drawer */}
      <OrderDetailDrawer
        order={activeOrder}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpdateStatus={handleUpdateStatus}
        onTogglePayment={handleTogglePayment}
        onCancelOrder={handleCancelOrder}
      />
    </LayoutRoot>
  )
}
