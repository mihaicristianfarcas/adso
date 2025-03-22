'use client'

import { useScrollTop } from '@/hooks/use-scroll-top'
import { cn } from '@/lib/utils'
import { Logo } from './logo'
import { ModeToggle } from '@/components/mode-toggle'

const NavBar = () => {
  const scrolled = useScrollTop()
  return (
    <div
      className={cn(
        'bg-background fixed top-0 z-50 flex w-full items-center p-6 dark:bg-[#1F1F1F]',
        scrolled && 'border-bottom shadow-sm'
      )}
    >
      <Logo />
      <div className='flex w-full items-center justify-between gap-x-2 md:ml-auto md:justify-end'>
        <ModeToggle />
      </div>
    </div>
  )
}

export default NavBar
