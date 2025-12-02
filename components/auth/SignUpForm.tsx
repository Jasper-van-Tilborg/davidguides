'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function SignUpForm() {
  const { t } = useTranslation()
  const { signUp } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = signUp(email, password, name || undefined)
      if (user) {
        router.push('/dashboard')
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-adventure-purple to-adventure-pink bg-clip-text text-transparent">
            {t('common.appName')}
          </h1>
          <LanguageSwitcher />
        </div>

        <Card>
          <h2 className="text-2xl font-semibold mb-6">{t('auth.signUp')}</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name (Optional)
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-adventure-dark border border-adventure-purple/30 rounded-lg focus:outline-none focus:border-adventure-purple text-white"
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
                className="w-full px-4 py-2 bg-adventure-dark border border-adventure-purple/30 rounded-lg focus:outline-none focus:border-adventure-purple text-white"
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
                className="w-full px-4 py-2 bg-adventure-dark border border-adventure-purple/30 rounded-lg focus:outline-none focus:border-adventure-purple text-white"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? t('common.loading') : t('auth.signUp')}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            {t('auth.hasAccount')}{' '}
            <Link href="/auth/signin" className="text-adventure-purple hover:text-adventure-pink">
              {t('auth.signIn')}
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

