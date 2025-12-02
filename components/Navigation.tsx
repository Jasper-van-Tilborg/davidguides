'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Home, Trophy, LogOut, User } from 'lucide-react'

export default function Navigation() {
  const { t } = useTranslation()
  const { user, isAuthenticated, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = () => {
    signOut()
    router.push('/')
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <nav className="bg-adventure-dark/80 backdrop-blur-sm border-b border-adventure-purple/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-adventure-purple hover:text-adventure-pink transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="font-semibold">{t('common.appName')}</span>
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-300 hover:text-white transition-colors"
            >
              {t('habits.title')}
            </Link>
            <Link
              href="/adventure"
              className="text-gray-300 hover:text-white transition-colors"
            >
              {t('adventure.title')}
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2 text-gray-300">
                <User className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('auth.signOut')}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

