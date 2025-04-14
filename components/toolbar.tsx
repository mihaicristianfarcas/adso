'use client'

import { Doc } from '@/convex/_generated/dataModel'
import { IconPicker } from './icon-picker'
import { Button } from './ui/button'
import { ImageIcon, Smile, X } from 'lucide-react'
import { ComponentRef, useRef, useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import TextAreaAutosize from 'react-textarea-autosize'
import { useCoverImage } from '@/hooks/use-cover-image'

interface ToolbarProps {
  initialData: Doc<'documents'>
  preview?: boolean
}

export const Toolbar = ({ initialData, preview }: ToolbarProps) => {
  const inputRef = useRef<ComponentRef<'textarea'>>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialData.title)
  const update = useMutation(api.documents.update)
  const removeIcon = useMutation(api.documents.removeIcon)
  const coverImage = useCoverImage()

  const enableInput = () => {
    if (preview) return

    setIsEditing(true)
    setTimeout(() => {
      setValue(initialData.title)
      inputRef.current?.focus()
    }, 0)
  }

  const disableInput = () => setIsEditing(false)

  const onInput = (value: string) => {
    setValue(value)
    update({
      id: initialData._id,
      title: value || 'Untitled'
    })
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      disableInput()
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      setValue(initialData.title)
      disableInput()
    }
  }

  const onIconSelect = (icon: string) => {
    update({
      id: initialData._id,
      icon
    })
  }

  const onIconRemove = () => {
    removeIcon({
      id: initialData._id
    })
  }

  return (
    <div className='group relative pl-[54px]'>
      {!!initialData.icon && !preview && (
        <div className='group/icon flex items-center gap-x-2 pt-6'>
          <IconPicker onChange={onIconSelect}>
            <p className='text-6xl transition hover:opacity-75'>
              {initialData.icon}
            </p>
          </IconPicker>
          <Button
            onClick={onIconRemove}
            className='text-muted-foreground rounded-full text-xs opacity-0 transition group-hover/icon:opacity-100'
            variant='outline'
            size='icon'
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      )}
      {!!initialData.icon && preview && (
        <p className='pt-6 text-6xl'>{initialData.icon}</p>
      )}
      <div className='flex items-center gap-x-1 py-4 opacity-0 group-hover:opacity-100'>
        {!initialData.icon && !preview && (
          <IconPicker onChange={onIconSelect} asChild>
            <Button
              className='text-muted-foreground text-xs'
              variant='outline'
              size='sm'
            >
              <Smile className='mr-2 h-4 w-4' />
              Add icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button
            className='text-muted-foreground text-xs'
            variant='outline'
            size='sm'
            onClick={coverImage.onOpen}
          >
            <ImageIcon className='mr-2 h-4 w-4' />
            Add cover
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TextAreaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={event => onInput(event.target.value)}
          className='resize-none bg-transparent text-5xl font-bold break-words text-[#3F3F3F] outline-none dark:text-[#CFCFCF]'
        />
      ) : (
        <div
          onClick={enableInput}
          className='pb-[11.5px] text-5xl font-bold break-words text-[#3F3F3F] outline-none dark:text-[#CFCFCF]'
        >
          {initialData.title}
        </div>
      )}
    </div>
  )
}
