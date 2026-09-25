import LayoutRoot from '#/components/layout/layout-root'
import Menu from '#/components/menu/menus'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <LayoutRoot>
      <Menu />
    </LayoutRoot>
  )
}
