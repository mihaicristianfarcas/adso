import { Button } from '@/components/ui/button'
import { Logo } from './logo'

const Footer = () => {
  return (
    <div className='bg-background z-50 flex w-full items-center p-6 dark:bg-[#1F1F1F]'>
      <Logo />
      <div className='text-muted-foreground flex w-full items-center justify-between gap-x-2 md:ml-auto md:justify-end'>
        <Button variant='ghost' size='sm'>
          Privacy Policy
        </Button>
        <Button variant='ghost' size='sm'>
          Terms & Conditions
        </Button>
      </div>
    </div>
  )
}

export default Footer
