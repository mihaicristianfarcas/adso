'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Button } from './ui/button'
import { ImageIcon, X } from 'lucide-react'
import { useCoverImage } from '@/hooks/use-cover-image'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useParams } from 'next/navigation'
import { Id } from '@/convex/_generated/dataModel'
import { useEdgeStore } from '@/lib/edgestore'
import { Skeleton } from './ui/skeleton'

interface CoverImageProps {
  url?: string
  preview?: string
}

export const Cover = ({ url, preview }: CoverImageProps) => {
  const params = useParams()
  const coverImage = useCoverImage()
  const removeCoverImage = useMutation(api.documents.removeCoverImage)
  const { edgestore } = useEdgeStore()

  const onRemove = async () => {
    if (url) {
      await edgestore.publicFiles.delete({ url: url })
    }
    removeCoverImage({ id: params.documentId as Id<'documents'> })
  }

  return (
    <div
      className={cn(
        'group relative h-[35vh] w-full',
        !url && 'h-[12vh]',
        url && 'bg-muted'
      )}
    >
      {!!url && <Image src={url} fill alt='cover' className='object-cover' />}
      {url && !preview && (
        <div className='absolute right-5 bottom-5 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100'>
          <Button
            onClick={() => coverImage.onReplace(url)}
            className='text-muted-foreground text-xs'
            variant='secondary'
            size='sm'
          >
            <ImageIcon className='mr-2 h-4 w-4' />
            Change cover
          </Button>
          <Button
            onClick={onRemove}
            className='text-muted-foreground text-xs'
            variant='secondary'
            size='sm'
          >
            <X className='mr-2 h-4 w-4' />
            Remove
          </Button>
        </div>
      )}
    </div>
  )
}

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className='h-[35vh] w-full' />
}
