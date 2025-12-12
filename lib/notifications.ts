// Push notifications and notification management

export interface NotificationOptions {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  requireInteraction?: boolean
  actions?: NotificationAction[]
  data?: any
}

// Check if browser supports notifications
export function isNotificationSupported(): boolean {
  if (typeof window === 'undefined') return false
  return 'Notification' in window
}

// Check current notification permission
export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied'
  return Notification.permission
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    throw new Error('Notifications are not supported in this browser')
  }

  if (Notification.permission === 'granted') {
    return 'granted'
  }

  if (Notification.permission === 'denied') {
    return 'denied'
  }

  const permission = await Notification.requestPermission()
  return permission
}

// Show a browser notification
export function showNotification(options: NotificationOptions): Notification | null {
  if (!isNotificationSupported()) {
    console.warn('Notifications are not supported')
    return null
  }

  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted')
    return null
  }

  const notificationOptions: NotificationOptions = {
    icon: options.icon || '/icons/icon-192.png',
    badge: options.badge || '/icons/icon-192.png',
    tag: options.tag,
    requireInteraction: options.requireInteraction || false,
    ...options,
  }

  const notification = new Notification(options.title, notificationOptions)

  // Auto-close after 5 seconds unless requireInteraction is true
  if (!notificationOptions.requireInteraction) {
    setTimeout(() => {
      notification.close()
    }, 5000)
  }

  return notification
}

// Register service worker for push notifications (if supported)
export async function registerServiceWorkerForPush(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null
  }

  try {
    const registration = await navigator.serviceWorker.ready
    return registration
  } catch (error) {
    console.error('Service worker registration failed:', error)
    return null
  }
}

// Subscribe to push notifications (requires backend/VAPID keys)
export async function subscribeToPushNotifications(
  registration: ServiceWorkerRegistration
): Promise<PushSubscription | null> {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: null, // VAPID public key would go here
    })
    return subscription
  } catch (error) {
    console.error('Push subscription failed:', error)
    return null
  }
}

// Habit reminder notification
export function showHabitReminder(habitName: string): Notification | null {
  return showNotification({
    title: 'Habit Reminder',
    body: `Don't forget to complete "${habitName}" today!`,
    tag: `habit-reminder-${habitName}`,
    icon: '/icons/icon-192.png',
  })
}

// Achievement unlocked notification
export function showAchievementUnlocked(achievementName: string, xpReward: number): Notification | null {
  return showNotification({
    title: 'Achievement Unlocked!',
    body: `You unlocked "${achievementName}" and earned ${xpReward} XP!`,
    tag: 'achievement-unlocked',
    icon: '/icons/icon-192.png',
    requireInteraction: true,
  })
}

// Level up notification
export function showLevelUp(newLevel: number): Notification | null {
  return showNotification({
    title: 'Level Up!',
    body: `Congratulations! You reached level ${newLevel}!`,
    tag: 'level-up',
    icon: '/icons/icon-192.png',
    requireInteraction: true,
  })
}

// World unlocked notification
export function showWorldUnlocked(worldNumber: number): Notification | null {
  return showNotification({
    title: 'New World Unlocked!',
    body: `You've unlocked World ${worldNumber}! Continue your adventure!`,
    tag: 'world-unlocked',
    icon: '/icons/icon-192.png',
    requireInteraction: true,
  })
}

// Daily reminder notification
export function showDailyReminder(completedCount: number, totalCount: number): Notification | null {
  const remaining = totalCount - completedCount
  if (remaining === 0) {
    return showNotification({
      title: 'All Habits Complete!',
      body: 'Great job! You completed all your habits today!',
      tag: 'daily-complete',
      icon: '/icons/icon-192.png',
    })
  }

  return showNotification({
    title: 'Daily Habits Reminder',
    body: `You have ${remaining} habit${remaining > 1 ? 's' : ''} left to complete today!`,
    tag: 'daily-reminder',
    icon: '/icons/icon-192.png',
  })
}


