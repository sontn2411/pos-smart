import {
  table1,
  table2,
  table3,
  table4,
  table5,
  table6,
  table7,
  table8,
  table9,
  table10,
  table11,
  table12,
} from '@/assets'
import type { PlacedTable, TableStatus } from '@/types/table'
import { useState, useRef, useEffect, memo } from 'react'
import { DEFAULT_TABLE_SIZE } from '@/hooks/use-table-canvas'
import {
  Pencil,
  Check,
  Trash2,
  Move,
  Maximize2,
  RotateCw,
  ChevronDown,
} from 'lucide-react'
import { cn } from '#/utils/styles'
import {
  TABLE_STATUS_CONFIG,
  ALL_TABLE_STATUSES,
} from '@/constants/table-status'

export const TABLE_IMAGE_MAP: Record<string, string> = {
  table1,
  table2,
  table3,
  table4,
  table5,
  table6,
  table7,
  table8,
  table9,
  table10,
  table11,
  table12,
}

interface PlacedTableItemProps {
  table: PlacedTable
  tableSize: number
  canvasWidth: number
  isDragging: boolean
  isSelected: boolean
  isEditingName: boolean
  isFilteredOut?: boolean
  onPointerDown: (e: React.PointerEvent, table: PlacedTable) => void
  onPointerMove: (e: React.PointerEvent, tableId: string) => void
  onPointerUp: (e: React.PointerEvent) => void
  onResize: (tableId: string, newSize: number) => void
  onRotate: (tableId: string, newRotation: number) => void
  onUpdateStatus: (tableId: string, newStatus: TableStatus) => void
  onSelect: (tableId: string) => void
  onStartRename: (tableId: string) => void
  onSaveRename: (tableId: string, newName: string) => void
  onCancelRename: () => void
  onDelete: (tableId: string) => void
}

