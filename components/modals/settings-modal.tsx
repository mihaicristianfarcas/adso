'use client'

import { useSettings } from '@/hooks/use-settings'
import { Label } from '@/components/ui/label'
import { ModeToggle } from '@/components/mode-toggle'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

export const SettingsModal = () => {
  const settings = useSettings()

  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent className='border-b pb-3'>
        <DialogTitle className='text-lg font-medium'>My settings</DialogTitle>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-y-1'>
            <Label>Appearance</Label>
            <span className='text-muted-foreground text-[0.8rem]'>
              Customize how Adso looks on your device
            </span>
          </div>
          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  )
}
