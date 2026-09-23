import { CheckCircle2, Circle } from 'lucide-react'
import type { Subvariation, Variation } from '@/types/product'

interface ProductSubvariationsProps {
  variation: Variation | null
  selectedSubId?: string
  onSelectSubvariation: (variationId: string, subvariationId: string) => void
}

const ProductSubvariations = ({
  variation,
  selectedSubId,
  onSelectSubvariation,
}: ProductSubvariationsProps) => {
  if (!variation) return null

  const subvariations: Subvariation[] = variation.subvariations || []

  return (
    <div className="space-y-3 pt-3 border-t border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-gray-900">{variation.name}</h4>
        </div>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
          Required
        </span>
      </div>

      {/* Subvariations List */}
      {subvariations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 p-4 text-center text-xs text-gray-400">
          No options available for this variation
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {subvariations.map((sub) => {
            const isSelected = selectedSubId === sub._id

            return (
              <button
                key={sub._id}
                type="button"
                onClick={() => onSelectSubvariation(variation._id, sub._id)}
                className={`
                  flex items-center justify-between rounded-xl border p-3 text-left transition-all duration-150 cursor-pointer
                  ${
                    isSelected
                      ? 'border-primary bg-primary/5 text-primary shadow-xs ring-1 ring-primary'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50/70'
                  }
                `}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Radio indicator */}
                  <span
                    className={`
                      flex size-4.5 shrink-0 items-center justify-center rounded-full transition-colors
                      ${isSelected ? 'text-primary' : 'text-gray-300'}
                    `}
                  >
                    {isSelected ? (
                      <CheckCircle2
                        size={18}
                        className="fill-primary text-white"
                      />
                    ) : (
                      <Circle size={18} />
                    )}
                  </span>

                  {/* Subvariation Name */}
                  <span
                    className={`text-sm font-semibold truncate ${isSelected ? 'text-primary' : 'text-gray-900'}`}
                  >
                    {sub.name}
                  </span>
                </div>

                {/* Default badge */}
                {sub.isDefault && (
                  <span className="shrink-0 rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                    Default
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ProductSubvariations
