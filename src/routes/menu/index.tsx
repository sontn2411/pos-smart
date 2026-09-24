import { table1 } from '#/assets'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/menu/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <img
        src={table1}
        className="w-24 h-24"
        style={{
          filter:
            'invert(52%) sepia(85%) saturate(442%) hue-rotate(113deg) brightness(96%) contrast(89%)',
        }}
      />

      <img
        src={table1}
        className="w-24 h-24"
        style={{
          filter:
            'invert(47%) sepia(74%) saturate(2225%) hue-rotate(200deg) brightness(99%) contrast(97%)',
        }}
      />
    </div>
  )
}
