import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import Categories from './categories'
import ProductList from './product-list'
import CartSidebar from './cart-sidebar'
import type { CartItem } from '@/types/cart'
import type { Product } from '@/types/product'

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Handle adding item to cart
  const handleAddToCart = (
    product: Product,
    selections: Record<string, string[]>,
    selectedAddons: Record<string, number>,
    quantity: number,
    totalPrice: number,
  ) => {
    // Generate unique key for identical options
    const itemKey = `${product._id}-${JSON.stringify(selections)}-${JSON.stringify(selectedAddons)}`
    const unitPrice = totalPrice / quantity

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.key === itemKey)
      if (existingIndex > -1) {
        const next = [...prev]
        const currentItem = next[existingIndex]
        const nextQty = Math.min(currentItem.quantity + quantity, product.stock)
        next[existingIndex] = {
          ...currentItem,
          quantity: nextQty,
          totalPrice: nextQty * unitPrice,
        }
        return next
      }

      const newItem: CartItem = {
        id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        key: itemKey,
        product,
        selections,
        selectedAddons,
        quantity,
        unitPrice,
        totalPrice,
      }
      return [...prev, newItem]
    })

    // Automatically open the cart sidebar when an item is added
    setIsCartOpen(true)
  }

  // Handle quantity update (+1 / -1)
  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.id !== itemId) return item
          const newQty = item.quantity + delta
          if (newQty <= 0) return null
          const cappedQty = Math.min(newQty, item.product.stock)
          return {
            ...item,
            quantity: cappedQty,
            totalPrice: cappedQty * item.unitPrice,
          }
        })
        .filter(Boolean) as CartItem[]
    })
  }

  // Handle removing an item
  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  // Handle clearing entire cart
  const handleClearCart = () => {
    setIsCartOpen(false)
    setTimeout(() => {
      setCartItems([])
    }, 320)
  }

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalCartAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0)

  return (
    <div className="relative flex h-full overflow-hidden">
      {/* Left: Categories & Product List */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <div className="shrink-0 pb-3">
          <Categories
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">
          <ProductList
            selectedCategory={selectedCategory}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>

      {/* Right: Cart Sidebar (smooth slide-in from right, slide-out to right) */}
      <div
        className={`
          shrink-0 h-full overflow-hidden transition-all duration-300 ease-in-out
          ${
            isCartOpen && cartItems.length > 0
              ? 'w-80 md:w-92 xl:w-96 pl-4 opacity-100'
              : 'w-0 pl-0 opacity-0 pointer-events-none'
          }
        `}
      >
        <div
          className={`
            h-full w-full transition-transform duration-300 ease-in-out
            ${
              isCartOpen && cartItems.length > 0
                ? 'translate-x-0'
                : 'translate-x-full'
            }
          `}
        >
          <CartSidebar
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onClose={() => setIsCartOpen(false)}
          />
        </div>
      </div>

      {/* Floating Re-open Button if Cart is hidden but has items */}
      {!isCartOpen && cartItems.length > 0 && (
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="
            absolute bottom-4 right-4 z-30 flex items-center gap-3 rounded-2xl bg-primary px-4 py-3
            text-white shadow-xl shadow-primary/30 transition-all hover:bg-primary/95 active:scale-95 cursor-pointer animate-pop-in
          "
        >
          <div className="relative">
            <ShoppingBag size={20} />
            <span className="absolute -top-1.5 -right-2 flex size-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
              {totalCartCount}
            </span>
          </div>
          <span className="text-sm font-bold">View Order</span>
          <span className="border-l border-white/20 pl-2.5 text-sm font-extrabold">
            ${totalCartAmount.toFixed(2)}
          </span>
        </button>
      )}
    </div>
  )
}

export default Menu
