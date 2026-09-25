import { logo2 } from '@/assets'
import { useState, useEffect } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { UtensilsCrossed, Grid2X2, ShoppingBag, Receipt } from 'lucide-react'
import { cn } from '#/utils/styles'
import HeaderNotification from './header-notification'
import HeaderUser from './header-user'

const navbar = [
  {
    id: 1,
    name: 'Menus',
    path: '/' as const,
    icon: UtensilsCrossed,
  },
  {
    id: 2,
    name: 'Tables',
    path: '/tables' as const,
    icon: Grid2X2,
  },
  {
    id: 3,
    name: 'Orders',
    path: '/orders' as const,
    icon: ShoppingBag,
  },
  {
    id: 4,
    name: 'Transactions',
    path: '/transactions' as const,
    icon: Receipt,
  },
]

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const { pathname } = useLocation()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <header className="flex justify-between items-center p-4 md:py-3 md:px-6">
      <div className="flex items-center">
        <Link to="/" className="cursor-pointer">
          <img src={logo2} alt="logo" className="h-14" />
        </Link>
      </div>

      {/* Center Navigation Tabs */}
      <nav
        className="flex items-center gap-1 px-2"
        role="tablist"
        aria-label="Main Navigation Tabs"
      >
        {navbar.map((item) => {
          const Icon = item.icon
          const isActive =
            item.path === '/'
              ? pathname === '/'
              : pathname.startsWith(item.path)

          return (
            <Link
              key={item.id}
              to={item.path}
              role="tab"
              aria-selected={isActive}
              className={cn(
                'group relative flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer -mb-px rounded-t-lg',
                isActive
                  ? 'text-primary font-bold'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-200/50',
              )}
            >
              <Icon
                size={18}
                className={cn(
                  'transition-colors duration-200',
                  isActive
                    ? 'text-primary'
                    : 'text-stone-400 group-hover:text-stone-700',
                )}
              />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Right Section */}
      <div className="flex items-center gap-5">
        {/* Time & Date */}
        <div className="hidden sm:block text-right">
          <p className="text-sm font-semibold text-gray-800 leading-tight">
            {formattedTime}
          </p>
          <p className="text-xs text-gray-400">{formattedDate}</p>
        </div>

        <div className="hidden sm:block h-8 w-px bg-gray-200" />

        <HeaderNotification />

        <div className="h-8 w-px bg-gray-200" />

        <HeaderUser />
      </div>
    </header>
  )
}

export default Header
