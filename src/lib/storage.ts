export interface GratitudeEntry {
  id: string;
  date: string;
  line1: string;
  line2: string;
  line3: string;
  timestamp: number;
  goal?: string;
  dailyAction?: string;
  mood?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface NotificationSettings {
  enabled: boolean;
  time: string;
  message: string;
  permission: 'default' | 'granted' | 'denied';
}

export interface UserPreferences {
  onboardingCompleted: boolean;
  trialStartDate?: string;
  isPremium: boolean;
  notifications: NotificationSettings;
  preferredMode: 'simple' | 'detailed';
  achievements: Achievement[];
}

const STORAGE_KEY = "gratitude-entries";
const PREFS_KEY = "user-preferences";
const ACHIEVEMENTS_KEY = "achievements";

export const storage = {
  getEntries(): GratitudeEntry[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveEntry(entry: Omit<GratitudeEntry, "id" | "timestamp">): void {
    const entries = this.getEntries();
    const existingIndex = entries.findIndex(e => e.date === entry.date);
    
    const newEntry: GratitudeEntry = {
      ...entry,
      id: existingIndex >= 0 ? entries[existingIndex].id : Date.now().toString(),
      timestamp: Date.now(),
    };

    if (existingIndex >= 0) {
      entries[existingIndex] = newEntry;
    } else {
      entries.push(newEntry);
    }

    entries.sort((a, b) => b.date.localeCompare(a.date));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  },

  getTodaysEntry(): GratitudeEntry | null {
    const today = new Date().toISOString().split("T")[0];
    const entries = this.getEntries();
    return entries.find(entry => entry.date === today) || null;
  },

  getStreak(): number {
    const entries = this.getEntries();
    if (entries.length === 0) return 0;

    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    // Start from today and work backwards
    while (true) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const hasEntry = entries.some(entry => entry.date === dateStr);
      
      if (hasEntry) {
        streak++;
      } else if (streak > 0) {
        // If we've started counting and hit a gap, stop
        break;
      } else if (currentDate.toDateString() !== today.toDateString()) {
        // If no entry today and no streak yet, streak is 0
        break;
      }

      currentDate.setDate(currentDate.getDate() - 1);
      
      // Prevent infinite loop - stop after 365 days
      if (streak > 365) break;
    }

    return streak;
  },

  exportToText(): string {
    const entries = this.getEntries();
    if (entries.length === 0) return "Inga tacksamhetsposter att exportera.";

    let text = "Mina Tacksamhetsposter\n";
    text += "=".repeat(25) + "\n\n";

    entries.forEach(entry => {
      const date = new Date(entry.date);
      const formattedDate = date.toLocaleDateString("sv-SE", { 
        weekday: "long", 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
      });
      text += `Datum: ${formattedDate}\n`;
      text += `1. ${entry.line1}\n`;
      text += `2. ${entry.line2}\n`;
      text += `3. ${entry.line3}\n`;
      text += "-".repeat(40) + "\n\n";
    });

    text += `\nExporterad: ${new Date().toLocaleDateString("sv-SE")}\n`;
    text += "Från 3 Saker Idag - Tacksamhetsdagbok\n";

    return text;
  },

  // Clear all data (for debugging/reset)
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Get storage size
  getStorageSize(): number {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? new Blob([data]).size : 0;
  },

  // User preferences management
  getPreferences(): UserPreferences {
    const data = localStorage.getItem(PREFS_KEY);
    return data ? JSON.parse(data) : {
      onboardingCompleted: false,
      isPremium: false,
      notifications: {
        enabled: false,
        time: '20:00',
        message: 'Ta en stund att reflektera över din dag och vad du är tacksam för. 💫',
        permission: 'default'
      },
      preferredMode: 'simple',
      achievements: []
    };
  },

  setOnboardingCompleted(): void {
    const prefs = this.getPreferences();
    prefs.onboardingCompleted = true;
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  },

  setTrialStartDate(): void {
    const prefs = this.getPreferences();
    if (!prefs.trialStartDate) {
      prefs.trialStartDate = new Date().toISOString().split("T")[0];
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    }
  },

  getTrialDaysLeft(): number {
    const prefs = this.getPreferences();
    if (!prefs.trialStartDate || prefs.isPremium) return 0;
    
    const startDate = new Date(prefs.trialStartDate);
    const now = new Date();
    const diffTime = now.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, 7 - diffDays);
  },

  isTrialActive(): boolean {
    return this.getTrialDaysLeft() > 0;
  },

  setPremium(isPremium: boolean): void {
    const prefs = this.getPreferences();
    prefs.isPremium = isPremium;
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  },

  setPreferredMode(mode: 'simple' | 'detailed'): void {
    const prefs = this.getPreferences();
    prefs.preferredMode = mode;
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  },

  setNotificationSettings(settings: Partial<NotificationSettings>): void {
    const prefs = this.getPreferences();
    prefs.notifications = { ...prefs.notifications, ...settings };
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  },

  // Achievement system
  getAchievements(): Achievement[] {
    const prefs = this.getPreferences();
    return prefs.achievements || [];
  },

  unlockAchievement(achievementId: string): boolean {
    const prefs = this.getPreferences();
    const existing = prefs.achievements.find(a => a.id === achievementId);
    if (existing?.unlockedAt) return false;

    const achievement = this.getAvailableAchievements().find(a => a.id === achievementId);
    if (!achievement) return false;

    const unlockedAchievement = { ...achievement, unlockedAt: Date.now() };
    const existingIndex = prefs.achievements.findIndex(a => a.id === achievementId);
    
    if (existingIndex >= 0) {
      prefs.achievements[existingIndex] = unlockedAchievement;
    } else {
      prefs.achievements.push(unlockedAchievement);
    }

    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    return true;
  },

  getAvailableAchievements(): Achievement[] {
    return [
      {
        id: "first-entry",
        title: "Första steget",
        description: "Gjorde din första tacksamhetspost",
        icon: "🌱"
      },
      {
        id: "week-streak",
        title: "Veckan runt",
        description: "7 dagar i rad med tacksamhet",
        icon: "🔥"
      },
      {
        id: "month-streak",
        title: "Månadsmästare",
        description: "30 dagar i rad med tacksamhet",
        icon: "⭐"
      },
      {
        id: "goal-setter",
        title: "Målsättare",
        description: "Satte ditt första mål",
        icon: "🎯"
      },
      {
        id: "action-taker",
        title: "Handlingskraftig",
        description: "Genomförde din första målhandling",
        icon: "💪"
      }
    ];
  },

  checkAndUnlockAchievements(): Achievement[] {
    const newlyUnlocked: Achievement[] = [];
    const entries = this.getEntries();
    const streak = this.getStreak();
    
    // First entry
    if (entries.length >= 1) {
      if (this.unlockAchievement("first-entry")) {
        newlyUnlocked.push(this.getAvailableAchievements().find(a => a.id === "first-entry")!);
      }
    }
    
    // Streak achievements
    if (streak >= 7) {
      if (this.unlockAchievement("week-streak")) {
        newlyUnlocked.push(this.getAvailableAchievements().find(a => a.id === "week-streak")!);
      }
    }
    
    if (streak >= 30) {
      if (this.unlockAchievement("month-streak")) {
        newlyUnlocked.push(this.getAvailableAchievements().find(a => a.id === "month-streak")!);
      }
    }

    // Goal-related achievements
    const hasGoal = entries.some(e => e.goal?.trim());
    const hasDailyAction = entries.some(e => e.dailyAction?.trim());
    
    if (hasGoal) {
      if (this.unlockAchievement("goal-setter")) {
        newlyUnlocked.push(this.getAvailableAchievements().find(a => a.id === "goal-setter")!);
      }
    }
    
    if (hasDailyAction) {
      if (this.unlockAchievement("action-taker")) {
        newlyUnlocked.push(this.getAvailableAchievements().find(a => a.id === "action-taker")!);
      }
    }

    return newlyUnlocked;
  }
};