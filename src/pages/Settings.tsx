import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { getSettings, updateSettings, type AppSettings } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Bell, Crown, Clock, Heart } from 'lucide-react';
import Layout from '@/components/Layout';

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings>({
    reminderTime: '20:00',
    isPro: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const currentSettings = getSettings();
    setSettings(currentSettings);
  }, []);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      updateSettings(settings);
      toast({
        title: "Inställningar sparade",
        description: "Dina inställningar har uppdaterats."
      });
    } catch (error) {
      toast({
        title: "Fel",
        description: "Kunde inte spara inställningarna.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProToggle = () => {
    const newProStatus = !settings.isPro;
    setSettings(prev => ({ ...prev, isPro: newProStatus }));
    
    // Auto-save Pro status
    updateSettings({ isPro: newProStatus });
    
    toast({
      title: newProStatus ? "Pro aktiverat! 🌟" : "Pro inaktiverat",
      description: newProStatus 
        ? "Du har nu tillgång till Pro-funktioner." 
        : "Pro-funktioner är nu inaktiverade."
    });
  };

  return (
    <Layout showProBanner={!settings.isPro}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Inställningar
          </h2>
          <p className="text-sm text-muted-foreground">
            Anpassa din tacksamhetsupplevelse
          </p>
        </div>

        {/* Pro Status */}
        <Card className="bg-gradient-card shadow-card border-border/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/30 rounded-lg">
                <Crown className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  3 Saker Idag Pro
                </h3>
                <p className="text-sm text-muted-foreground">
                  {settings.isPro ? 'Pro-funktioner aktiverade' : 'Ta bort annonser och få extra funktioner'}
                </p>
              </div>
            </div>
            <Switch
              checked={settings.isPro}
              onCheckedChange={handleProToggle}
            />
          </div>
          
          {!settings.isPro && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <Button
                onClick={handleProToggle}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Crown className="h-4 w-4 mr-2" />
                Aktivera Pro (Demo)
              </Button>
            </div>
          )}
        </Card>

        {/* Reminder Settings */}
        <Card className="bg-gradient-card shadow-card border-border/50 p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/30 rounded-lg">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  Daglig påminnelse
                </h3>
                <p className="text-sm text-muted-foreground">
                  När vill du bli påmind att skriva?
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Tid för påminnelse
                </label>
                <Input
                  type="time"
                  value={settings.reminderTime}
                  onChange={(e) => setSettings(prev => ({ ...prev, reminderTime: e.target.value }))}
                  className="bg-background/50 border-border/50 focus:border-primary"
                />
              </div>
              
              <p className="text-xs text-muted-foreground">
                💡 Push-notiser kommer att aktiveras när appen körs som native app
              </p>
            </div>
          </div>
        </Card>

        {/* App Info */}
        <Card className="bg-gradient-card shadow-card border-border/50 p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/30 rounded-lg">
                <Heart className="h-5 w-5 text-primary fill-current" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  Om 3 Saker Idag
                </h3>
                <p className="text-sm text-muted-foreground">
                  En enkel tacksamhetsdagbok för vardagsglädjen
                </p>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>Version: 1.0.0</p>
              <p>Skapad med kärlek för daglig reflektion</p>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <Button
          onClick={handleSaveSettings}
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isLoading ? 'Sparar...' : 'Spara inställningar'}
        </Button>
      </div>
    </Layout>
  );
}