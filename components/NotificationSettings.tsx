'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNotifications } from '@/hooks/useNotifications'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Bell, BellOff, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

export default function NotificationSettings() {
  const { t } = useTranslation()
  const {
    supported,
    permission,
    enabled,
    requestPermission,
  } = useNotifications()

  const [requesting, setRequesting] = useState(false)

  const handleRequestPermission = async () => {
    setRequesting(true)
    try {
      await requestPermission()
    } finally {
      setRequesting(false)
    }
  }

  if (!supported) {
    return (
      <Card>
        <div className="flex items-center gap-3 p-4">
          <AlertCircle className="w-5 h-5 text-adventure-light/70" />
          <div>
            <h3 className="font-semibold text-sm sm:text-base">
              {t('notifications.notSupported') || 'Notifications not supported'}
            </h3>
            <p className="text-xs sm:text-sm text-adventure-light/70">
              {t('notifications.notSupportedDesc') || 'Your browser does not support notifications'}
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {enabled ? (
            <Bell className="w-5 h-5 text-adventure-secondary" />
          ) : (
            <BellOff className="w-5 h-5 text-adventure-light/70" />
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-sm sm:text-base">
              {t('notifications.title') || 'Push Notifications'}
            </h3>
            <p className="text-xs sm:text-sm text-adventure-light/70">
              {t('notifications.description') || 'Get reminders and achievement notifications'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Permission Status */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-adventure-dark/30">
            <span className="text-sm text-adventure-light/70">
              {t('notifications.status') || 'Status'}
            </span>
            <div className="flex items-center gap-2">
              {enabled ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-adventure-secondary" />
                  <span className="text-sm text-adventure-secondary font-medium">
                    {t('notifications.enabled') || 'Enabled'}
                  </span>
                </>
              ) : permission === 'denied' ? (
                <>
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-400 font-medium">
                    {t('notifications.denied') || 'Denied'}
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-yellow-400 font-medium">
                    {t('notifications.notEnabled') || 'Not Enabled'}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action Button */}
          {!enabled && (
            <Button
              onClick={handleRequestPermission}
              disabled={requesting || permission === 'denied'}
              className="w-full"
            >
              {requesting
                ? (t('notifications.requesting') || 'Requesting...')
                : permission === 'denied'
                ? (t('notifications.deniedHelp') || 'Permission denied - check browser settings')
                : (t('notifications.enable') || 'Enable Notifications')}
            </Button>
          )}

          {permission === 'denied' && (
            <p className="text-xs text-adventure-light/70">
              {t('notifications.deniedInstructions') || 
                'To enable notifications, please allow them in your browser settings and refresh the page.'}
            </p>
          )}

          {enabled && (
            <div className="p-3 rounded-lg bg-adventure-secondary/10 border border-adventure-secondary/20">
              <p className="text-xs text-adventure-secondary">
                {t('notifications.enabledInfo') || 
                  'You will receive notifications for achievements, level ups, and daily reminders.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}


