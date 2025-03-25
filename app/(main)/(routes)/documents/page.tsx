'use client'

import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/clerk-react'
import { PlusCircle } from 'lucide-react'
import Image from 'next/image'

const DocumentsPage = () => {
  const { user } = useUser()

  return (
    <div className='flex h-full flex-col items-center justify-center space-y-4'>
      <Image src='/logo.png' alt='Empty' width={200} height={200} />
      <h2 className='text-lg font-medium'>
        Welcome to Adso&apos;s scriptorium, {user?.firstName}
      </h2>
      <Button>
        <PlusCircle className='mr-2 h-4 w-4' />
        New Manuscript
      </Button>
    </div>
  )
}

export default DocumentsPage
