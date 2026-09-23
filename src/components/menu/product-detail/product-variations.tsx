import { Check, Layers } from 'lucide-react'
import type { Variation } from '@/types/product'

interface ProductVariationsProps {
  variations?: Variation[]
  activeVariationId: string | null
  selections?: Record<string, string[]>
  onSelectVariation: (id: string) => void
}

const ProductVariations = ({
  variations,
  activeVariationId,
  selections,
  onSelectVariation,
}: ProductVariationsProps) => {
  if (!variations || variations.length === 0) return null

  return (
    <div className="space-y-2.5">
      {/* Header title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Layers size={14} />
          </div>
          <span className="text-sm font-semibold text-gray-800">
            Variations
          </span>
        </div>
        <span className="text-xs font-medium text-gray-400">
          {variations.length} {variations.length === 1 ? 'group' : 'groups'}
        </span>
      </div>

      {/* List of item.name */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {variations.map((item) => {
          const isActive = activeVariationId === item._id
          const count = item.subvariations?.length || 0
          const selectedSubId = selections?.[item._id]?.[0]
          const selectedSub = item.subvariations?.find((s) => s._id === selectedSubId)

          return (
            <button
              key={item._id}
              type="button"
              onClick={() => onSelectVariation(item._id)}
              className={`
                group relative flex flex-col items-start rounded-xl border p-3 text-left transition-all duration-150 cursor-pointer
                ${
                  isActive
                    ? 'border-primary bg-primary/5 shadow-xs shadow-primary/10 ring-1 ring-primary'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/70'
                }
              `}
            >
              {/* Active check badge */}
              {isActive && (
                <span className="absolute top-2 right-2 flex size-4 items-center justify-center rounded-full bg-primary text-white">
                  <Check size={10} strokeWidth={3} />
                </span>
              )}

              {/* Variation name */}
              <span
                className={`
                  text-sm font-bold truncate max-w-[85%]
                  ${isActive ? 'text-primary' : 'text-gray-800 group-hover:text-gray-900'}
                `}
              >
                {item.name}
              </span>

              {/* Selected subvariation or count */}
              <span
                className={`
                  mt-1 text-xs truncate max-w-full
                  ${
                    selectedSub
                      ? isActive
                        ? 'text-primary font-medium'
                        : 'text-gray-600 font-medium'
                      : isActive
                        ? 'text-primary/70'
                        : 'text-gray-400'
                  }
                `}
              >
                {selectedSub ? selectedSub.name : `${count} ${count === 1 ? 'option' : 'options'}`}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ProductVariations
