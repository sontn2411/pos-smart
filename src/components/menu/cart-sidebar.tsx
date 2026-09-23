import { useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react'
import type { CartItem } from '@/types/cart'

interface CartSidebarProps {
  items: CartItem[]
  onUpdateQuantity: (itemId: string, delta: number) => void
  onRemoveItem: (itemId: string) => void
  onClearCart: () => void
  onClose: () => void
}

const CartSidebar = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onClose,
}: CartSidebarProps) => {
  const [isSuccess, setIsSuccess] = useState(false)

  // Calculations
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
  const tax = subtotal * 0.08 // 8% sales tax
  const total = subtotal + tax

  const handleCheckout = () => {
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      onClearCart()
    }, 1800)
  }

  return (
    <aside className="flex h-full flex-col overflow-hidden bg-[#f5f3ef]">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pt-1 pb-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-white text-primary shadow-xs">
            <ShoppingBag size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900">Current Order</h3>
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white shadow-xs">
                {totalItemCount}
              </span>
            </div>
            <p className="text-[11px] text-gray-400">Dine-in / Takeaway</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Clear all button */}
          <button
            type="button"
            onClick={onClearCart}
            title="Clear order"
            className="flex size-8 items-center justify-center rounded-xl bg-white/70 text-gray-400 shadow-2xs transition-all hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
          >
            <Trash2 size={15} />
          </button>

          {/* Close sidebar button */}
          <button
            type="button"
            onClick={onClose}
            title="Hide cart"
            className="flex size-8 items-center justify-center rounded-xl bg-white/70 text-gray-400 shadow-2xs transition-all hover:bg-white hover:text-gray-700 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto px-1 py-1 space-y-2.5 custom-scrollbar">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center p-6 rounded-2xl bg-white/50">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-white text-gray-300 mb-3 shadow-xs">
              <ShoppingBag size={28} />
            </div>
            <p className="text-sm font-bold text-gray-700">Order is empty</p>
            <p className="text-xs text-gray-400 mt-1">
              Tap any item on the menu to add to this order.
            </p>
          </div>
        ) : (
          items.map((item) => {
            // Extract variation names
            const variationDetails: string[] = []
            if (item.product.variations) {
              item.product.variations.forEach((v) => {
                const subIds = item.selections[v._id] || []
                subIds.forEach((sId) => {
                  const sub = v.subvariations?.find((s) => s._id === sId)
                  if (sub) {
                    variationDetails.push(sub.name)
                  }
                })
              })
            }

            // Extract addons
            const addonDetails: string[] = []
            if (item.product.addons) {
              item.product.addons.forEach((addon) => {
                const qty = item.selectedAddons[addon._id] || 0
                if (qty > 0) {
                  addonDetails.push(
                    `${addon.name}${qty > 1 ? ` (x${qty})` : ''}`,
                  )
                }
              })
            }

            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-2xl bg-white p-3.5 shadow-xs transition-all hover:shadow-sm"
              >
                {/* Top Row: Thumbnail + Title + Remove */}
                <div className="flex items-start gap-2.5">
                  <div className="size-12 shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-100/80">
                    <img
                      src={item.product.mainImage.url}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-gray-900 leading-tight truncate">
                        {item.product.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-300 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <span className="text-[11px] font-semibold text-primary">
                      ${item.unitPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Customizations tags */}
                {(variationDetails.length > 0 || addonDetails.length > 0) && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {variationDetails.map((vName, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 border border-gray-100"
                      >
                        {vName}
                      </span>
                    ))}
                    {addonDetails.map((aName, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 border border-amber-100/60"
                      >
                        +{aName}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bottom Row: Stepper + Total */}
                <div className="mt-2.5 flex items-center justify-between border-t border-gray-100/80 pt-2">
                  <div className="flex items-center rounded-lg bg-gray-100/80 p-0.5 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="flex size-6 items-center justify-center rounded-md text-gray-600 hover:bg-white hover:text-gray-900 transition-all cursor-pointer"
                    >
                      <Minus size={12} />
                    </button>

                    <span className="w-6 text-center text-xs font-bold text-gray-800">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      disabled={item.quantity >= item.product.stock}
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="flex size-6 items-center justify-center rounded-md text-gray-600 hover:bg-white hover:text-gray-900 disabled:opacity-30 transition-all cursor-pointer"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <span className="text-xs font-extrabold text-gray-900">
                    ${item.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Footer / Summary */}
      {items.length > 0 && (
        <div className="shrink-0 pt-2 pb-1 px-1 space-y-2.5">
          {/* Bill Breakdown Card */}
          <div className="rounded-2xl bg-white p-3.5 shadow-xs space-y-2.5">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-700">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Tax (8%)</span>
                <span className="font-semibold text-gray-700">
                  ${tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2 text-sm font-bold text-gray-900">
                <span>Total Amount</span>
                <span className="text-base font-black text-primary">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            type="button"
            onClick={handleCheckout}
            disabled={isSuccess}
            className={`
              flex w-full h-11 items-center justify-center gap-2 rounded-xl text-sm font-bold text-white shadow-md shadow-primary/25
              transition-all cursor-pointer active:scale-[0.98]
              ${
                isSuccess
                  ? 'bg-emerald-600'
                  : 'bg-primary hover:bg-primary/95'
              }
            `}
          >
            {isSuccess ? (
              <>
                <CheckCircle2 size={18} />
                Order Placed Successfully!
              </>
            ) : (
              <>
                <span>Pay & Place Order</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      )}
    </aside>
  )
}

export default CartSidebar
