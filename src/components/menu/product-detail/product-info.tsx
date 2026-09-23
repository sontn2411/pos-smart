import type { Product } from '@/types/product'

interface ProductInfoProps {
  product: Product
  currentPrice: number
}

const ProductInfo = ({ product, currentPrice }: ProductInfoProps) => {
  return (
    <div className="flex items-center gap-3.5 pb-3 border-b border-gray-100 pr-11">
      <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
        <img
          src={product.mainImage.url}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-gray-900 truncate">
            {product.name}
          </h3>
          <span className="text-lg font-extrabold text-primary shrink-0">
            ${currentPrice.toFixed(2)}
          </span>
        </div>

        {product.desc && (
          <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">
            {product.desc}
          </p>
        )}

        <div className="mt-1 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${
              product.stock > 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
            {product.stock > 0
              ? `${product.stock} in stock`
              : 'Out of stock'}
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-[11px] text-gray-400">Quick Prep</span>
        </div>
      </div>
    </div>
  )
}

export default ProductInfo
