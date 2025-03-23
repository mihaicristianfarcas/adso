import Image from 'next/image'
import { Poppins } from 'next/font/google'

import { cn } from '@/lib/utils'

const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '600']
})

export const Logo = () => {
  return (
    <div className='hidden items-center gap-x-2 md:flex'>
      {/* <Image
        src='/journal.png'
        alt='Journal'
        width={40}
        height={40}
        className='object-contain dark:hidden'
      />
      <Image
        src='/journal-dark.png'
        alt='Journal'
        width={40}
        height={40}
        className='hidden object-contain dark:block'
      /> */}
      <p className={cn('font-semibold', font.className)}>Adso</p>
    </div>
  )
}
