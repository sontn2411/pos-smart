import { ChevronDown } from 'lucide-react'

const HeaderUser = () => {
  return (
    <button
      type="button"
      className="flex cursor-pointer items-center gap-3 rounded-lg py-1 pr-1 pl-1 transition-colors hover:bg-gray-50"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
        JD
      </div>
      <div className="hidden sm:block text-left">
        <p className="text-sm font-semibold leading-tight text-gray-800">
          John Doe
        </p>
        <p className="text-xs text-gray-400">Cashier</p>
      </div>
      <ChevronDown size={14} className="text-gray-400" />
    </button>
  )
}

export default HeaderUser
