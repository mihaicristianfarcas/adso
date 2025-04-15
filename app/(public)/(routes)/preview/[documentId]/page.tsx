'use client'

import { Cover } from '@/components/cover'
import { Toolbar } from '@/components/toolbar'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'

const DocumentIdPage = () => {
  const params = useParams()
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<'documents'>
  })

  const Editor = useMemo(
    () =>
      dynamic(() => import('@/components/editor'), {
        ssr: false
      }),
    []
  )

  const update = useMutation(api.documents.update)
  const onChange = (content: string) => {
    update({
      id: params.documentId as Id<'documents'>,
      content
    })
  }

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className='mx-auto mt-10 md:max-w-4xl lg:max-w-5xl'>
          <div className='space-y-4 pt-4 pl-8'>
            <Skeleton className='h-14 w-[50%]' />
            <Skeleton className='h-4 w-[80%]' />
            <Skeleton className='h-4 w-[40%]' />
            <Skeleton className='h-4 w-[60%]' />
          </div>
        </div>
      </div>
    )
  }

  if (document === null) {
    return <div>Document not found</div>
  }

  return (
    <div className='pb-40'>
      <Cover preview url={document.coverImage} />
      <div className='mx-auto md:max-w-4xl lg:max-w-5xl'>
        <Toolbar preview initialData={document} />
        <Editor
          editable={false}
          onChange={onChange}
          initialContent={document.content}
        />
      </div>
    </div>
  )
}

export default DocumentIdPage
