import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useTableCanvasContext } from '@/contexts/table-canvas-context'
import {
  Plus,
  Trash2,
  Move,
  RotateCcw,
  PanelLeftClose,
  PanelLeftOpen,
  Save,
  Check,
} from 'lucide-react'
import { cn } from '#/utils/styles'
import PlacedTableItem from './placed-table-item'
import {
  TABLE_STATUS_CONFIG,
  ALL_TABLE_STATUSES,
} from '@/constants/table-status'

const FloorPlanCanvas = () => {
  const {
    canvasRef,
    tables,
    tableSize,
    isDragOver,
    draggingTableId,
    selectedTableId,
    editingTableId,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    setSelectedTableId,
    setEditingTableId,
    handleResizeTable,
    handleRotateTable,
    handleUpdateTableName,
    handleDeleteTable,
    handleClearAll,
    handleResetDefault,
    handleUpdateTableStatus,
    statusFilter,
    setStatusFilter,
    isSidebarOpen,
    toggleSidebar,
    handleSaveToStorage,
    hasUnsavedChanges,
    isSavedFeedback,
    zoom,
    setZoom,
  } = useTableCanvasContext()

  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)

  const handleStartRename = useCallback(
    (id: string) => setEditingTableId(id),
    [setEditingTableId],
  )

  const handleCancelRename = useCallback(
    () => setEditingTableId(null),
    [setEditingTableId],
  )

  // Track container dimensions to auto scale on mobile / small screen sizes
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const update = () => {
      setContainerWidth(container.clientWidth)
      setContainerHeight(container.clientHeight)
    }
    update()

    const ro = new ResizeObserver(update)
    ro.observe(container)
    return () => ro.disconnect()
  }, [])

  // Calculate floor plan bounding dimensions to fit all tables comfortably
  const contentBounds = useMemo(() => {
    const minW = 840
    const minH = 580
    let maxX = minW
    let maxY = minH
    for (const t of tables) {
      const s = t.size ?? tableSize
      if (t.x + s + 40 > maxX) maxX = t.x + s + 40
      if (t.y + s + 40 > maxY) maxY = t.y + s + 40
    }
    return { width: maxX, height: maxY }
  }, [tables, tableSize])

  // Responsive Auto-Scale:
  // - Desktop: scale = 1, canvas expands full width/height naturally
  // - Mobile: auto scales down proportionally to fit the screen width
  const isScaled = containerWidth > 0 && containerWidth < contentBounds.width
  const autoScale = isScaled
    ? Math.max(0.35, Math.min(1, containerWidth / contentBounds.width))
    : 1

  useEffect(() => {
    setZoom(autoScale)
  }, [autoScale, setZoom])

  // Count tables by status for the quick filter bar
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: tables.length }
    for (const t of tables) {
      const st = t.status || 'available'
      counts[st] = (counts[st] || 0) + 1
    }
    return counts
  }, [tables])

  return (
    <section className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-xs border border-stone-200/80">
      {/* Canvas Header / Actions Toolbar */}
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleSidebar}
            title={
              isSidebarOpen
                ? 'Collapse templates sidebar'
                : 'Expand templates sidebar'
            }
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer shadow-2xs',
              isSidebarOpen
                ? 'bg-white border border-stone-200/90 text-stone-700 hover:bg-stone-50'
                : 'bg-primary text-white hover:bg-primary/95 shadow-xs',
            )}
          >
            {isSidebarOpen ? (
              <>
                <PanelLeftClose size={14} />
                <span>Hide Templates</span>
              </>
            ) : (
              <>
                <PanelLeftOpen size={14} />
                <span>Add Tables</span>
              </>
            )}
          </button>

          <div className="h-4 w-px bg-stone-300" />

          <h1 className="text-base font-bold text-stone-900">Floor Plan</h1>
          <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-600">
            {tables.length} {tables.length === 1 ? 'table' : 'tables'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Save Layout Button */}
          <button
            type="button"
            onClick={handleSaveToStorage}
            title={
              hasUnsavedChanges
                ? 'Save changes to storage'
                : 'All changes saved'
            }
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs',
              isSavedFeedback
                ? 'bg-emerald-600 text-white'
                : hasUnsavedChanges
                  ? 'bg-primary text-white hover:bg-primary/90 ring-2 ring-primary/30'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50',
            )}
          >
            {isSavedFeedback ? (
              <>
                <Check size={13} className="text-white" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save
                  size={13}
                  className={
                    hasUnsavedChanges ? 'text-white' : 'text-stone-500'
                  }
                />
                <span>Save</span>
                {hasUnsavedChanges && (
                  <span className="size-1.5 rounded-full bg-amber-300 animate-ping" />
                )}
              </>
            )}
          </button>

          <div className="h-4 w-px bg-stone-300" />

          <button
            type="button"
            onClick={handleResetDefault}
            title="Reset to default sample floor plan"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Sample</span>
          </button>

          {tables.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Trash2 size={13} />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Status Filter / Legend Bar */}
      <div className="flex items-center gap-1.5 px-5 py-2 overflow-x-auto custom-scrollbar border-t border-stone-200/60 bg-stone-50/70 select-none">
        <span className="text-[11px] font-bold text-stone-400 mr-1 uppercase tracking-wider shrink-0">
          Filter:
        </span>

        {/* All Filter */}
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0',
            statusFilter === 'all'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100',
          )}
        >
          <span>All</span>
          <span
            className={cn(
              'rounded-full px-1.5 py-0.2 text-[10px] font-bold',
              statusFilter === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-stone-100 text-stone-600',
            )}
          >
            {statusCounts.all || 0}
          </span>
        </button>

        {/* Individual Status Filters */}
        {ALL_TABLE_STATUSES.map((stKey) => {
          const cfg = TABLE_STATUS_CONFIG[stKey]
          const count = statusCounts[stKey] || 0
          const isSelected = statusFilter === stKey
          return (
            <button
              key={stKey}
              type="button"
              onClick={() => setStatusFilter(isSelected ? 'all' : stKey)}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 border',
                isSelected
                  ? cn(cfg.badgeBg, 'text-white border-transparent shadow-xs')
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100',
              )}
            >
              <span
                className={cn(
                  'size-2 rounded-full shrink-0',
                  isSelected ? 'bg-white' : cfg.dotColor,
                )}
              />
              <span>{cfg.shortLabel}</span>
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.2 text-[10px] font-bold',
                  isSelected
                    ? 'bg-white/25 text-white'
                    : 'bg-stone-100 text-stone-600',
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Canvas Viewport with Auto-Scale for Mobile & Smooth Touch Scroll */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-auto custom-scrollbar select-none bg-[#ecebe8] [background-size:24px_24px] bg-[radial-gradient(#d3d1cc_1.2px,transparent_1.2px)]"
        style={{ touchAction: 'pan-x pan-y' }}
      >
        <div
          style={
            isScaled
              ? {
                  width: `${contentBounds.width * zoom}px`,
                  height: `${Math.max(contentBounds.height, Math.round(containerHeight / zoom)) * zoom}px`,
                }
              : undefined
          }
          className={cn(
            'relative',
            !isScaled && 'w-full h-full min-w-full min-h-full',
          )}
        >
          {/* Restaurant Floor Plan Surface */}
          <div
            ref={canvasRef}
            onClick={() => setSelectedTableId(null)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={
              isScaled
                ? {
                    width: `${contentBounds.width}px`,
                    height: `${Math.max(contentBounds.height, Math.round(containerHeight / zoom))}px`,
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top left',
                  }
                : undefined
            }
            className={cn(
              'relative select-none transition-[border-color,background-color]',
              !isScaled && 'w-full h-full min-w-full min-h-full',
            )}
          >
            {/* Quick Open Templates floating button on canvas when sidebar is collapsed */}
            {/* {!isSidebarOpen && (
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                title="Open table templates sidebar"
                className="absolute left-3 top-3.5 z-20 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 text-xs font-bold text-stone-800 shadow-md border border-stone-200/90 hover:bg-white hover:text-primary hover:border-primary/50 transition-all cursor-pointer animate-pop-in backdrop-blur-xs"
              >
                <LayoutGrid size={15} className="text-primary" />
                <span>Templates</span>
                <span className="rounded-full bg-primary/10 px-1.5 py-0.2 text-[10px] font-bold text-primary">
                  7
                </span>
              </button>
            )} */}

            {/* Drag Over Overlay Alert */}
            {isDragOver && (
              <div className="pointer-events-none absolute inset-3 z-30 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary bg-primary/10 backdrop-blur-[1px] transition-all">
                <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/95 px-6 py-4 shadow-lg text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Plus size={24} className="animate-bounce" />
                  </div>
                  <p className="text-sm font-bold text-stone-900">
                    Drop table here
                  </p>
                  <p className="text-xs text-stone-500">
                    Table will be placed at this position
                  </p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {tables.length === 0 && !isDragOver && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-white/80 shadow-2xs text-stone-400 mb-3">
                  <Move size={24} />
                </div>
                <h3 className="text-sm font-bold text-stone-800">
                  Floor plan is empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mt-1">
                  Drag a table template from the left sidebar or load the sample
                  floor plan.
                </p>
                <button
                  type="button"
                  onClick={handleResetDefault}
                  className="pointer-events-auto mt-4 flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-primary shadow-xs border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Load Sample Floor Plan</span>
                </button>
              </div>
            )}

            {/* Placed Tables */}
            {tables.map((table) => (
              <PlacedTableItem
                key={table.id}
                table={table}
                tableSize={tableSize}
                canvasWidth={
                  isScaled ? contentBounds.width : containerWidth || 840
                }
                zoom={zoom}
                isDragging={draggingTableId === table.id}
                isSelected={selectedTableId === table.id}
                isEditingName={editingTableId === table.id}
                isFilteredOut={
                  statusFilter !== 'all' &&
                  (table.status || 'available') !== statusFilter
                }
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onResize={handleResizeTable}
                onRotate={handleRotateTable}
                onUpdateStatus={handleUpdateTableStatus}
                onSelect={setSelectedTableId}
                onStartRename={handleStartRename}
                onSaveRename={handleUpdateTableName}
                onCancelRename={handleCancelRename}
                onDelete={handleDeleteTable}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FloorPlanCanvas
