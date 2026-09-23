import Header from '#/components/layout/header'
import Menu from '#/components/menu/menus'

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#f5f3ef]">
      <div className="shrink-0">
        <Header />
      </div>

      <main className="flex-1 overflow-hidden p-4 md:py-3 md:px-6">
        <Menu />
      </main>
    </div>
  )
}
