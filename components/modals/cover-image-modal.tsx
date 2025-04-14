'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

import { useCoverImage } from '@/hooks/use-cover-image'
import { SingleImageDropzone } from '@/components/single-image-dropzone'
import { useState } from 'react'
import { useEdgeStore } from '@/lib/edgestore'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useParams } from 'next/navigation'
import { Id } from '@/convex/_generated/dataModel'

export const CoverImageModal = () => {
  const coverImage = useCoverImage()
  const [file, setFile] = useState<File>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { edgestore } = useEdgeStore()
  const update = useMutation(api.documents.update)
  const params = useParams()

  const onChange = async (file?: File) => {
    if (!file) return

    setIsSubmitting(true)
    setFile(file)

    const response = await edgestore.publicFiles.upload({
      file,
      options: { replaceTargetUrl: coverImage.url }
    })

    await update({
      id: params.documentId as Id<'documents'>,
      coverImage: response.url
    })

    onClose()
  }

  const onClose = () => {
    setFile(undefined)
    setIsSubmitting(false)
    coverImage.onClose()
  }

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogTitle className='text-center text-lg font-semibold'>
          Cover Image
        </DialogTitle>
        <SingleImageDropzone
          className='w-full outline-none'
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  )
}
