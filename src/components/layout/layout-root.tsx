import type { ReactNode } from 'react'
import { Outlet } from '@tanstack/react-router'
import Header from './header'
import { cn } from '#/utils/styles'

export interface LayoutRootProps {
  children?: ReactNode
  className?: string
  mainClassName?: string
}

export const LayoutRoot = ({
  children,
  className,
  mainClassName,
}: LayoutRootProps) => {
  return (
    <div
      className={cn(
        'flex h-screen w-screen flex-col overflow-hidden bg-[#f5f3ef]',
        className,
      )}
    >
      <div className="shrink-0">
        <Header />
      </div>

      <main
        className={cn(
          'flex-1 overflow-hidden p-4 md:py-3 md:px-6',
          mainClassName,
        )}
      >
        {children ?? <Outlet />}
      </main>
    </div>
  )
}

export default LayoutRoot
