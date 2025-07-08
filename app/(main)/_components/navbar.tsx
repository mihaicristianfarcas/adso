'use client'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { MenuIcon, MessageCircle } from 'lucide-react'
import { useParams } from 'next/navigation'
import { Title } from './title'
import { Banner } from './banner'
import { Menu } from './menu'
import { Publish } from './publish'
import { Button } from '@/components/ui/button'

type NavbarProps = {
  isCollapsed: boolean
  onResetWidth: () => void
  handleChat?: () => void
  onChatToggle?: () => void
}

export const Navbar = ({
  isCollapsed,
  onResetWidth,
  onChatToggle
}: NavbarProps) => {
  const params = useParams()
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<'documents'>
  })

  if (document === undefined) {
    return (
      <nav className='bg-background flex w-full items-center justify-between px-3 py-2'>
        <Title.Skeleton />
        <div className='flex items-center gap-x-2'>
          <Menu.Skeleton />
        </div>
      </nav>
    )
  }
  if (document === null) {
    return null
  }

  return (
    <>
      <nav className='bg-background border-border flex w-full items-center gap-x-4 border-b px-3 py-2'>
        {isCollapsed && (
          <MenuIcon
            role='button'
            onClick={onResetWidth}
            className='text-muted-foreground h-6 w-6'
          />
        )}
        <div className='flex w-full items-center justify-between'>
          <Title initialData={document} />
          <div className='flex items-center gap-x-2'>
            <Publish initialData={document} />
            <Menu documentId={document._id} />
            <Button onClick={onChatToggle} variant='ghost'>
              <MessageCircle className='h-5 w-5' />
            </Button>
          </div>
        </div>
      </nav>
      {document.isArchived && <Banner documentId={document._id} />}
    </>
  )
}
