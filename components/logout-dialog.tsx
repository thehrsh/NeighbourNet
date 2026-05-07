'use client'

import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

interface LogoutDialogProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export function LogoutDialog({ isOpen, onConfirm, onCancel, isLoading = false }: LogoutDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-lg max-w-sm w-full p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Sign Out</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Are you sure you want to sign out?
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Signing out...' : 'Sign Out'}
          </Button>
        </div>
      </div>
    </div>
  )
}
