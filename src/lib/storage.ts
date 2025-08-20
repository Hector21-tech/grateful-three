export interface GratitudeEntry {
  id: string;
  date: string;
  line1: string;
  line2: string;
  line3: string;
  timestamp: number;
}

const STORAGE_KEY = "gratitude-entries";

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
      text += `Datum: ${entry.date}\n`;
      text += `1. ${entry.line1}\n`;
      text += `2. ${entry.line2}\n`;
      text += `3. ${entry.line3}\n`;
      text += "-".repeat(20) + "\n\n";
    });

    return text;
  }
};