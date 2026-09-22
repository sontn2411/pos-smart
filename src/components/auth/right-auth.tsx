import { logo2, vector1, vector2 } from '@/assets'
import { Globe, Headset } from 'lucide-react'
import FormLogin from './form-login'
import Select from '#/components/common/select'

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'vi', label: 'Tiếng Việt' },
]

const RightAuth = () => {
  return (
    <div className="relative flex h-full w-full flex-col">
      <div className=" absolute left-0 bottom-0 opacity-20">
        <img src={vector1} alt="vector" className=" " />
      </div>
      <div className=" absolute right-0 top-0 opacity-20">
        <img src={vector2} alt="vector" className=" h-72 " />
      </div>

      {/* Language Selector - Top Right */}
      <div className="flex justify-end px-5 pt-4 md:px-8 md:pt-6 z-30">
        <Select
          options={languageOptions}
          defaultValue="en"
          icon={<Globe size={16} />}
          size="sm"
          variant="ghost"
        />
      </div>

      {/* Form Content - Center */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xl px-6 md:px-14">
          {/* Logo */}
          <div className="mb-8">
            <img src={logo2} alt="POS Smart" className="h-10 md:h-14" />
          </div>

          {/* Heading */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Sign in to your POS Smart account to continue
            </p>
          </div>

          <FormLogin />
        </div>
      </div>

      {/* Footer - Bottom */}
      <div className="flex flex-col items-center gap-3 z-20 relative sm:flex-row sm:justify-between max-w-xl mx-auto w-full px-6 pb-4 md:px-8 md:pb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Headset size={18} className="text-gray-400" />
          <div>
            <span>Need help?</span>
            <br />
            <a
              href="#"
              className="font-medium text-primary transition-colors hover:text-primary/80"
            >
              Contact support
            </a>
          </div>
        </div>
        <span className="text-sm text-gray-400">v1.0.0</span>
      </div>
    </div>
  )
}

export default RightAuth
