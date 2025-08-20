import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveEntry, getEntryByDate, calculateStreak } from '@/lib/storage';
import { Calendar, Flame } from 'lucide-react';
import Layout from '@/components/Layout';

export default function Today() {
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [line3, setLine3] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streak, setStreak] = useState(0);
  const { toast } = useToast();

  const today = new Date().toISOString().split('T')[0];
  const todayFormatted = new Date().toLocaleDateString('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  useEffect(() => {
    // Load existing entry for today
    const existingEntry = getEntryByDate(today);
    if (existingEntry) {
      setLine1(existingEntry.line1);
      setLine2(existingEntry.line2);
      setLine3(existingEntry.line3);
    }
    
    // Calculate streak
    setStreak(calculateStreak());
  }, [today]);

  const handleSave = async () => {
    if (!line1.trim() || !line2.trim() || !line3.trim()) {
      toast({
        title: "Fyll i alla fält",
        description: "Du behöver skriva tre saker du är tacksam för idag.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await saveEntry({
        date: today,
        line1: line1.trim(),
        line2: line2.trim(),
        line3: line3.trim()
      });

      // Recalculate streak
      setStreak(calculateStreak());

      toast({
        title: "Sparat! 🌟",
        description: "Din tacksamhet för idag har sparats."
      });
    } catch (error) {
      toast({
        title: "Fel",
        description: "Kunde inte spara dina tankar. Försök igen.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header with date and streak */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium capitalize">{todayFormatted}</span>
          </div>
          
          {streak > 0 && (
            <div className="flex items-center justify-center gap-2 bg-accent/30 rounded-full px-4 py-2">
              <Flame className="h-4 w-4 text-primary fill-current" />
              <span className="text-sm font-semibold text-foreground">
                {streak} {streak === 1 ? 'dag' : 'dagar'} i rad
              </span>
            </div>
          )}
        </div>

        {/* Main card */}
        <Card className="bg-gradient-card shadow-card border-border/50 p-6">
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Vad är du tacksam för idag?
              </h2>
              <p className="text-sm text-muted-foreground">
                Skriv tre saker som gjorde dig glad eller tacksam
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  1. En sak som fick dig att le
                </label>
                <Textarea
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  placeholder="Något som lyfte ditt humör..."
                  className="resize-none bg-background/50 border-border/50 focus:border-primary"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  2. Någon du är tacksam för
                </label>
                <Textarea
                  value={line2}
                  onChange={(e) => setLine2(e.target.value)}
                  placeholder="En person som betyder mycket för dig..."
                  className="resize-none bg-background/50 border-border/50 focus:border-primary"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  3. Något du uppskattade med dagen
                </label>
                <Textarea
                  value={line3}
                  onChange={(e) => setLine3(e.target.value)}
                  placeholder="En upplevelse eller stund som var fin..."
                  className="resize-none bg-background/50 border-border/50 focus:border-primary"
                  rows={2}
                />
              </div>
            </div>

            <Button 
              onClick={handleSave}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              {isLoading ? 'Sparar...' : 'Spara dagens tacksamhet ✨'}
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}