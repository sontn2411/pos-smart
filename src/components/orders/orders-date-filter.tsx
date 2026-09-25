import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronDown, Check, X, CalendarDays } from 'lucide-react'
import { cn } from '#/utils/styles'

export type DatePreset = 'today' | 'yesterday' | 'last_7_days' | 'this_month' | 'last_month' | 'all' | 'custom'

export interface DateFilterState {
  preset: DatePreset
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
}

interface OrdersDateFilterProps {
  value: DateFilterState
  onChange: (val: DateFilterState) => void
}

const PRESETS: Array<{ id: DatePreset; label: string; desc: string }> = [
  { id: 'today', label: 'Today', desc: 'Current shift' },
  { id: 'yesterday', label: 'Yesterday', desc: 'Previous day' },
  { id: 'last_7_days', label: 'Last 7 Days', desc: 'Past week' },
  { id: 'this_month', label: 'This Month', desc: 'Sep 2026' },
  { id: 'last_month', label: 'Last Month', desc: 'Aug 2026' },
  { id: 'all', label: 'All Time', desc: 'Full history' },
  { id: 'custom', label: 'Custom Date / Range', desc: 'Select specific dates' },
]

export const OrdersDateFilter = ({ value, onChange }: OrdersDateFilterProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Local state for custom dates inside the popover
  const [customStart, setCustomStart] = useState(value.startDate)
  const [customEnd, setCustomEnd] = useState(value.endDate)

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isOpen])

  // Compute friendly display label
  const getDisplayLabel = () => {
    if (value.preset === 'today') return 'Today (24 Sep 2026)'
    if (value.preset === 'yesterday') return 'Yesterday (23 Sep 2026)'
    if (value.preset === 'last_7_days') return 'Last 7 Days'
    if (value.preset === 'this_month') return 'This Month (Sep 2026)'
    if (value.preset === 'last_month') return 'Last Month (Aug 2026)'
    if (value.preset === 'all') return 'All Dates'
    if (value.startDate && value.endDate) {
      if (value.startDate === value.endDate) {
        return value.startDate
      }
      return `${value.startDate} → ${value.endDate}`
    }
    return 'Select Date'
  }

  const handleSelectPreset = (preset: DatePreset) => {
    // Current simulated POS date is 2026-09-24
    if (preset === 'today') {
      onChange({ preset: 'today', startDate: '2026-09-24', endDate: '2026-09-24' })
      setIsOpen(false)
    } else if (preset === 'yesterday') {
      onChange({ preset: 'yesterday', startDate: '2026-09-23', endDate: '2026-09-23' })
      setIsOpen(false)
    } else if (preset === 'last_7_days') {
      onChange({ preset: 'last_7_days', startDate: '2026-09-17', endDate: '2026-09-24' })
      setIsOpen(false)
    } else if (preset === 'this_month') {
      onChange({ preset: 'this_month', startDate: '2026-09-01', endDate: '2026-09-30' })
      setIsOpen(false)
    } else if (preset === 'last_month') {
      onChange({ preset: 'last_month', startDate: '2026-08-01', endDate: '2026-08-31' })
      setIsOpen(false)
    } else if (preset === 'all') {
      onChange({ preset: 'all', startDate: '', endDate: '' })
      setIsOpen(false)
    } else {
      // Keep open so user can pick dates
      setCustomStart(value.startDate || '2026-09-24')
      setCustomEnd(value.endDate || '2026-09-24')
    }
  }

  const handleApplyCustom = () => {
    onChange({
      preset: 'custom',
      startDate: customStart,
      endDate: customEnd || customStart,
    })
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded-xl bg-white border px-3 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs whitespace-nowrap',
          isOpen
            ? 'border-stone-400 ring-2 ring-stone-400/20 text-stone-900'
            : 'border-stone-200 hover:border-stone-300 text-stone-700',
        )}
      >
        <Calendar size={15} className="text-stone-500" />
        <span>{getDisplayLabel()}</span>
        <ChevronDown
          size={14}
          className={cn(
            'text-stone-400 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-1.5 w-80 rounded-2xl bg-white p-3.5 shadow-xl border border-stone-200/90 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-stone-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
              <CalendarDays size={14} className="text-primary" />
              <span>Select Date & Period</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {PRESETS.map((p) => {
              const isSelected = value.preset === p.id
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p.id)}
                  className={cn(
                    'flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs text-left transition-colors cursor-pointer',
                    isSelected
                      ? 'bg-[#275344] text-white font-bold shadow-2xs'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100 font-medium',
                  )}
                >
                  <div className="truncate">
                    <div>{p.label}</div>
                    <div
                      className={cn(
                        'text-[10px]',
                        isSelected ? 'text-white/80' : 'text-stone-400',
                      )}
                    >
                      {p.desc}
                    </div>
                  </div>
                  {isSelected && <Check size={13} className="shrink-0 ml-1 text-white" />}
                </button>
              )
            })}
          </div>

          {/* Specific / Custom Date Picker Inputs */}
          <div className="rounded-xl bg-stone-50 p-2.5 border border-stone-200/60">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
              Specific Date Range (Day/Month/Year):
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs mb-2.5">
              <div>
                <label className="text-[10px] font-medium text-stone-500 block mb-0.5">
                  From:
                </label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full rounded-lg bg-white border border-stone-200 px-2 py-1.5 text-xs text-stone-800 font-mono focus:border-stone-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-medium text-stone-500 block mb-0.5">
                  To:
                </label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full rounded-lg bg-white border border-stone-200 px-2 py-1.5 text-xs text-stone-800 font-mono focus:border-stone-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleApplyCustom}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-[#275344] hover:bg-[#1f4337] py-1.5 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              <Check size={13} />
              <span>Apply Custom Date Range</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrdersDateFilter
