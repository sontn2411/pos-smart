import { logo2 } from '@/assets'
import { useState, useEffect } from 'react'
import HeaderNotification from './header-notification'
import HeaderUser from './header-user'

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

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
    <header className="flex justify-between items-center p-4 md:py-3 md:px-6 ">
      <div>
        <img src={logo2} alt="logo" className="h-14" />
      </div>

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
