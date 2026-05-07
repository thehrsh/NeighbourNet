'use client'

import { useNotification } from '@/lib/notification-context'
import { X, CheckCircle, Info, AlertTriangle } from 'lucide-react'

export function Notifications() {
  const { notifications, removeNotification } = useNotification()

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right-5 fade-in duration-200 ${
            notification.type === 'success'
              ? 'bg-primary text-primary-foreground'
              : notification.type === 'warning'
              ? 'bg-accent text-accent-foreground'
              : 'bg-card text-card-foreground border border-border'
          }`}
        >
          {notification.type === 'success' && <CheckCircle className="h-5 w-5" />}
          {notification.type === 'info' && <Info className="h-5 w-5" />}
          {notification.type === 'warning' && <AlertTriangle className="h-5 w-5" />}
          <span className="text-sm font-medium">{notification.message}</span>
          <button
            onClick={() => removeNotification(notification.id)}
            className="ml-2 hover:opacity-70 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
