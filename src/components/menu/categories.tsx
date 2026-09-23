import categoriesData from '@/data/categories.json'
import { useEffect, useRef } from 'react'
import { cn } from '#/utils/styles'

interface CategoriesProps {
  selected: string | null
  onSelect: (id: string | null) => void
}

const Categories = ({ selected, onSelect }: CategoriesProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const activeButton = activeRef.current
    const container = containerRef.current

    if (!activeButton || !container) return

    container.style.setProperty(
      '--indicator-left',
      `${activeButton.offsetLeft}px`,
    )

    container.style.setProperty(
      '--indicator-width',
      `${activeButton.offsetWidth}px`,
    )
  }, [selected])

  return (
    <div className="w-fit max-w-full bg-white rounded-lg overflow-x-auto scrollbar-hide">
      <div
        ref={containerRef}
        className={cn(
          'relative flex w-max ',
          '[--indicator-left:4px]',
          '[--indicator-width:80px]',
        )}
      >
        {/* Active indicator */}
        <div
          className="
            absolute
            top-0
            bottom-0
            left-[var(--indicator-left)]
            w-[var(--indicator-width)]
            rounded-md
            bg-primary
            transition-[left,width]
            duration-300
            ease-in-out
            pointer-events-none
          "
        />

        {/* All */}
        <button
          ref={selected === null ? activeRef : undefined}
          type="button"
          onClick={() => onSelect(null)}
          className="relative z-10 py-3 px-6 min-w-20"
        >
          <span
            className={cn(selected === null ? 'text-white' : 'text-gray-700')}
          >
            All Products
          </span>
        </button>

        {/* Categories */}
        {categoriesData.map((cat) => {
          const isActive = selected === cat._id

          return (
            <button
              key={cat._id}
              ref={isActive ? activeRef : undefined}
              type="button"
              onClick={() => onSelect(cat._id)}
              className="relative z-10 py-3 px-6 min-w-20"
            >
              <span className={cn(isActive ? 'text-white' : 'text-gray-700')}>
                {cat.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Categories
