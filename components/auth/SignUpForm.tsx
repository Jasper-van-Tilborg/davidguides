'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { validateLanguage } from '@/app/translations'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function SignUpForm() {
  const { t } = useTranslation()
  const { signUp } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Extract language from pathname
  const lang = pathname.split('/')[1] || 'nl'
  const validLang = validateLanguage(lang)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = signUp(email, password, name || undefined)
      if (user) {
        router.push(`/${validLang}/calendar`)
      } else {
        setError('Failed to create account')
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 pb-20">
      <div className="w-full max-w-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-adventure-purple to-adventure-pink bg-clip-text text-transparent">
            {t('common.appName')}
          </h1>
          <LanguageSwitcher />
        </div>

        <Card>
          <h2 className="text-xl sm:text-2xl font-semibold mb-6">{t('auth.signUp')}</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name (Optional)
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="w-full px-4 py-3 bg-adventure-dark border border-adventure-purple/30 rounded-lg focus:outline-none focus:border-adventure-purple text-white text-base touch-manipulation"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                {t('auth.email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                inputMode="email"
                className="w-full px-4 py-3 bg-adventure-dark border border-adventure-purple/30 rounded-lg focus:outline-none focus:border-adventure-purple text-white text-base touch-manipulation"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                {t('auth.password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full px-4 py-3 bg-adventure-dark border border-adventure-purple/30 rounded-lg focus:outline-none focus:border-adventure-purple text-white text-base touch-manipulation"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full touch-manipulation min-h-[44px] text-base"
            >
              {loading ? t('common.loading') : t('auth.signUp')}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            {t('auth.hasAccount')}{' '}
            <Link 
              href={`/${validLang}/auth/signin`} 
              className="text-adventure-purple hover:text-adventure-pink touch-manipulation"
            >
              {t('auth.signIn')}
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

