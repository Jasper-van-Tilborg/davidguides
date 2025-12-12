'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useHabits } from '@/hooks/useHabits'
import { storage } from '@/lib/storage'
import { initializeHabitTemplates, getTemplatesByCategory, getTemplateCategories } from '@/lib/habitTemplates'
import type { HabitTemplate } from '@/types'
import Button from '@/components/ui/Button'
import { X, Sparkles } from 'lucide-react'
import { getIconComponent } from '@/lib/iconHelper'

interface AddHabitModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function AddHabitModal({ onClose, onSuccess }: AddHabitModalProps) {
  const { t } = useTranslation()
  const { addHabit } = useHabits()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [xpReward, setXpReward] = useState(10)
  const [loading, setLoading] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [templates, setTemplates] = useState<HabitTemplate[]>([])
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    initializeHabitTemplates()
    setTemplates(getTemplatesByCategory())
    setCategories(getTemplateCategories())
  }, [])

  useEffect(() => {
    if (selectedCategory === 'all') {
      setTemplates(getTemplatesByCategory())
    } else {
      setTemplates(getTemplatesByCategory(selectedCategory))
    }
  }, [selectedCategory])

  const handleTemplateSelect = (template: HabitTemplate) => {
    setName(template.name)
    setDescription(template.description || '')
    setXpReward(template.xp_reward)
    setShowTemplates(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    try {
      addHabit({
        name: name.trim(),
        description: description.trim() || undefined,
        xp_reward: xpReward,
      })
      onSuccess()
    } catch (error) {
      console.error('Failed to add habit:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto animate-fade-in">
      <div className="bg-adventure-main border border-adventure-border rounded-lg p-4 sm:p-6 w-full max-w-md my-4 max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-medium text-adventure-text">{t('habits.addHabit')}</h2>
          <button
            onClick={onClose}
            className="text-adventure-text-secondary hover:text-adventure-light transition-opacity p-2 rounded-lg touch-manipulation"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template Selector */}
        {!showTemplates && (
          <button
            type="button"
            onClick={() => setShowTemplates(true)}
            className="w-full mb-4 p-3 bg-adventure-main/20 border border-adventure-main/30 rounded-lg hover:bg-adventure-main/30 transition-colors flex items-center justify-center gap-2 touch-manipulation"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">{t('habits.useTemplate') || 'Use Template'}</span>
          </button>
        )}

        {showTemplates && (
          <div className="mb-4 p-4 bg-adventure-dark/50 rounded-lg border border-adventure-main/20">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">{t('habits.selectTemplate') || 'Select Template'}</h3>
              <button
                type="button"
                onClick={() => setShowTemplates(false)}
                className="text-sm rounded-lg px-2 py-1 text-adventure-main hover:text-adventure-text"
              >
                {t('common.cancel')}
              </button>
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors touch-manipulation ${
                    selectedCategory === 'all'
                      ? 'bg-adventure-main text-adventure-light'
                      : 'bg-adventure-dark/50 text-adventure-light/70'
                  }`}
                >
                  {t('habits.allCategories') || 'All'}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors touch-manipulation ${
                      selectedCategory === cat
                        ? 'bg-adventure-main text-adventure-light'
                        : 'bg-adventure-dark/50 text-adventure-light/70'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Templates List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleTemplateSelect(template)}
                  className="w-full p-3 bg-adventure-dark/50 border border-adventure-main/20 rounded-lg hover:border-adventure-main hover:bg-adventure-main/10 transition-colors text-left touch-manipulation"
                >
                  <div className="flex items-center gap-3">
                    {(() => {
                      const IconComponent = getIconComponent(template.icon || 'fileText')
                      return IconComponent ? (
                        <IconComponent className="w-6 h-6 text-adventure-text flex-shrink-0" />
                      ) : null
                    })()}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm sm:text-base truncate">{template.name}</div>
                      {template.description && (
                        <div className="text-xs text-adventure-light/70 truncate">{template.description}</div>
                      )}
                      <div className="text-xs text-adventure-secondary mt-1">
                        +{template.xp_reward} {t('adventure.xp')}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm text-adventure-text-secondary mb-2">
              {t('habits.habitName')} *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-adventure-dark border border-adventure-border rounded-lg focus:outline-none focus:ring-1 focus:ring-adventure-text focus:border-adventure-text text-adventure-light text-base touch-manipulation transition-opacity"
              placeholder="e.g., Drink water, Exercise, Read"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm text-adventure-text-secondary mb-2">
              {t('habits.habitDescription')}
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-adventure-dark border border-adventure-border rounded-lg focus:outline-none focus:ring-1 focus:ring-adventure-text focus:border-adventure-text text-adventure-light resize-none text-base touch-manipulation transition-opacity"
              placeholder="Optional description"
            />
          </div>

          <div>
            <label htmlFor="xpReward" className="block text-sm text-adventure-text-secondary mb-2">
              {t('habits.xpReward')}: {xpReward} {t('adventure.xp')}
            </label>
            <input
              id="xpReward"
              type="range"
              min="5"
              max="50"
              step="5"
              value={xpReward}
              onChange={(e) => setXpReward(Number(e.target.value))}
              className="w-full accent-adventure-text"
            />
            <div className="flex justify-between text-xs text-adventure-text-secondary mt-1">
              <span>5 XP</span>
              <span>50 XP</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1 touch-manipulation min-h-[44px]"
            >
              {t('common.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !name.trim()} 
              className="flex-1 touch-manipulation min-h-[44px]"
            >
              {loading ? t('common.loading') : t('common.add')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

