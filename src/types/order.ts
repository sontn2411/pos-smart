export type OrderStatus = 'new' | 'in_prep' | 'ready' | 'completed' | 'cancelled'

export type OrderType = 'dine_in' | 'takeaway' | 'delivery'

export type PaymentStatus = 'paid' | 'unpaid'

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  modifiers?: string[]
  notes?: string
}

export interface Order {
  id: string
  orderNumber: string
  tableId?: string
  tableName?: string
  orderType: OrderType
  status: OrderStatus
  paymentStatus: PaymentStatus
  serverName: string
  guestCount?: number
  customerName?: string
  customerPhone?: string
  date: string
  createdAt: string
  elapsedMinutes: number
  items: OrderItem[]
  subtotal: number
  tax: number
  discount?: number
  total: number
  kitchenNote?: string
}
