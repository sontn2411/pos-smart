import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useTableCanvas } from '@/hooks/use-table-canvas'

type TableCanvasContextType = ReturnType<typeof useTableCanvas>

const TableCanvasContext = createContext<TableCanvasContextType | null>(null)

interface TableCanvasProviderProps {
  children: ReactNode
  tableSize?: number
}

export const TableCanvasProvider = ({
  children,
  tableSize,
}: TableCanvasProviderProps) => {
  const canvasState = useTableCanvas({ tableSize })

  return (
    <TableCanvasContext.Provider value={canvasState}>
      {children}
    </TableCanvasContext.Provider>
  )
}

export const useTableCanvasContext = () => {
  const context = useContext(TableCanvasContext)
  if (!context) {
    throw new Error(
      'useTableCanvasContext must be used within a TableCanvasProvider',
    )
  }
  return context
}