const PlacedTableItem = memo(({
  table,
  tableSize,
  canvasWidth,
  isDragging,
  isSelected,
  isEditingName,
  isFilteredOut = false,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onResize,
  onRotate,
  onUpdateStatus,
  onSelect,
  onStartRename,
  onSaveRename,
  onCancelRename,
  onDelete,
}: PlacedTableItemProps) => {
  const currentSize = table.size ?? tableSize
  const currentRotation = table.rotation ?? 0
  const currentStatus: TableStatus = table.status || 'available'
  const statusConfig = TABLE_STATUS_CONFIG[currentStatus]

  const tableRef = useRef<HTMLDivElement>(null)
  const [tempName, setTempName] = useState(table.name)
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false)
  const [isBadgeMenuOpen, setIsBadgeMenuOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Resizing state
  const [isResizing, setIsResizing] = useState(false)
  const resizeCenterRef = useRef<{ cx: number; cy: number }>({ cx: 0, cy: 0 })

  // Rotating state
  const [isRotating, setIsRotating] = useState(false)
  const rotateCenterRef = useRef<{ cx: number; cy: number }>({ cx: 0, cy: 0 })

  useEffect(() => {
    setTempName(table.name)
  }, [table.name])

  useEffect(() => {
    if (isEditingName) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditingName])

  // Close status menu when deselected
  useEffect(() => {
    if (!isSelected) {
      setIsStatusMenuOpen(false)
      setIsBadgeMenuOpen(false)
    }
  }, [isSelected])

  const handleSave = () => {
    const trimmed = tempName.trim()
    if (trimmed && trimmed !== table.name) {
      onSaveRename(table.id, trimmed)
    } else {
      setTempName(table.name)
      onCancelRename()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setTempName(table.name)
      onCancelRename()
    }
  }

  // Handle resizing: radial distance-from-center approach ensures smooth resizing at any rotation angle
  const handleResizePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation()
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    setIsResizing(true)

    if (tableRef.current) {
      const rect = tableRef.current.getBoundingClientRect()
      resizeCenterRef.current = {
        cx: rect.left + rect.width / 2,
        cy: rect.top + rect.height / 2,
      }
    }
  }

  const handleResizePointerMove = (e: React.PointerEvent) => {
    if (!isResizing) return
    e.stopPropagation()
    e.preventDefault()

    const { cx, cy } = resizeCenterRef.current
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy)
    const newSize = Math.max(DEFAULT_TABLE_SIZE, Math.round(dist * Math.SQRT2))
    onResize(table.id, newSize)
  }

  const handleResizePointerUp = (e: React.PointerEvent) => {
    if (isResizing) {
      e.stopPropagation()
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        // ignore
      }
      setIsResizing(false)
    }
  }

  // Handle 360° rotation: calculate angle relative to center with top (12 o'clock) as 0°
  const handleRotatePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation()
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    setIsRotating(true)

    if (tableRef.current) {
      const rect = tableRef.current.getBoundingClientRect()
      rotateCenterRef.current = {
        cx: rect.left + rect.width / 2,
        cy: rect.top + rect.height / 2,
      }
    }
  }

  const handleRotatePointerMove = (e: React.PointerEvent) => {
    if (!isRotating) return
    e.stopPropagation()
    e.preventDefault()

    const { cx, cy } = rotateCenterRef.current
    const rad = Math.atan2(e.clientY - cy, e.clientX - cx)
    const deg = (rad * 180) / Math.PI
    const angle = Math.round(deg + 90)
    let normalized = ((angle % 360) + 360) % 360

    if (e.shiftKey) {
      normalized = (Math.round(normalized / 15) * 15) % 360
    }

    onRotate(table.id, normalized)
  }

  const handleRotatePointerUp = (e: React.PointerEvent) => {
    if (isRotating) {
      e.stopPropagation()
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        // ignore
      }
      setIsRotating(false)
    }
  }

  const isNearTop = table.y < 72
  const isNearLeft = table.x < 36
  const isNearRight =
    canvasWidth > 0 && table.x > canvasWidth - currentSize - 36

  return (
    <div
      ref={tableRef}
      onPointerDown={(e) => onPointerDown(e, table)}
      onPointerMove={(e) => onPointerMove(e, table.id)}
      onPointerUp={onPointerUp}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(table.id)
      }}
      style={{
        left: `${table.x}px`,
        top: `${table.y}px`,
        width: `${currentSize}px`,
        height: `${currentSize}px`,
      }}
      className={cn(
        'group absolute touch-none cursor-move select-none transition-opacity',
        isDragging || isResizing || isRotating
          ? 'z-30'
          : isSelected
            ? 'z-20'
            : 'z-10 hover:z-20',
        isFilteredOut && 'opacity-30 grayscale-[40%] hover:opacity-80',
      )}
    >
      {/* Floating Action Toolbar (Auto-adjusts positioning to avoid being clipped by any edge) */}
      {isSelected && !isDragging && !isResizing && !isRotating && (
        <div
          data-action="toolbar"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'absolute z-40 flex items-center gap-1 rounded-xl bg-white px-2 py-1 shadow-lg border border-stone-200/90 animate-pop-in whitespace-nowrap',
            isNearTop ? '-bottom-12' : '-top-16',
            isNearRight
              ? 'right-0 left-auto translate-x-0'
              : isNearLeft
                ? 'left-0 translate-x-0'
                : 'left-1/2 -translate-x-1/2',
          )}
        >
          {/* Drag & Move Indicator */}
          <div
            title="Click and drag table to move"
            className="flex items-center gap-1 px-1 text-stone-400 cursor-grab"
          >
            <Move size={12} />
          </div>

          <div className="h-3.5 w-px bg-stone-200" />

          {/* Status Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsStatusMenuOpen((prev) => !prev)}
              title="Change table status"
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold border transition-colors cursor-pointer',
                statusConfig.bgColor,
                statusConfig.textColor,
                statusConfig.borderColor,
              )}
            >
              <span className={cn('size-2 rounded-full shrink-0', statusConfig.dotColor)} />
              <span>{statusConfig.shortLabel}</span>
              <ChevronDown size={11} className="opacity-60" />
            </button>

            {/* Dropdown Menu */}
            {isStatusMenuOpen && (
              <div
                className="absolute left-0 top-full mt-1.5 z-50 flex w-40 flex-col rounded-xl bg-white p-1 shadow-xl border border-stone-200/90 animate-pop-in whitespace-nowrap"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Table Status
                </div>
                {ALL_TABLE_STATUSES.map((stKey) => {
                  const stCfg = TABLE_STATUS_CONFIG[stKey]
                  const isCurrent = stKey === currentStatus
                  return (
                    <button
                      key={stKey}
                      type="button"
                      onClick={() => {
                        onUpdateStatus(table.id, stKey)
                        setIsStatusMenuOpen(false)
                      }}
                      className={cn(
                        'flex items-center justify-between rounded-lg px-2 py-1 text-xs font-semibold transition-colors cursor-pointer text-left',
                        isCurrent
                          ? 'bg-stone-100 text-stone-900 font-bold'
                          : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className={cn('size-2 rounded-full shrink-0', stCfg.dotColor)} />
                        <span>{stCfg.label}</span>
                      </div>
                      {isCurrent && <Check size={12} className="text-primary" />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="h-3.5 w-px bg-stone-200" />

          {/* Rename Action */}
          <button
            type="button"
            onClick={() => onStartRename(table.id)}
            title="Edit table name"
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <Pencil size={12} className="text-primary" />
            <span>Rename</span>
          </button>

          <div className="h-3.5 w-px bg-stone-200" />

          {/* Quick Rotate 90° */}
          <button
            type="button"
            onClick={() => onRotate(table.id, (currentRotation + 90) % 360)}
            title="Rotate 90° clockwise (or drag top handle to rotate 360°)"
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <RotateCw size={12} className="text-primary" />
            <span>Rotate 90°</span>
            {currentRotation !== 0 && (
              <span className="rounded bg-stone-100 px-1 py-0.2 text-[10px] font-mono text-stone-600">
                {currentRotation}°
              </span>
            )}
          </button>

          <div className="h-3.5 w-px bg-stone-200" />

          {/* Delete Action */}
          <button
            type="button"
            onClick={() => onDelete(table.id)}
            title="Delete table"
            className="flex size-6 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}

      {/* Rotating Table Container */}
      <div
        className="relative size-full select-none will-change-transform"
        style={{
          transform: `rotate(${currentRotation}deg)`,
          transformOrigin: 'center center',
        }}
      >
        {/* Table Image Container with Selection Card Style */}
        <div
          className={cn(
            'relative flex size-full items-center justify-center p-1.5 rounded-2xl transition-colors',
            isSelected
              ? 'ring-2 ring-primary ring-offset-2 ring-offset-[#ecebe8] bg-primary/10 shadow-sm'
              : 'hover:bg-black/5 ring-1.5 ring-stone-300/60',
          )}
        >
          <img
            src={TABLE_IMAGE_MAP[table.templateType || 'table1'] || table1}
            alt={table.name}
            className="size-full object-contain pointer-events-none"
          />
        </div>

        {/* Resize Handle (Bottom-Right corner of table, rotates along with table) */}
        {isSelected && !isDragging && !isRotating && (
          <div
            data-action="resize"
            onPointerDown={handleResizePointerDown}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
            title={`Drag to resize (Min: ${DEFAULT_TABLE_SIZE}px)`}
            className={cn(
              'absolute -bottom-2 -right-2 z-40 flex size-6 cursor-se-resize items-center justify-center rounded-full bg-white text-primary ring-2 ring-primary shadow-md select-none',
              !isResizing && 'hover:scale-125 transition-transform',
            )}
          >
            <Maximize2 size={12} />
          </div>
        )}

        {/* 360° Rotate Handle (Attached to top of table, rotates along with table orientation) */}
        {isSelected && !isDragging && !isResizing && (
          <div
            data-action="rotate"
            onPointerDown={handleRotatePointerDown}
            onPointerMove={handleRotatePointerMove}
            onPointerUp={handleRotatePointerUp}
            title={`Drag to rotate 360° (${currentRotation}°) • Hold Shift to snap 15°`}
            className="absolute -top-7 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center cursor-grab active:cursor-grabbing select-none"
          >
            <div
              className={cn(
                'flex size-6 items-center justify-center rounded-full bg-white text-primary ring-2 ring-primary shadow-md select-none',
                !isRotating && 'hover:scale-125 transition-transform',
              )}
            >
              <RotateCw size={12} />
            </div>
            <div className="h-1.5 w-0.5 bg-primary" />
          </div>
        )}
      </div>

      {/* Live Size Badge (shown while actively resizing) */}
      {isResizing && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-50 rounded-md bg-stone-900 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs select-none">
          {currentSize}px
        </div>
      )}

      {/* Live Rotation Angle Badge (shown while actively rotating 360°) */}
      {isRotating && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 rounded-full bg-stone-900/90 px-2.5 py-0.5 text-xs font-bold text-white shadow-lg backdrop-blur-xs pointer-events-none select-none">
          <RotateCw size={11} className="text-primary" />
          <span>{currentRotation}°</span>
        </div>
      )}

      {/* Table Name Label & Status Capsule (Always kept upright & centered on table surface) */}
      <div
        data-action="rename"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-1 select-none pointer-events-auto"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {isEditingName ? (
          <div className="flex items-center gap-1 rounded-xl bg-white p-1 shadow-lg border border-primary ring-2 ring-primary/20 animate-pop-in">
            <input
              ref={inputRef}
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="w-24 rounded-lg px-2 py-1 text-center text-xs font-bold text-stone-900 outline-none bg-stone-50 focus:bg-white"
              maxLength={24}
              placeholder="Table name..."
            />
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                handleSave()
              }}
              className="flex size-6 items-center justify-center rounded-lg bg-primary text-white hover:bg-primary/90 cursor-pointer shadow-xs"
              title="Save"
            >
              <Check size={12} />
            </button>
          </div>
        ) : (
          <div className="relative">
            {/* Ultra-Compact Minimalist Pill */}
            <div
              onClick={(e) => {
                e.stopPropagation()
                onSelect(table.id)
                setIsBadgeMenuOpen((prev) => !prev)
              }}
              onDoubleClick={(e) => {
                e.stopPropagation()
                onStartRename(table.id)
              }}
              className={cn(
                'group/badge flex items-center gap-1.5 rounded-full px-2.5 py-1 shadow-md border backdrop-blur-md transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-105 active:scale-95 bg-white/95 border-stone-200/90 hover:border-primary/40 select-none',
                isSelected && 'ring-2 ring-primary/40 border-primary/60 shadow-lg',
              )}
              title={`${table.name} • ${statusConfig.label}${table.customerCount ? ` • ${table.customerCount} guests` : ''} (Click to change status • Double click to rename)`}
            >
              {/* Glowing Status Dot */}
              <span className="relative flex size-2 shrink-0 items-center justify-center">
                {currentStatus === 'waiting_food' && (
                  <span
                    className={cn(
                      'absolute inline-flex size-full animate-ping rounded-full opacity-75',
                      statusConfig.dotColor,
                    )}
                  />
                )}
                <span
                  className={cn(
                    'size-2 rounded-full ring-1.5 ring-white shadow-2xs',
                    statusConfig.dotColor,
                  )}
                />
              </span>

              {/* Table Name */}
              <span className="text-xs font-bold text-stone-800 tracking-tight whitespace-nowrap">
                {table.name}
              </span>

              {/* Guest Count (Compact count if > 0) */}
              {table.customerCount ? (
                <span className="text-[10px] font-semibold text-stone-400 whitespace-nowrap">
                  · {table.customerCount}
                </span>
              ) : null}
            </div>

            {/* Quick Status Dropdown Menu directly from badge */}
            {isBadgeMenuOpen && (
              <div
                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 flex w-44 flex-col rounded-xl bg-white p-1.5 shadow-2xl border border-stone-200/90 animate-pop-in whitespace-nowrap"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Table Status
                </div>
                {ALL_TABLE_STATUSES.map((stKey) => {
                  const stCfg = TABLE_STATUS_CONFIG[stKey]
                  const isCurrent = stKey === currentStatus
                  return (
                    <button
                      key={stKey}
                      type="button"
                      onClick={() => {
                        onUpdateStatus(table.id, stKey)
                        setIsBadgeMenuOpen(false)
                      }}
                      className={cn(
                        'flex items-center justify-between rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors cursor-pointer text-left',
                        isCurrent
                          ? 'bg-stone-100 text-stone-900 font-bold'
                          : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className={cn('size-2 rounded-full shrink-0', stCfg.dotColor)} />
                        <span>{stCfg.label}</span>
                      </div>
                      {isCurrent && <Check size={12} className="text-primary" />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
})

PlacedTableItem.displayName = 'PlacedTableItem'

export default PlacedTableItem
