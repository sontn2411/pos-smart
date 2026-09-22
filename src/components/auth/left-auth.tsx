import { bgAuth, logo1 } from '@/assets'
import { Heart, ShieldCheck, Zap } from 'lucide-react'

const data = {
  title: 'Smarter POS for Better Business',
  desc: 'Streamline your orders, manage your tables, and grow your restaurant - all in one place.',
  footer: [
    {
      id: 1,
      title: 'Fast & Reliable',
      desc: 'Process orders quickly. Keep your service smooth',
      icon: Zap,
    },
    {
      id: 2,
      title: 'Secure',
      desc: 'Your data and transactions are always protected.',
      icon: ShieldCheck,
    },
    {
      id: 3,
      title: 'Built for F&B',
      desc: 'Designed for restaurants, cafes, and bars.',
      icon: Heart,
    },
  ],
}

const LeftAuth = () => {
  return (
    <div
      className="relative hidden h-full w-full items-center justify-center bg-cover bg-center bg-no-repeat lg:flex"
      style={{ backgroundImage: `url(${bgAuth})` }}
    >
      <div className="flex h-full w-full flex-col justify-between  p-14">
        <div className="flex flex-col gap-10">
          <div>
            <img src={logo1} alt="logo" className="h-16" />
          </div>

          <div className=" mt-10">
            <h2 className="text-3xl font-semibold text-white max-w-72">
              {data.title}
            </h2>
            <p className="mt-3  max-w-80 text-base text-gray-200">
              {data.desc}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {data.footer.map((item, index) => (
            <div
              key={item.id}
              className={`flex flex-col px-4 ${index !== 2 && 'border-r border-gray-300/20'}`}
            >
              <item.icon className="h-8 w-8 mb-1 text-primary" />
              <h3 className="font-semibold text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LeftAuth
