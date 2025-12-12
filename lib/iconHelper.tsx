'use client'

import {
  Trophy,
  Star,
  Flame,
  Target,
  Crown,
  Sparkles,
  Globe,
  Globe2,
  GlobeAmericas,
  Waves,
  Mountain,
  Volcano,
  PalmTree,
  Snowflake,
  Sparkles as SparklesIcon,
  Lightbulb,
  Plug,
  Gamepad2,
  Smartphone,
  FileText,
  Pen,
  Droplet,
  Running,
  Book,
  Brain,
  Moon,
  Heart,
  X,
  CheckCircle2,
  Lock,
  Map,
  Settings,
  Plus,
  Trash2,
  Edit,
  LucideIcon,
} from 'lucide-react'

// Map icon names to Lucide React icons
const iconMap: Record<string, LucideIcon> = {
  trophy: Trophy,
  star: Star,
  flame: Flame,
  target: Target,
  crown: Crown,
  sparkles: Sparkles,
  globe: Globe,
  globe2: Globe2,
  globeAmericas: GlobeAmericas,
  waves: Waves,
  mountain: Mountain,
  volcano: Volcano,
  palmTree: PalmTree,
  snowflake: Snowflake,
  lightbulb: Lightbulb,
  plug: Plug,
  gamepad: Gamepad2,
  smartphone: Smartphone,
  fileText: FileText,
  pen: Pen,
  droplet: Droplet,
  running: Running,
  book: Book,
  brain: Brain,
  moon: Moon,
  heart: Heart,
  check: CheckCircle2,
  lock: Lock,
  map: Map,
  settings: Settings,
  plus: Plus,
  trash: Trash2,
  edit: Edit,
  // Achievement icons
  fire: Flame,
  seedling: Sparkles,
  hundred: Target,
  // Additional icons
  checkCircle: CheckCircle2,
  // World icons
  earth: Globe,
  forest: Globe2,
  ocean: Waves,
  waterfall: Waves,
  tropical: PalmTree,
  cosmic: SparklesIcon,
  legendary: Star,
}

// Get icon component by name
export function getIconComponent(iconName?: string): LucideIcon | null {
  if (!iconName) return null
  
  // Handle emoji fallbacks (for backwards compatibility)
  const emojiMap: Record<string, string> = {
    '🏆': 'trophy',
    '⭐': 'star',
    '🔥': 'flame',
    '🎯': 'target',
    '👑': 'crown',
    '✨': 'sparkles',
    '🌍': 'globe',
    '🌎': 'globe2',
    '🌏': 'globeAmericas',
    '🌊': 'waves',
    '🏔️': 'mountain',
    '🌋': 'volcano',
    '🏝️': 'tropical',
    '❄️': 'snowflake',
    '🌌': 'cosmic',
    '💡': 'lightbulb',
    '🔌': 'plug',
    '🎮': 'gamepad',
    '📱': 'smartphone',
    '📝': 'fileText',
    '💻': 'smartphone',
    '🌱': 'seedling',
    '💯': 'hundred',
    '🔒': 'lock',
  }
  
  // Check if it's an emoji first
  if (emojiMap[iconName]) {
    return iconMap[emojiMap[iconName]] || null
  }
  
  // Otherwise treat as icon name
  return iconMap[iconName.toLowerCase()] || null
}

// Render icon component
export function renderIcon(iconName?: string, className?: string, size?: number): JSX.Element | null {
  const IconComponent = getIconComponent(iconName)
  if (!IconComponent) return null
  
  const sizeClass = size ? `w-${size} h-${size}` : 'w-6 h-6'
  return <IconComponent className={className || sizeClass} />
}

