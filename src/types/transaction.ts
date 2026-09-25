export type PaymentMethod = 'cash' | 'card' | 'qr_wallet' | 'bank_transfer'

export type TransactionStatus = 'completed' | 'pending' | 'refunded' | 'failed'

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'apple_pay' | 'momo' | 'vnpay'

export interface Transaction {
  id: string
  code: string
  orderNumber: string
  tableOrCustomer: string
  amount: number
  method: PaymentMethod
  cardBrand?: CardBrand
  cardLast4?: string
  status: TransactionStatus
  date: string // YYYY-MM-DD
  time: string // HH:mm AM/PM
  cashier: string
  terminal: string
  itemsSummary: string
  subtotal: number
  tax: number
  tip?: number
  refundAmount?: number
  refundReason?: string
}
