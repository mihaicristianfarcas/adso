'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const Error = () => {
  return (
    <div className='flex h-full flex-col items-center justify-center space-y-4'>
      <Image src='/logo.png' height='300' width='300' alt='Logo' />
      <h2 className='text-xl font-medium'>Something went wrong!</h2>
      <Button asChild>
        <Link href='/documents'>Go back to your documents</Link>
      </Button>
    </div>
  )
}

export default Error
