import { Check, Minus, Plus, PlusCircle } from 'lucide-react'
import type { Addon } from '@/types/product'

interface ProductAddonsProps {
  addons?: Addon[]
  addonQuantities: Record<string, number>
  onToggleAddon: (addonId: string) => void
  onUpdateAddonQuantity: (addonId: string, delta: number) => void
}

const ProductAddons = ({
  addons,
  addonQuantities,
  onToggleAddon,
  onUpdateAddonQuantity,
}: ProductAddonsProps) => {
  if (!addons || addons.length === 0) return null

  return (
    <div className="space-y-3 pt-3 border-t border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
            <PlusCircle size={14} />
          </div>
          <span className="text-sm font-bold text-gray-900">Add-ons</span>
        </div>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
          Optional • Multi-select
        </span>
      </div>

      {/* Addons Grid */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {addons.map((addon) => {
          const qty = addonQuantities[addon._id] || 0
          const isSelected = qty > 0

          return (
            <div
              key={addon._id}
              onClick={() => {
                if (!isSelected) {
                  onToggleAddon(addon._id)
                }
              }}
              className={`
                group flex items-center justify-between rounded-xl border p-3 transition-all duration-150
                ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-xs ring-1 ring-primary'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/70 cursor-pointer'
                }
              `}
            >
              {/* Checkbox and Name */}
              <div
                onClick={(e) => {
                  if (isSelected) {
                    e.stopPropagation()
                    onToggleAddon(addon._id)
                  }
                }}
                className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer select-none"
              >
                {/* Custom Checkbox */}
                <span
                  className={`
                    flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors
                    ${
                      isSelected
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-300 bg-white group-hover:border-gray-400'
                    }
                  `}
                >
                  {isSelected && <Check size={12} strokeWidth={3} />}
                </span>

                <div className="min-w-0 flex-1 pr-2">
                  <p
                    className={`text-sm font-semibold truncate ${
                      isSelected ? 'text-primary' : 'text-gray-800'
                    }`}
                  >
                    {addon.name}
                  </p>
                  <p className="text-xs font-bold text-gray-500">
                    +${addon.price.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Quantity Stepper when selected */}
              {isSelected && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center rounded-lg border border-primary/20 bg-white p-0.5 shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => onUpdateAddonQuantity(addon._id, -1)}
                    className="
                      flex size-6 items-center justify-center rounded-md text-gray-600
                      transition-colors hover:bg-gray-100 hover:text-gray-900 cursor-pointer
                    "
                  >
                    <Minus size={12} />
                  </button>

                  <span className="w-6 text-center text-xs font-bold text-primary">
                    {qty}
                  </span>

                  <button
                    type="button"
                    onClick={() => onUpdateAddonQuantity(addon._id, 1)}
                    className="
                      flex size-6 items-center justify-center rounded-md text-gray-600
                      transition-colors hover:bg-gray-100 hover:text-gray-900 cursor-pointer
                    "
                  >
                    <Plus size={12} />
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProductAddons
