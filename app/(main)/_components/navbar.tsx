'use client'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { MenuIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import { Title } from './title'
import { Banner } from './banner'

interface NavbarProps {
  isCollapsed: boolean
  onResetWidth: () => void
}

export const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  const params = useParams()
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<'documents'>
  })

  if (document === undefined) {
    return (
      <nav className='bg-background flex w-full items-center px-3 py-2 dark:bg-[#1F1F1F]'>
        <Title.Skeleton />
      </nav>
    )
  }
  if (document === null) {
    return null
  }

  return (
    <>
      <nav className='bg-background flex w-full items-center gap-x-4 px-3 py-2 dark:bg-[#1F1F1F]'>
        {isCollapsed && (
          <MenuIcon
            role='button'
            onClick={onResetWidth}
            className='text-muted-foreground h-6 w-6'
          />
        )}
        <div className='flex w-full items-center justify-between'>
          <Title initialData={document} />
        </div>
      </nav>
      {document.isArchived && <Banner documentId={document._id} />}
    </>
  )
}
