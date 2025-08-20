export interface GratitudeEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  line1: string;
  line2: string;
  line3: string;
  timestamp: number;
}

export interface AppSettings {
  reminderTime: string; // HH:MM format
  isPro: boolean;
}

const STORAGE_KEYS = {
  ENTRIES: 'gratitude_entries',
  SETTINGS: 'app_settings'
} as const;

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
  reminderTime: '20:00',
  isPro: false
};

// Entries management
export function getEntries(): GratitudeEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading entries:', error);
    return [];
  }
}

export function saveEntry(entry: Omit<GratitudeEntry, 'id' | 'timestamp'>): void {
  try {
    const entries = getEntries();
    const newEntry: GratitudeEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };
    
    // Remove existing entry for the same date if it exists
    const filtered = entries.filter(e => e.date !== entry.date);
    filtered.unshift(newEntry);
    
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error saving entry:', error);
    throw new Error('Kunde inte spara inlägget');
  }
}

export function getEntryByDate(date: string): GratitudeEntry | null {
  const entries = getEntries();
  return entries.find(entry => entry.date === date) || null;
}

export function deleteEntry(id: string): void {
  try {
    const entries = getEntries();
    const filtered = entries.filter(entry => entry.id !== id);
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting entry:', error);
    throw new Error('Kunde inte ta bort inlägget');
  }
}

// Settings management
export function getSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!stored) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch (error) {
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
}

export function updateSettings(settings: Partial<AppSettings>): void {
  try {
    const current = getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving settings:', error);
    throw new Error('Kunde inte spara inställningarna');
  }
}

// Streak calculation
export function calculateStreak(): number {
  const entries = getEntries();
  if (entries.length === 0) return 0;
  
  const today = new Date().toISOString().split('T')[0];
  const entryDates = new Set(entries.map(e => e.date));
  
  let streak = 0;
  let currentDate = new Date();
  
  // If today has no entry, start from yesterday
  if (!entryDates.has(today)) {
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  // Count backwards while we have consecutive entries
  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (!entryDates.has(dateStr)) {
      break;
    }
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return streak;
}

// Export functionality
export function exportEntries(): string {
  const entries = getEntries();
  const sorted = entries.sort((a, b) => a.date.localeCompare(b.date));
  
  let exportText = '3 Saker Idag - Tacksamhetsdagbok\n';
  exportText += '================================\n\n';
  
  sorted.forEach(entry => {
    const date = new Date(entry.date).toLocaleDateString('sv-SE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    exportText += `${date}\n`;
    exportText += `1. ${entry.line1}\n`;
    exportText += `2. ${entry.line2}\n`;
    exportText += `3. ${entry.line3}\n\n`;
  });
  
  return exportText;
}