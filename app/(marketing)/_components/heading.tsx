'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

export const Heading = () => {
  return (
    <div className='flex max-w-3xl flex-col items-center justify-center space-y-4 gap-y-4 py-22 lg:flex-row'>
      <Image
        src='/journal.png'
        alt='Journal'
        width={400}
        height={400}
        className='object-contain dark:hidden'
      />
      <Image
        src='/journal-dark.png'
        alt='Journal'
        width={400}
        height={400}
        className='hidden object-contain dark:block'
      />
      <div className='flex flex-col items-center justify-center space-y-4 gap-y-4'>
        <h1 className='text-3xl text-nowrap sm:text-4xl md:text-5xl'>
          Your thoughts, organised. <br /> Your ideas, articulated. <br />
          Meet <span className='font-bold'>Adso</span>.
        </h1>
        <h3 className='text-base font-medium sm:text-xl md:text-2xl'>
          Adso is a note-taking app designed to help you explore your deepest
          thoughts and give light to your brightest ideas.
        </h3>

        <Button>
          Get writing
          <ArrowRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
