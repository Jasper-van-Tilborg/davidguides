'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { validateLanguage } from '@/app/translations'
import { storage } from '@/lib/storage'
import { initializeHabitTemplates } from '@/lib/habitTemplates'
import { initializeAchievements } from '@/lib/achievements'
import type { HabitTemplate, Achievement } from '@/types'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Settings, Sparkles, Trophy, Globe, Plus, Trash2, Edit } from 'lucide-react'
import { getIconComponent } from '@/lib/iconHelper'

export default function AdminContent() {
  const { t } = useTranslation()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState<'templates' | 'achievements' | 'translations'>('templates')
  const [templates, setTemplates] = useState<HabitTemplate[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])

  const lang = pathname.split('/')[1] || 'nl'
  const validLang = validateLanguage(lang)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/${validLang}/auth/signin`)
    } else if (user && !user.is_admin) {
      router.push(`/${validLang}/calendar`)
    }
  }, [isAuthenticated, authLoading, user, router, validLang])

  useEffect(() => {
    if (user?.is_admin) {
      loadData()
    }
  }, [user, activeTab])

  const loadData = () => {
    initializeHabitTemplates()
    initializeAchievements()
    setTemplates(storage.getHabitTemplates())
    setAchievements(storage.getAchievements())
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t('common.loading')}</div>
      </div>
    )
  }

  if (!isAuthenticated || !user?.is_admin) {
    return null
  }

  return (
    <div className="min-h-screen pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-8 h-8 text-adventure-main" />
            <h1 className="text-2xl sm:text-3xl font-bold">{t('admin.title')}</h1>
          </div>
          <p className="text-adventure-light/70 text-sm sm:text-base">
            {t('admin.description') || 'Manage habit templates, achievements, and translations'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-adventure-main/20 pb-4">
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors touch-manipulation min-h-[44px] ${
              activeTab === 'templates'
                ? 'bg-adventure-main text-adventure-light'
                : 'bg-adventure-dark/50 text-adventure-light/70 hover:bg-adventure-dark/70'
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-2" />
            {t('admin.templates')}
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors touch-manipulation min-h-[44px] ${
              activeTab === 'achievements'
                ? 'bg-adventure-main text-adventure-light'
                : 'bg-adventure-dark/50 text-adventure-light/70 hover:bg-adventure-dark/70'
            }`}
          >
            <Trophy className="w-4 h-4 inline mr-2" />
            {t('admin.achievements')}
          </button>
          <button
            onClick={() => setActiveTab('translations')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors touch-manipulation min-h-[44px] ${
              activeTab === 'translations'
                ? 'bg-adventure-main text-adventure-light'
                : 'bg-adventure-dark/50 text-adventure-light/70 hover:bg-adventure-dark/70'
            }`}
          >
            <Globe className="w-4 h-4 inline mr-2" />
            {t('admin.translations')}
          </button>
        </div>

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{t('admin.templates')}</h2>
              <Button className="touch-manipulation min-h-[44px]">
                <Plus className="w-4 h-4 mr-2" />
                {t('common.add')}
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="p-4 bg-adventure-dark/50 rounded-lg border border-adventure-main/20"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const IconComponent = getIconComponent(template.icon || 'fileText')
                        return IconComponent ? (
                          <IconComponent className="w-6 h-6 text-adventure-text" />
                        ) : null
                      })()}
                      <h3 className="font-semibold">{template.name}</h3>
                    </div>
                    {!template.is_default && (
                      <button className="text-adventure-light/70 hover:text-red-400 p-1 rounded-lg touch-manipulation">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {template.description && (
                    <p className="text-sm text-adventure-light/70 mb-2">{template.description}</p>
                  )}
                  <div className="text-sm text-adventure-secondary">
                    +{template.xp_reward} {t('adventure.xp')} • {template.category}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{t('admin.achievements')}</h2>
              <Button className="touch-manipulation min-h-[44px]">
                <Plus className="w-4 h-4 mr-2" />
                {t('common.add')}
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="p-4 bg-adventure-dark/50 rounded-lg border border-adventure-main/20"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const IconComponent = getIconComponent(achievement.icon || 'trophy')
                        return IconComponent ? (
                          <IconComponent className="w-6 h-6 text-adventure-text" />
                        ) : null
                      })()}
                      <h3 className="font-semibold">{achievement.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-adventure-light/70 mb-2">{achievement.description}</p>
                  <div className="text-sm text-adventure-secondary">
                    +{achievement.xp_reward} {t('adventure.xp')} • {achievement.type} • {achievement.category}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Requirement: {achievement.requirement}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Translations Tab */}
        {activeTab === 'translations' && (
          <Card>
            <h2 className="text-xl font-semibold mb-4">{t('admin.translations')}</h2>
            <p className="text-adventure-light/70">
              {t('admin.translationsDescription') || 'Translation management coming soon. Currently using react-i18next with JSON files.'}
            </p>
          </Card>
        )}
      </main>
    </div>
  )
}

