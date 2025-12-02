'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHabits } from '@/hooks/useHabits'
import Button from '@/components/ui/Button'
import { X } from 'lucide-react'

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-adventure-dark border border-adventure-purple/30 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{t('habits.addHabit')}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              {t('habits.habitName')} *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 bg-adventure-dark/50 border border-adventure-purple/30 rounded-lg focus:outline-none focus:border-adventure-purple text-white"
              placeholder="e.g., Drink water, Exercise, Read"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              {t('habits.habitDescription')}
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-adventure-dark/50 border border-adventure-purple/30 rounded-lg focus:outline-none focus:border-adventure-purple text-white resize-none"
              placeholder="Optional description"
            />
          </div>

          <div>
            <label htmlFor="xpReward" className="block text-sm font-medium mb-2">
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
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>5 XP</span>
              <span>50 XP</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={loading || !name.trim()} className="flex-1">
              {loading ? t('common.loading') : t('common.add')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

