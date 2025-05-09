import { Button } from '@/components/ui/button'
import { Logo } from './logo'

const Footer = () => {
  return (
    <div className='bg-background z-50 flex w-full items-center p-4 md:p-6 dark:bg-[#1F1F1F]'>
      <Logo />
      <div className='text-muted-foreground flex w-full flex-col items-center space-y-2 md:flex-row md:items-center md:justify-end md:space-y-0'>
        <Button variant='ghost' size='sm' className='text-xs md:text-sm'>
          Privacy Policy
        </Button>
        <Button variant='ghost' size='sm' className='text-xs md:text-sm'>
          Terms & Conditions
        </Button>
      </div>
    </div>
  )
}

export default Footer
