'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { Language } from '@/app/translations'
import { Home, LogOut, User, Globe, Menu, X } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

interface NavigationProps {
  lang: Language
}

export default function Navigation({ lang }: NavigationProps) {
  const { t } = useTranslation()
  const { user, isAuthenticated, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = () => {
    signOut()
    router.push(`/${lang}`)
    setMobileMenuOpen(false)
  }

  const changeLanguage = (newLang: string) => {
    // Extract current page path after language code
    const currentPage = pathname.split('/').slice(2).join('/') || ''
    const newPath = currentPage ? `/${newLang}/${currentPage}` : `/${newLang}`
    router.push(newPath)
    setMobileMenuOpen(false)
  }

  const navItems = [
    { href: `/${lang}/calendar`, label: t('calendar.title') || 'Calendar' },
    { href: `/${lang}/adventure`, label: t('adventure.title') },
    { href: `/${lang}/achievements`, label: t('achievements.title') || 'Achievements' },
  ]

  // Add admin link if user is admin
  if (isAuthenticated && user?.is_admin) {
    navItems.push({ href: `/${lang}/admin`, label: t('admin.title') })
  }

  return (
    <nav className="bg-adventure-dark border-b border-adventure-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Always visible */}
          <Link
            href={isAuthenticated ? `/${lang}/calendar` : `/${lang}`}
            className="flex items-center gap-2 text-adventure-text hover:text-adventure-secondary transition-all duration-200 min-w-0 group"
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium truncate text-lg">{t('common.appName')}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && (
              <>
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-opacity ${
                        isActive
                          ? 'text-adventure-text'
                          : 'text-adventure-text-secondary hover:text-adventure-light'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </>
            )}
          </div>

          {/* Right side actions - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Language Selector */}
            <div className="relative">
              <select
                value={lang}
                onChange={(e) => changeLanguage(e.target.value)}
                className="appearance-none bg-adventure-main border border-adventure-border rounded-lg px-3 py-2 pr-8 text-sm font-medium text-adventure-light hover:border-adventure-text focus:outline-none focus:ring-1 focus:ring-adventure-text cursor-pointer transition-opacity min-w-[80px]"
              >
                <option value="nl">🇳🇱 NL</option>
                <option value="en">🇬🇧 EN</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-adventure-text-secondary">
                <Globe className="w-4 h-4" />
              </div>
            </div>

            {isAuthenticated && (
              <>
                {user && (
                  <div className="flex items-center gap-2 text-adventure-text-secondary max-w-[150px]">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate">{user.email}</span>
                  </div>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-adventure-text-secondary hover:text-adventure-light transition-opacity text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('auth.signOut')}</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-adventure-text-secondary hover:text-adventure-light transition-opacity touch-manipulation"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-adventure-border py-4 space-y-2">
            {isAuthenticated && (
              <>
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg transition-opacity ${
                        isActive
                          ? 'text-adventure-text'
                          : 'text-adventure-text-secondary hover:text-adventure-light'
                      } touch-manipulation`}
                    >
                      {item.label}
                    </Link>
                  )
                })}
                <div className="border-t border-adventure-border pt-2 mt-2">
                  {user && (
                    <div className="flex items-center gap-2 px-4 py-2 text-adventure-text-secondary">
                      <User className="w-4 h-4" />
                      <span className="text-sm truncate">{user.email}</span>
                    </div>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-adventure-text-secondary hover:text-adventure-light transition-opacity text-left touch-manipulation"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('auth.signOut')}</span>
                  </button>
                </div>
              </>
            )}
            
            {/* Mobile Theme Toggle */}
            <div className="px-4 pt-2">
              <label className="block text-sm text-adventure-text-secondary mb-2">Theme</label>
              <div className="flex justify-center">
                <ThemeToggle />
              </div>
            </div>
            
            {/* Mobile Language Selector */}
            <div className="px-4 pt-2">
              <label className="block text-sm text-adventure-text-secondary mb-2">Language</label>
              <div className="relative">
                <select
                  value={lang}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="w-full appearance-none bg-adventure-main border border-adventure-border rounded-lg px-4 py-3 pr-10 text-sm font-medium text-adventure-light focus:outline-none focus:ring-1 focus:ring-adventure-text touch-manipulation"
                >
                  <option value="nl">🇳🇱 Nederlands</option>
                  <option value="en">🇬🇧 English</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-adventure-text-secondary">
                  <Globe className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

