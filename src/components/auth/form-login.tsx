import { ArrowRight, Eye, EyeOff, User, Lock } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

const FormLogin = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  return (
    <form
      className="flex flex-col gap-4 z-20 relative"
      onSubmit={(e) => e.preventDefault()}
    >
      {/* Email / Username */}
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-400">
          <User size={18} />
        </span>
        <input
          type="text"
          placeholder="Email or Username"
          className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-11 text-sm text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Password */}
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-400">
          <Lock size={18} />
        </span>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-11 pl-11 text-sm text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Remember me & Forgot password */}
      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary"
          />
          Remember me
        </label>
        <a
          href="#"
          className="text-sm text-gray-500 transition-colors hover:text-primary"
        >
          Forgot password?
        </a>
      </div>

      {/* Sign In Button */}
      <button
        onClick={() => navigate({ to: '/' })}
        type="submit"
        className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-3.5 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
      >
        Sign In
        <ArrowRight size={16} />
      </button>
    </form>
  )
}

export default FormLogin
