// Habit template definitions

import type { HabitTemplate } from '@/types'
import { storage } from './storage'

// Default habit templates
export const DEFAULT_HABIT_TEMPLATES: HabitTemplate[] = [
  {
    id: 'template-water',
    name: 'Drink Water',
    description: 'Drink 8 glasses of water daily',
    xp_reward: 10,
    icon: '💧',
    category: 'health',
    is_default: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'template-exercise',
    name: 'Exercise',
    description: '30 minutes of physical activity',
    xp_reward: 25,
    icon: '🏃',
    category: 'health',
    is_default: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'template-read',
    name: 'Read',
    description: 'Read for 20 minutes',
    xp_reward: 15,
    icon: '📚',
    category: 'learning',
    is_default: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'template-meditate',
    name: 'Meditate',
    description: '10 minutes of meditation',
    xp_reward: 15,
    icon: '🧘',
    category: 'wellness',
    is_default: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'template-journal',
    name: 'Journal',
    description: 'Write in your journal',
    xp_reward: 10,
    icon: '📝',
    category: 'wellness',
    is_default: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'template-sleep',
    name: 'Sleep 8 Hours',
    description: 'Get 8 hours of sleep',
    xp_reward: 20,
    icon: '😴',
    category: 'health',
    is_default: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'template-gratitude',
    name: 'Gratitude',
    description: 'Write 3 things you\'re grateful for',
    xp_reward: 10,
    icon: '🙏',
    category: 'wellness',
    is_default: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'template-no-smoking',
    name: 'No Smoking',
    description: 'Stay smoke-free today',
    xp_reward: 30,
    icon: '🚭',
    category: 'health',
    is_default: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'template-code',
    name: 'Code Practice',
    description: 'Practice coding for 1 hour',
    xp_reward: 25,
    icon: '💻',
    category: 'learning',
    is_default: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'template-stretch',
    name: 'Stretch',
    description: '10 minutes of stretching',
    xp_reward: 10,
    icon: '🤸',
    category: 'health',
    is_default: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Initialize default templates if not present
export function initializeHabitTemplates(): void {
  const existing = storage.getHabitTemplates()
  if (existing.length === 0) {
    storage.saveHabitTemplates(DEFAULT_HABIT_TEMPLATES)
  } else {
    // Add any missing default templates
    const existingIds = new Set(existing.map(t => t.id))
    const missingTemplates = DEFAULT_HABIT_TEMPLATES.filter(t => !existingIds.has(t.id))
    if (missingTemplates.length > 0) {
      storage.saveHabitTemplates([...existing, ...missingTemplates])
    }
  }
}

// Get templates by category
export function getTemplatesByCategory(category?: string): HabitTemplate[] {
  initializeHabitTemplates()
  const templates = storage.getHabitTemplates()
  if (!category) return templates
  return templates.filter(t => t.category === category)
}

// Get all categories
export function getTemplateCategories(): string[] {
  initializeHabitTemplates()
  const templates = storage.getHabitTemplates()
  const categories = new Set(templates.map(t => t.category).filter(Boolean))
  return Array.from(categories)
}

