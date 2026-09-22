import { createFileRoute } from '@tanstack/react-router'

import LeftAuth from '#/components/auth/left-auth'
import RightAuth from '#/components/auth/right-auth'

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
      <LeftAuth />
      <RightAuth />
    </div>
  )
}
