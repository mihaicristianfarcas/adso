'use client'

import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/clerk-react'
import { PlusCircle } from 'lucide-react'
import Image from 'next/image'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const DocumentsPage = () => {
  const { user } = useUser()
  const create = useMutation(api.documents.create)
  const router = useRouter()

  const onCreate = () => {
    const promise = create({ title: 'Untitled' }).then(documentId => {
      router.push(`/documents/${documentId}`)
    })

    toast.promise(promise, {
      loading: 'Creating a new document...',
      success: 'New document created!',
      error: 'Failed to create a new document.'
    })
  }

  return (
    <div className='flex h-full flex-col items-center justify-center space-y-4'>
      <Image src='/logo.png' alt='Empty' width={200} height={200} />
      <h2 className='text-lg font-medium'>
        Welcome to Adso, {user?.firstName}
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className='mr-2 h-4 w-4' />
        New document
      </Button>
    </div>
  )
}

export default DocumentsPage
