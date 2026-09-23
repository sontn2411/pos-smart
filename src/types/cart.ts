import type { Product } from './product'

export interface CartItem {
  id: string
  key: string
  product: Product
  selections: Record<string, string[]>
  selectedAddons: Record<string, number>
  quantity: number
  unitPrice: number
  totalPrice: number
}
