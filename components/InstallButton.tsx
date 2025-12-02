'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, Check } from 'lucide-react'
import Button from './ui/Button'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallButton() {
  const { t } = useTranslation()
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Check if mobile
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
    setIsMobile(mobile)

    // Listen for beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // iOS instructions
      if (isIOS) {
        alert(t('install.iosInstructions'))
      }
      return
    }

    // Show install prompt
    deferredPrompt.prompt()

    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setIsInstalled(true)
    }

    setDeferredPrompt(null)
  }

  // Don't show if already installed
  if (isInstalled) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-400">
        <Check className="w-4 h-4" />
        <span>{t('common.installed')}</span>
      </div>
    )
  }

  // Only show on mobile devices
  if (!isMobile) {
    return null
  }

  // Show install button if prompt is available or iOS
  if (deferredPrompt || isIOS) {
    return (
      <Button
        onClick={handleInstallClick}
        variant="secondary"
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">{t('common.installApp')}</span>
        <span className="sm:hidden">{t('common.install')}</span>
      </Button>
    )
  }

  return null
}

