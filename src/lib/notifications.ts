// Simple notification system for daily reminders
export interface NotificationConfig {
  enabled: boolean;
  time: string; // HH:MM format
  message: string;
}

export const notifications = {
  // Request notification permission
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  },

  // Check if notifications are supported and permitted
  isSupported(): boolean {
    return 'Notification' in window && Notification.permission === 'granted';
  },

  // Show a notification
  show(title: string, options?: NotificationOptions): void {
    if (!this.isSupported()) {
      console.log('Notifications not supported or not permitted');
      return;
    }

    const defaultOptions: NotificationOptions = {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'gratitude-reminder',
      renotify: false,
      requireInteraction: false,
    };

    new Notification(title, { ...defaultOptions, ...options });
  },

  // Schedule daily reminder (simplified version)
  scheduleDailyReminder(config: NotificationConfig): void {
    if (!config.enabled || !this.isSupported()) {
      return;
    }

    const scheduleNext = () => {
      const now = new Date();
      const [hours, minutes] = config.time.split(':').map(Number);
      
      const reminderTime = new Date();
      reminderTime.setHours(hours, minutes, 0, 0);
      
      // If the time has passed today, schedule for tomorrow
      if (reminderTime <= now) {
        reminderTime.setDate(reminderTime.getDate() + 1);
      }
      
      const timeout = reminderTime.getTime() - now.getTime();
      
      setTimeout(() => {
        this.show('🌟 Dags för tacksamhet!', {
          body: config.message,
          actions: [
            { action: 'open', title: 'Öppna appen' },
            { action: 'dismiss', title: 'Stäng' }
          ]
        });
        
        // Schedule next day
        scheduleNext();
      }, timeout);
    };

    scheduleNext();
  },

  // Test notification
  test(): void {
    this.show('🧪 Test-notifikation', {
      body: 'Notifikationer fungerar! Du kommer få dagliga påminnelser.',
      requireInteraction: true
    });
  }
};

// Service worker registration for better notification support
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully:', registration);
    } catch (error) {
      console.log('Service Worker registration failed:', error);
    }
  }
};

// Default notification config
export const defaultNotificationConfig: NotificationConfig = {
  enabled: false,
  time: '20:00', // 8 PM
  message: 'Ta en stund att reflektera över din dag och vad du är tacksam för. 💫'
};