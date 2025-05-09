'use client'

import { Spinner } from '@/components/spinner'
import { Input } from '@/components/ui/input'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { Search, Trash, Undo } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useState } from 'react'
import { ConfirmModal } from '@/components/modals/confirm-modal'

export const TrashBox = () => {
  const router = useRouter()
  const params = useParams()
  const documents = useQuery(api.documents.getTrash)
  const restore = useMutation(api.documents.restore)
  const remove = useMutation(api.documents.remove)

  const [search, setSearch] = useState('')
  const filteredDocuments = documents?.filter(document => {
    return document.title.toLowerCase().includes(search.toLowerCase())
  })

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`)
  }

  const onRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<'documents'>
  ) => {
    event.stopPropagation()
    const promise = restore({ id: documentId })
    toast.promise(promise, {
      loading: 'Restoring document...',
      success: 'Document restored!',
      error: 'Error restoring document.'
    })
  }

  const onRemove = (documentId: Id<'documents'>) => {
    const promise = remove({ id: documentId })
    toast.promise(promise, {
      loading: 'Deleting document...',
      success: 'Document deleted!',
      error: 'Error deleting document.'
    })

    if (params.documentId === documentId) {
      router.push('/documents')
    }
  }

  if (documents === undefined) {
    return (
      <div className='flex h-full items-center justify-center p-4'>
        <Spinner size='lg' />
      </div>
    )
  }
  return (
    <div className='text-sm'>
      <div className='flex items-center gap-x-1 p-2'>
        <Search className='h-4 w-4' />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder='Filter by page title...'
          className='bg-background h-7 px-2 focus-visible:ring-transparent'
        />
      </div>
      <div className='mt-2 px-1 pb-1'>
        <p className='text-muted-foreground hidden pb-2 text-center text-xs last:block'>
          No documents found!
        </p>
        {filteredDocuments?.map(document => (
          <div
            key={document._id}
            role='button'
            onClick={() => onClick(document._id)}
            className='hover:bg-primary/5 text-primary flex w-full items-center justify-between rounded-sm text-sm'
          >
            <span className='truncate pl-2'>{document.title}</span>
            <div className='flex items-center'>
              <div
                onClick={e => onRestore(e, document._id)}
                role='button'
                className='hover:bg-accent hover:text-accent-foreground rounded-sm p-2'
              >
                <Undo className='text-muted-foreground h-4 w-4' />
              </div>
              <ConfirmModal onConfirm={() => onRemove(document._id)}>
                <div className='hover:bg-destructive/10 dark:hover:bg-destructive/20 rounded-sm p-2'>
                  <Trash className='text-muted-foreground hover:text-destructive h-4 w-4' />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
