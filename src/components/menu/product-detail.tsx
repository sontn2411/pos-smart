import { useEffect, useMemo, useState } from 'react'
import { Minus, Plus, ShoppingCart, X } from 'lucide-react'

import type { Product } from '@/types/product'

import ProductInfo from './product-detail/product-info'
import ProductVariations from './product-detail/product-variations'
import ProductSubvariations from './product-detail/product-subvariations'
import ProductAddons from './product-detail/product-addons'

interface ProductDetailModalProps {
  product: Product | null
  open: boolean
  onClose: () => void
  onAddToCart?: (
    product: Product,
    selections: Record<string, string[]>,
    selectedAddons: Record<string, number>,
    quantity: number,
    totalPrice: number,
  ) => void
}

const ProductDetailModal = ({
  product,
  open,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) => {
  const [selections, setSelections] = useState<Record<string, string[]>>({})
  const [addonQuantities, setAddonQuantities] = useState<Record<string, number>>(
    {},
  )
  const [quantity, setQuantity] = useState(1)
  const [activeVariationId, setActiveVariationId] = useState<string | null>(
    null,
  )

  // Automatically activate first variation and initialize default subvariations
  useEffect(() => {
    if (product?.variations && product.variations.length > 0) {
      setActiveVariationId(product.variations[0]._id)
      const initialSelections: Record<string, string[]> = {}
      product.variations.forEach((v) => {
        const defaultSub =
          v.subvariations?.find((s) => s.isDefault) || v.subvariations?.[0]
        if (defaultSub) {
          initialSelections[v._id] = [defaultSub._id]
        }
      })
      setSelections(initialSelections)
    } else {
      setActiveVariationId(null)
      setSelections({})
    }
    setAddonQuantities({})
    setQuantity(1)
  }, [product, open])

  // Get active variation object
  const activeVariation = useMemo(() => {
    return product?.variations?.find((v) => v._id === activeVariationId) || null
  }, [product, activeVariationId])

  // Handle selecting a subvariation
  const handleSelectSubvariation = (
    variationId: string,
    subvariationId: string,
  ) => {
    setSelections((prev) => ({
      ...prev,
      [variationId]: [subvariationId],
    }))
  }

  // Handle toggling an addon
  const handleToggleAddon = (addonId: string) => {
    setAddonQuantities((prev) => {
      const next = { ...prev }
      if (next[addonId]) {
        delete next[addonId]
      } else {
        next[addonId] = 1
      }
      return next
    })
  }

  // Handle adjusting addon quantity
  const handleUpdateAddonQuantity = (addonId: string, delta: number) => {
    setAddonQuantities((prev) => {
      const current = prev[addonId] || 0
      const nextQty = current + delta
      const next = { ...prev }
      if (nextQty <= 0) {
        delete next[addonId]
      } else {
        next[addonId] = nextQty
      }
      return next
    })
  }

  // Calculate total price based on base price, addons, and quantity
  const totalPrice = useMemo(() => {
    if (!product) return 0
    let base = product.price

    // Add addons prices
    if (product.addons) {
      product.addons.forEach((addon) => {
        const qty = addonQuantities[addon._id] || 0
        base += addon.price * qty
      })
    }

    return base * quantity
  }, [product, addonQuantities, quantity])

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  /**
   * Add to cart handler
   */
  const handleAddToCart = () => {
    if (!product) return
    onAddToCart?.(
      product,
      selections,
      addonQuantities,
      quantity,
      totalPrice,
    )
    onClose()
  }

  if (!open || !product) return null

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        p-4
        backdrop-blur-[2px]
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="
          relative
          flex
          max-h-[90vh]
          w-full
          max-w-2xl
          flex-col
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
        "
      >
        {/* Modal close button */}
        <button
          type="button"
          onClick={onClose}
          className="
            absolute top-4 right-4 z-10 flex size-8 items-center justify-center rounded-full
            bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800 cursor-pointer
          "
        >
          <X size={18} />
        </button>

        {/* Main Content: Variation -> Subvariation -> Addons */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Product Info */}
          <ProductInfo product={product} currentPrice={product.price} />

          {/* Variations */}
          <ProductVariations
            variations={product.variations}
            activeVariationId={activeVariationId}
            selections={selections}
            onSelectVariation={setActiveVariationId}
          />

          {/* Subvariations of selected variation */}
          <ProductSubvariations
            variation={activeVariation}
            selectedSubId={
              activeVariationId ? selections[activeVariationId]?.[0] : undefined
            }
            onSelectSubvariation={handleSelectSubvariation}
          />

          {/* Add-ons */}
          <ProductAddons
            addons={product.addons}
            addonQuantities={addonQuantities}
            onToggleAddon={handleToggleAddon}
            onUpdateAddonQuantity={handleUpdateAddonQuantity}
          />
        </div>

        {/* Fixed Footer: Quantity Stepper + Add to Cart Button */}
        <div className="shrink-0 border-t border-gray-100 bg-white p-4">
          <div className="flex items-center gap-3">
            <div></div>

            {/* Quantity Stepper */}
            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50/70 p-1">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                disabled={quantity <= 1}
                className="
                  flex size-9 items-center justify-center rounded-lg bg-white text-gray-700
                  shadow-2xs transition-colors hover:text-gray-900 disabled:opacity-40 cursor-pointer
                "
              >
                <Minus size={15} />
              </button>

              <span className="w-9 text-center text-sm font-bold text-gray-900">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => setQuantity((value) => value + 1)}
                disabled={quantity >= product.stock}
                className="
                  flex size-9 items-center justify-center rounded-lg bg-white text-gray-700
                  shadow-2xs transition-colors hover:text-gray-900 cursor-pointer disabled:opacity-40
                "
              >
                <Plus size={15} />
              </button>
            </div>

            {/* Nút lớn Add to Cart */}
            <button
              type="button"
              disabled={product.stock <= 0}
              onClick={handleAddToCart}
              className="
                flex
                h-11
                flex-1
                items-center
                justify-between
                rounded-xl
                bg-primary
                px-5
                text-sm
                font-bold
                text-white
                shadow-md
                shadow-primary/20
                transition-all
                hover:bg-primary/95
                active:scale-[0.99]
                disabled:cursor-not-allowed
                disabled:opacity-50
                cursor-pointer
              "
            >
              <span className="flex items-center gap-2">
                <ShoppingCart size={18} />
                Add to Cart
              </span>

              <span className="text-base font-extrabold">
                ${totalPrice.toFixed(2)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailModal
