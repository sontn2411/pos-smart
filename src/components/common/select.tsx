import { ChevronDown } from 'lucide-react'
import type { ReactNode, ComponentType } from 'react'
import { useState, useRef, useEffect } from 'react'

export interface SelectOption {
  value: string
  label: string
  icon?: ComponentType<{ size?: number; className?: string }>
}

interface SelectProps {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  icon?: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'ghost' | 'outlined'
}

const sizeStyles = {
  sm: 'py-1.5 px-3 text-xs gap-1.5',
  md: 'py-2 px-3.5 text-sm gap-2',
  lg: 'py-2.5 px-4 text-base gap-2',
}

const variantStyles = {
  default:
    'bg-white border border-gray-300 hover:border-gray-400 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
  ghost: 'bg-transparent hover:bg-gray-100',
  outlined:
    'bg-transparent border border-gray-200 hover:border-gray-300 focus-within:border-primary',
}

const Select = ({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = 'Select...',
  icon,
  className = '',
  size = 'md',
  variant = 'ghost',
}: SelectProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  const value = controlledValue !== undefined ? controlledValue : internalValue

  const selectedOption = options.find((opt) => opt.value === value)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleSelect = (optionValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(optionValue)
    }
    onChange?.(optionValue)
    setIsOpen(false)
  }

  return (
    <div ref={selectRef} className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex w-full cursor-pointer items-center rounded-lg transition-all
          ${sizeStyles[size]}
          ${variantStyles[variant]}
          ${isOpen ? 'ring-2 ring-primary/20' : ''}
        `}
      >
        {icon && <span className="text-gray-500">{icon}</span>}
        {selectedOption?.icon && (
          <selectedOption.icon size={16} className="text-gray-500" />
        )}
        <span className={selectedOption ? 'text-gray-700' : 'text-gray-400'}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`ml-auto text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-1 min-w-full overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg animate-in fade-in slide-in-from-top-1">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`
                flex w-full cursor-pointer items-center gap-2 px-3.5 py-2 text-left transition-colors
                ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'}
                ${
                  option.value === value
                    ? 'bg-primary/10 font-medium text-primary'
                    : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              {option.icon && (
                <option.icon
                  size={16}
                  className={
                    option.value === value ? 'text-primary' : 'text-gray-400'
                  }
                />
              )}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Select
