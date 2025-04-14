'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

import { useCoverImage } from '@/hooks/use-cover-image'

export const CoverImageModal = () => {
  const coverImage = useCoverImage()

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogTitle className='text-center text-lg font-semibold'>
          Cover Image
        </DialogTitle>
        <div>Upload Image...</div>
      </DialogContent>
    </Dialog>
  )
}
