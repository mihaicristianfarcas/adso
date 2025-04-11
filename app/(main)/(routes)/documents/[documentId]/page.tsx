'use client'

import { Toolbar } from '@/components/toolbar'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { useParams } from 'next/navigation'

const DocumentIdPage = () => {
  const params = useParams()
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<'documents'>
  })

  if (document === undefined) {
    return <div>Loading...</div>
  }

  if (document === null) {
    return <div>Document not found</div>
  }

  return (
    <div className='pb-40'>
      <div className='h-[35vh]' />
      <div className='mx-auto md:max-w-4xl lg:max-w-5xl'>
        <Toolbar initialData={document} />
      </div>
    </div>
  )
}

export default DocumentIdPage
