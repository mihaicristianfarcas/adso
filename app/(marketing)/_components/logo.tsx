import Image from 'next/image'
import { Poppins } from 'next/font/google'

import { cn } from '@/lib/utils'

const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '600']
})

export const Logo = () => {
  return (
    <div className='hidden items-center gap-x-4 md:flex'>
      <Image src='/logo.png' alt='Logo' width={40} height={40} />
      <p className={cn('font-semibold', font.className)}>Adso</p>
    </div>
  )
}
