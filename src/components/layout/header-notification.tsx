import { Bell } from 'lucide-react'

const HeaderNotification = () => {
  return (
    <button
      type="button"
      className="relative cursor-pointer rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
    >
      <Bell size={20} />
      <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
    </button>
  )
}

export default HeaderNotification
