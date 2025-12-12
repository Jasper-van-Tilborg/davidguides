// Background sync functionality for offline data synchronization

import { storage } from './storage'
import type { Habit, HabitCheckIn, UserProgress } from '@/types'

export interface SyncQueueItem {
  id: string
  type: 'habit' | 'checkin' | 'progress' | 'achievement'
  action: 'create' | 'update' | 'delete'
  data: any
  timestamp: string
  retries: number
}

const SYNC_QUEUE_KEY = 'habit_adventure_sync_queue'
const MAX_RETRIES = 3
const SYNC_INTERVAL = 30000 // 30 seconds

// Get sync queue from localStorage
function getSyncQueue(): SyncQueueItem[] {
  if (typeof window === 'undefined') return []
  
  try {
    const queue = localStorage.getItem(SYNC_QUEUE_KEY)
    return queue ? JSON.parse(queue) : []
  } catch (error) {
    console.error('Failed to get sync queue:', error)
    return []
  }
}

// Save sync queue to localStorage
function saveSyncQueue(queue: SyncQueueItem[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue))
  } catch (error) {
    console.error('Failed to save sync queue:', error)
  }
}

// Add item to sync queue
export function addToSyncQueue(
  type: SyncQueueItem['type'],
  action: SyncQueueItem['action'],
  data: any
): void {
  const queue = getSyncQueue()
  const item: SyncQueueItem = {
    id: crypto.randomUUID(),
    type,
    action,
    data,
    timestamp: new Date().toISOString(),
    retries: 0,
  }
  
  queue.push(item)
  saveSyncQueue(queue)
  
  // Try to sync immediately if online
  if (navigator.onLine) {
    processSyncQueue()
  }
}

// Process sync queue (would sync with server in real app)
export async function processSyncQueue(): Promise<{ success: number; failed: number }> {
  const queue = getSyncQueue()
  if (queue.length === 0) return { success: 0, failed: 0 }

  if (!navigator.onLine) {
    console.log('Offline - sync queue will be processed when online')
    return { success: 0, failed: 0 }
  }

  const results = { success: 0, failed: 0 }
  const remainingQueue: SyncQueueItem[] = []

  for (const item of queue) {
    try {
      // In a real app, this would make an API call to sync with server
      // For now, we'll simulate success after a delay
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Simulate sync success (in real app, check server response)
      const success = item.retries < MAX_RETRIES
      
      if (success) {
        results.success++
        console.log(`Synced ${item.type} ${item.action}:`, item.id)
      } else {
        results.failed++
        remainingQueue.push({
          ...item,
          retries: item.retries + 1,
        })
      }
    } catch (error) {
      console.error('Sync failed for item:', item.id, error)
      results.failed++
      
      if (item.retries < MAX_RETRIES) {
        remainingQueue.push({
          ...item,
          retries: item.retries + 1,
        })
      }
    }
  }

  saveSyncQueue(remainingQueue)
  return results
}

// Clear sync queue
export function clearSyncQueue(): void {
  saveSyncQueue([])
}

// Get sync queue status
export function getSyncQueueStatus(): {
  pending: number
  items: SyncQueueItem[]
} {
  const queue = getSyncQueue()
  return {
    pending: queue.length,
    items: queue,
  }
}

// Initialize background sync
export function initializeBackgroundSync(): void {
  if (typeof window === 'undefined') return

  // Process queue when coming online
  window.addEventListener('online', () => {
    console.log('Online - processing sync queue')
    processSyncQueue()
  })

  // Process queue periodically
  setInterval(() => {
    if (navigator.onLine) {
      processSyncQueue()
    }
  }, SYNC_INTERVAL)

  // Process queue on page load if online
  if (navigator.onLine) {
    processSyncQueue()
  }
}

// Register background sync with service worker (if supported)
export async function registerBackgroundSync(tag: string = 'habit-sync'): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.ready
    
    // Check if Background Sync API is supported
    if ('sync' in registration) {
      await (registration as any).sync.register(tag)
      console.log('Background sync registered:', tag)
      return true
    } else {
      console.warn('Background Sync API not supported')
      return false
    }
  } catch (error) {
    console.error('Background sync registration failed:', error)
    return false
  }
}

// Sync habits to queue
export function syncHabit(habit: Habit, action: 'create' | 'update' | 'delete'): void {
  addToSyncQueue('habit', action, habit)
}

// Sync check-in to queue
export function syncCheckIn(checkIn: HabitCheckIn, action: 'create' | 'update' | 'delete'): void {
  addToSyncQueue('checkin', action, checkIn)
}

// Sync progress to queue
export function syncProgress(progress: UserProgress, action: 'create' | 'update'): void {
  addToSyncQueue('progress', action, progress)
}




