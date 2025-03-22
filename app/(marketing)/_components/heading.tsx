'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export const Heading = () => {
  return (
    <div className='max-w-3xl space-y-4'>
      <h1 className='text-3xl font-bold sm:text-5xl md:text-6xl'>
        Your thoughts, organized.
        <br />
        Your ideas, articulated. <br />
        Meet <span className='italic'>Adso</span>.
      </h1>
      <h3 className='text-base font-medium sm:text-xl md:text-2xl'>
        Adso is a note-taking app designed to help you explore your deepest
        thoughts and articulate your brightest ideas.
      </h3>
      <Button>
        Get writing
        <ArrowRight className='h-4 w-4' />
      </Button>
    </div>
  )
}
