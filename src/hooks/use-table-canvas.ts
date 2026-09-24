import { useState, useRef, useCallback } from 'react'
import type { PlacedTable, TableStatus } from '@/types/table'
import { INITIAL_MOCK_TABLES } from '@/data/mock-tables'

export const DEFAULT_TABLE_SIZE = 120
export const FLOOR_WIDTH = 1000
export const FLOOR_HEIGHT = 700
export const TABLES_STORAGE_KEY = 'pos_smart_tables'

function loadInitialTables(fallback: PlacedTable[]): PlacedTable[] {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(TABLES_STORAGE_KEY)
    if (raw !== null) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
    // First time: not present in localStorage -> store mock data and return it
    window.localStorage.setItem(TABLES_STORAGE_KEY, JSON.stringify(fallback))
    return fallback
  } catch (error) {
    console.error('Failed to read tables from localStorage:', error)
    return fallback
  }
}

interface UseTableCanvasOptions {
  tableSize?: number
  initialTables?: PlacedTable[]
}

export function useTableCanvas(options: UseTableCanvasOptions = {}) {
  const { tableSize = DEFAULT_TABLE_SIZE, initialTables = INITIAL_MOCK_TABLES } =
    options

  const [tables, setTables] = useState<PlacedTable[]>(() =>
    loadInitialTables(initialTables),
  )
  const [zoom, setZoom] = useState(1)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSavedFeedback, setIsSavedFeedback] = useState(false)

  // Manual save to localStorage handler
  const handleSaveToStorage = useCallback(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(TABLES_STORAGE_KEY, JSON.stringify(tables))
      setHasUnsavedChanges(false)
      setIsSavedFeedback(true)
      setTimeout(() => setIsSavedFeedback(false), 2000)
    } catch (error) {
      console.error('Failed to save tables to localStorage:', error)
    }
  }, [tables])

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return false
    }
    return true
  })
  const [statusFilter, setStatusFilter] = useState<TableStatus | 'all'>('all')
  const [isDragOver, setIsDragOver] = useState(false)
  const [draggingTableId, setDraggingTableId] = useState<string | null>(null)
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null)
  const [editingTableId, setEditingTableId] = useState<string | null>(null)

  const canvasRef = useRef<HTMLDivElement>(null)
  const canvasRectRef = useRef<DOMRect | null>(null)
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const dragRafRef = useRef<number | null>(null)
  const resizeRafRef = useRef<number | null>(null)
  const rotateRafRef = useRef<number | null>(null)
  const pendingDragRef = useRef<{ id: string; x: number; y: number } | null>(null)
  const pendingResizeRef = useRef<{ id: string; size: number } | null>(null)
  const pendingRotateRef = useRef<{ id: string; rotation: number } | null>(null)

  // Handle drag start from template sidebar
  const handleTemplateDragStart = useCallback(
    (e: React.DragEvent, templateType: string = 'table1') => {
      e.dataTransfer.setData('text/plain', templateType)
      e.dataTransfer.effectAllowed = 'copy'
    },
    [],
  )

  // Handle drag over the canvas drop zone
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setIsDragOver(true)
  }, [])

  // Handle drag leave drop zone
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return
    setIsDragOver(false)
  }, [])

  // Handle drop table onto canvas
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      if (!canvasRef.current) return
      const rect = canvasRef.current.getBoundingClientRect()
      const templateType = e.dataTransfer.getData('text/plain') || 'table1'

      const rawX = (e.clientX - rect.left) / zoom - tableSize / 2
      const rawY = (e.clientY - rect.top) / zoom - tableSize / 2

      const maxX = canvasRef.current.offsetWidth || 840
      const maxY = canvasRef.current.offsetHeight || 600

      const x = Math.max(12, Math.min(maxX - tableSize - 12, rawX))
      const y = Math.max(28, Math.min(maxY - tableSize - 36, rawY))

      const newTable: PlacedTable = {
        id: `table_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: `Table ${tables.length + 1}`,
        x,
        y,
        size: tableSize,
        templateType,
        status: 'available',
      }

      setTables((prev) => [...prev, newTable])
      setSelectedTableId(newTable.id)
      setEditingTableId(newTable.id)
      setHasUnsavedChanges(true)
    },
    [tableSize, tables.length, zoom],
  )

  // Quick add table to canvas without dragging
  const handleQuickAdd = useCallback(
    (templateType: string = 'table1') => {
      if (!canvasRef.current) return

      const maxX = canvasRef.current.offsetWidth || 840
      const maxY = canvasRef.current.offsetHeight || 600
      const offset = (tables.length % 6) * 28
      const x = Math.max(20, Math.min(maxX - tableSize - 20, 40 + offset))
      const y = Math.max(32, Math.min(maxY - tableSize - 40, 40 + offset))

      const newTable: PlacedTable = {
        id: `table_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: `Table ${tables.length + 1}`,
        x,
        y,
        size: tableSize,
        templateType,
        status: 'available',
      }

      setTables((prev) => [...prev, newTable])
      setSelectedTableId(newTable.id)
      setEditingTableId(newTable.id)
      setHasUnsavedChanges(true)
    },
    [tableSize, tables.length],
  )

  // Pointer down on a placed table to start moving
  const handlePointerDown = useCallback(
    (e: React.PointerEvent, table: PlacedTable) => {
      if ((e.target as HTMLElement).closest('[data-action="delete"]')) return
      if ((e.target as HTMLElement).closest('[data-action="rename"]')) return
      if ((e.target as HTMLElement).closest('[data-action="resize"]')) return
      if ((e.target as HTMLElement).closest('[data-action="rotate"]')) return

      e.preventDefault()
      e.currentTarget.setPointerCapture(e.pointerId)
      setDraggingTableId(table.id)
      setSelectedTableId(table.id)

      if (!canvasRef.current) return
      // Cache the bounding rect once on pointer down to eliminate layout thrashing during drag
      const rect = canvasRef.current.getBoundingClientRect()
      canvasRectRef.current = rect
      dragOffsetRef.current = {
        x: (e.clientX - rect.left) / zoom - table.x,
        y: (e.clientY - rect.top) / zoom - table.y,
      }
    },
    [zoom],
  )

  // Pointer move while dragging placed table - non-cancelling rAF pattern for smooth 60/120fps
  const handlePointerMove = useCallback(
    (e: React.PointerEvent, tableId: string) => {
      if (draggingTableId !== tableId) return

      if (!canvasRectRef.current && canvasRef.current) {
        canvasRectRef.current = canvasRef.current.getBoundingClientRect()
      }
      const rect = canvasRectRef.current
      if (!rect) return

      const rawX = (e.clientX - rect.left) / zoom - dragOffsetRef.current.x
      const rawY = (e.clientY - rect.top) / zoom - dragOffsetRef.current.y
      pendingDragRef.current = { id: tableId, x: rawX, y: rawY }

      if (dragRafRef.current === null) {
        dragRafRef.current = requestAnimationFrame(() => {
          dragRafRef.current = null
          const update = pendingDragRef.current
          if (!update) return

          setTables((prev) => {
            const target = prev.find((t) => t.id === update.id)
            if (!target) return prev
            const curSize = target.size ?? tableSize
            const maxX = canvasRef.current?.offsetWidth ?? 840
            const maxY = canvasRef.current?.offsetHeight ?? 600
            const x = Math.max(12, Math.min(maxX - curSize - 12, update.x))
            const y = Math.max(28, Math.min(maxY - curSize - 36, update.y))
            if (target.x === x && target.y === y) return prev
            setHasUnsavedChanges(true)
            return prev.map((t) => (t.id === update.id ? { ...t, x, y } : t))
          })
        })
      }
    },
    [draggingTableId, tableSize, zoom],
  )

  // Pointer up after dragging placed table
  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (dragRafRef.current) {
        cancelAnimationFrame(dragRafRef.current)
        dragRafRef.current = null
      }

      // Apply any final pending update
      if (pendingDragRef.current) {
        const update = pendingDragRef.current
        pendingDragRef.current = null

        setTables((prev) => {
          const target = prev.find((t) => t.id === update.id)
          if (!target) return prev
          const curSize = target.size ?? tableSize
          const maxX = canvasRef.current?.offsetWidth ?? 840
          const maxY = canvasRef.current?.offsetHeight ?? 600
          const x = Math.max(12, Math.min(maxX - curSize - 12, update.x))
          const y = Math.max(28, Math.min(maxY - curSize - 36, update.y))
          if (target.x === x && target.y === y) return prev
          return prev.map((t) => (t.id === update.id ? { ...t, x, y } : t))
        })
      }
      canvasRectRef.current = null

      if (draggingTableId) {
        try {
          e.currentTarget.releasePointerCapture(e.pointerId)
        } catch {
          // ignore
        }
        setDraggingTableId(null)
      }
    },
    [draggingTableId, tableSize],
  )

  // Resize table: non-cancelling rAF pattern, minimum DEFAULT_TABLE_SIZE (120)
  const handleResizeTable = useCallback((id: string, newSize: number) => {
    pendingResizeRef.current = { id, size: newSize }

    if (resizeRafRef.current === null) {
      resizeRafRef.current = requestAnimationFrame(() => {
        resizeRafRef.current = null
        const update = pendingResizeRef.current
        if (!update) return

        const currentRect =
          canvasRectRef.current ?? canvasRef.current?.getBoundingClientRect()
        if (!currentRect) return
        const canvasWidth = currentRect.width
        const canvasHeight = currentRect.height

        setTables((prev) => {
          const target = prev.find((t) => t.id === update.id)
          if (!target) return prev
          const maxAllowed = Math.min(
            canvasWidth - target.x - 12,
            canvasHeight - target.y - 36,
          )
          const clamped = Math.max(
            DEFAULT_TABLE_SIZE,
            Math.min(maxAllowed, Math.round(update.size)),
          )
          if (target.size === clamped) return prev
          setHasUnsavedChanges(true)
          return prev.map((t) => (t.id === update.id ? { ...t, size: clamped } : t))
        })
      })
    }
  }, [])

  // Rotate table 360 degrees: non-cancelling rAF pattern, normalizes angle between 0 and 359
  const handleRotateTable = useCallback((id: string, newRotation: number) => {
    const normalized = ((Math.round(newRotation) % 360) + 360) % 360
    pendingRotateRef.current = { id, rotation: normalized }

    if (rotateRafRef.current === null) {
      rotateRafRef.current = requestAnimationFrame(() => {
        rotateRafRef.current = null
        const update = pendingRotateRef.current
        if (!update) return

        setTables((prev) => {
          const target = prev.find((t) => t.id === update.id)
          if (!target || target.rotation === update.rotation) return prev
          setHasUnsavedChanges(true)
          return prev.map((t) =>
            t.id === update.id ? { ...t, rotation: update.rotation } : t,
          )
        })
      })
    }
  }, [])

  // Update table name
  const handleUpdateTableName = useCallback((id: string, newName: string) => {
    const trimmed = newName.trim()
    if (!trimmed) return
    setTables((prev) =>
      prev.map((t) => (t.id === id ? { ...t, name: trimmed } : t)),
    )
    setEditingTableId(null)
    setHasUnsavedChanges(true)
  }, [])

  // Delete a specific table
  const handleDeleteTable = useCallback((id: string) => {
    setTables((prev) => prev.filter((t) => t.id !== id))
    setSelectedTableId((prev) => (prev === id ? null : prev))
    setEditingTableId((prev) => (prev === id ? null : prev))
    setHasUnsavedChanges(true)
  }, [])

  // Clear all tables
  const handleClearAll = useCallback(() => {
    setTables([])
    setSelectedTableId(null)
    setEditingTableId(null)
    setHasUnsavedChanges(true)
  }, [])

  // Reset to initial mock tables
  const handleResetDefault = useCallback(() => {
    setTables(INITIAL_MOCK_TABLES)
    setSelectedTableId(null)
    setEditingTableId(null)
    setHasUnsavedChanges(true)
  }, [])

  // Update table status
  const handleUpdateTableStatus = useCallback(
    (id: string, newStatus: TableStatus) => {
      setTables((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)),
      )
      setHasUnsavedChanges(true)
    },
    [],
  )

  // Toggle sidebar open/close
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev)
  }, [])

  return {
    canvasRef,
    tables,
    tableSize,
    isDragOver,
    draggingTableId,
    selectedTableId,
    editingTableId,
    setSelectedTableId,
    setEditingTableId,
    handleTemplateDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleQuickAdd,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
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
    setIsSidebarOpen,
    toggleSidebar,
    handleSaveToStorage,
    hasUnsavedChanges,
    isSavedFeedback,
    zoom,
    setZoom,
    floorWidth: FLOOR_WIDTH,
    floorHeight: FLOOR_HEIGHT,
  }
}
