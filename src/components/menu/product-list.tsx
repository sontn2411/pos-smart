import { useState } from 'react'
import { Check, Plus, SlidersHorizontal } from 'lucide-react'
import productsData from '@/data/products.json'
import type { Product } from '@/types/product'
import ProductDetailModal from './product-detail'

interface ProductListProps {
  selectedCategory: string | null
  onAddToCart?: (
    product: Product,
    selections: Record<string, string[]>,
    selectedAddons: Record<string, number>,
    quantity: number,
    totalPrice: number,
  ) => void
}

const ProductList = ({ selectedCategory, onAddToCart }: ProductListProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [justAddedId, setJustAddedId] = useState<string | null>(null)

  const products: Product[] = selectedCategory
    ? (productsData as Product[]).filter((p) => p.category === selectedCategory)
    : productsData

  // Quick add to cart directly for products without customization
  const handleQuickAddToCart = (product: Product) => {
    setJustAddedId(product._id)
    setTimeout(() => {
      setJustAddedId((current) => (current === product._id ? null : current))
    }, 800)

    onAddToCart?.(product, {}, {}, 1, product.price)
  }

  return (
    <div className="h-full overflow-y-auto pr-1 pb-6 custom-scrollbar">
      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {products.map((product, index) => {
          const isOutOfStock = product.stock <= 0
          const hasCustomization =
            (product.variations && product.variations.length > 0) ||
            (product.addons && product.addons.length > 0)

          return (
            <div
              key={`${selectedCategory || 'all'}-${product._id}`}
              style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
              onClick={() => {
                if (!isOutOfStock) {
                  setSelectedProduct(product)
                }
              }}
              className={`
                group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-2.5 sm:p-3
                animate-card-enter transition-all duration-300 ease-out
                ${
                  isOutOfStock
                    ? 'border-gray-200/60 bg-gray-50/60 opacity-45 cursor-not-allowed select-none'
                    : 'border-gray-100 cursor-pointer hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/8 active:scale-[0.98]'
                }
              `}
            >
              {/* Top: Image with Badges */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={product.mainImage.url}
                  alt={product.name}
                  loading="lazy"
                  className={`h-full w-full object-cover transition-transform duration-500 ease-out ${
                    !isOutOfStock ? 'group-hover:scale-108' : ''
                  }`}
                />

                {/* Stock Badge Overlay */}
                <div
                  className={`
                    absolute top-2 left-2 flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium shadow-xs backdrop-blur-[2px]
                    ${
                      isOutOfStock
                        ? 'bg-rose-500 text-white'
                        : 'bg-white/95 text-gray-700'
                    }
                  `}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      isOutOfStock ? 'bg-white' : 'bg-emerald-500'
                    }`}
                  />
                  <span className="font-bold">
                    {isOutOfStock ? 'Out of stock' : product.stock}
                  </span>
                </div>

                {/* Customizable Indicator Badge */}
                {hasCustomization && !isOutOfStock && (
                  <div
                    title="Has customizable options"
                    className="
                      absolute top-2 right-2 flex size-6 items-center justify-center rounded-lg
                      bg-black/45 text-white backdrop-blur-[2px] transition-transform group-hover:scale-105
                    "
                  >
                    <SlidersHorizontal size={12} />
                  </div>
                )}
              </div>

              {/* Middle: Title & Description */}
              <div className="mt-2.5 flex-1 min-w-0">
                <h3
                  className={`line-clamp-1 text-sm font-bold transition-colors ${
                    isOutOfStock
                      ? 'text-gray-400'
                      : 'text-gray-900 group-hover:text-primary'
                  }`}
                >
                  {product.name}
                </h3>
                {product.desc && (
                  <p className="mt-0.5 line-clamp-1 text-xs text-gray-400">
                    {product.desc}
                  </p>
                )}
              </div>

              {/* Bottom: Price + Quick Action */}
              <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-2.5">
                <div>
                  <p
                    className={`text-base font-extrabold leading-none ${
                      isOutOfStock ? 'text-gray-400' : 'text-primary'
                    }`}
                  >
                    ${product.price.toFixed(2)}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isOutOfStock}
                  title={
                    isOutOfStock
                      ? 'Out of stock'
                      : hasCustomization
                        ? 'Select options'
                        : 'Quick add to cart'
                  }
                  onClick={(e) => {
                    e.stopPropagation()
                    if (isOutOfStock) return
                    if (hasCustomization) {
                      setSelectedProduct(product)
                    } else {
                      handleQuickAddToCart(product)
                    }
                  }}
                  className={`
                    flex size-8.5 items-center justify-center rounded-xl transition-all duration-200
                    ${
                      isOutOfStock
                        ? 'bg-gray-100 text-gray-300 opacity-40 cursor-not-allowed pointer-events-none'
                        : justAddedId === product._id
                          ? 'bg-emerald-600 text-white scale-105 shadow-sm shadow-emerald-500/30 cursor-pointer'
                          : hasCustomization
                            ? 'bg-primary/10 text-primary shadow-2xs group-hover:bg-primary group-hover:text-white group-hover:shadow-sm group-hover:shadow-primary/30 group-hover:scale-105 active:scale-95 cursor-pointer'
                            : 'bg-primary text-white shadow-2xs shadow-primary/20 hover:bg-primary/90 hover:scale-105 active:scale-95 cursor-pointer'
                    }
                  `}
                >
                  {justAddedId === product._id ? (
                    <span className="animate-pop-in flex items-center justify-center">
                      <Check size={16} strokeWidth={2.8} />
                    </span>
                  ) : hasCustomization ? (
                    <SlidersHorizontal size={15} strokeWidth={2.2} />
                  ) : (
                    <Plus size={17} strokeWidth={2.5} />
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center text-center animate-card-enter">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mb-3">
            <SlidersHorizontal size={24} className="opacity-40" />
          </div>
          <p className="text-sm font-bold text-gray-700">No items available</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Please select another category.
          </p>
        </div>
      )}

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          open={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(
            product,
            selections,
            selectedAddons,
            quantity,
            totalPrice,
          ) => {
            onAddToCart?.(
              product,
              selections,
              selectedAddons,
              quantity,
              totalPrice,
            )
            setSelectedProduct(null)
          }}
        />
      )}
    </div>
  )
}

export default ProductList
