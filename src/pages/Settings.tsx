import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bell, Crown, Sparkles, AlertCircle, CheckCircle, TestTube } from "lucide-react";
import { storage, NotificationSettings } from "@/lib/storage";
import { notifications } from "@/lib/notifications";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";

export default function Settings() {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enabled: false,
    time: '20:00',
    message: 'Ta en stund att reflektera över din dag och vad du är tacksam för. 💫',
    permission: 'default'
  });
  const [isPremium, setIsPremium] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const prefs = storage.getPreferences();
    setNotificationSettings({
      ...prefs.notifications,
      permission: Notification.permission as any
    });
    setIsPremium(prefs.isPremium);
    setTrialDaysLeft(storage.getTrialDaysLeft());
  }, []);

  const handleNotificationToggle = async () => {
    if (!notificationSettings.enabled) {
      // Trying to enable notifications
      const hasPermission = await notifications.requestPermission();
      
      if (hasPermission) {
        const newSettings = { ...notificationSettings, enabled: true, permission: 'granted' as const };
        setNotificationSettings(newSettings);
        storage.setNotificationSettings(newSettings);
        
        // Schedule daily reminder
        notifications.scheduleDailyReminder(newSettings);
        
        toast({
          title: "Påminnelser aktiverade! 🔔",
          description: `Du kommer få en påminnelse kl ${newSettings.time} varje dag.`,
        });
      } else {
        setNotificationSettings(prev => ({ ...prev, permission: 'denied' }));
        storage.setNotificationSettings({ permission: 'denied' });
        
        toast({
          title: "Påminnelser blockerade",
          description: "Du behöver tillåta notifikationer i webbläsarens inställningar.",
          variant: "destructive"
        });
      }
    } else {
      // Disabling notifications
      const newSettings = { ...notificationSettings, enabled: false };
      setNotificationSettings(newSettings);
      storage.setNotificationSettings(newSettings);
      
      toast({
        title: "Påminnelser avaktiverade",
        description: "Du kommer inte längre få dagliga påminnelser.",
      });
    }
  };

  const handleTimeChange = (time: string) => {
    const newSettings = { ...notificationSettings, time };
    setNotificationSettings(newSettings);
    storage.setNotificationSettings(newSettings);
    
    if (newSettings.enabled) {
      notifications.scheduleDailyReminder(newSettings);
    }
    
    toast({
      title: "Tid uppdaterad",
      description: `Påminnelser kommer nu kl ${time}.`,
    });
  };

  const handleMessageChange = (message: string) => {
    const newSettings = { ...notificationSettings, message };
    setNotificationSettings(newSettings);
    storage.setNotificationSettings(newSettings);
  };

  const handleTestNotification = () => {
    notifications.test();
  };

  const handleUpgradeToPremium = () => {
    storage.setPremium(true);
    setIsPremium(true);
    
    toast({
      title: "🎉 Välkommen till Premium!",
      description: "Du har nu full tillgång till alla premium-funktioner.",
      duration: 4000,
    });
  };

  const getNotificationStatusIcon = () => {
    switch (notificationSettings.permission) {
      case 'granted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'denied':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Layout>
      <div className="p-4 max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800 shimmer">
              ⚙️ Inställningar
            </h1>
            {trialDaysLeft > 0 && !isPremium && (
              <Badge className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-2 py-1 text-xs">
                🎁 {trialDaysLeft} dagar kvar
              </Badge>
            )}
          </div>
          <p className="text-gray-600 text-lg">Anpassa din upplevelse</p>
        </div>

        <div className="space-y-4">
          {/* Notification Settings */}
          <Card className="glass-card border-white/30 shadow-medium hover-lift animate-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                <Bell className="w-5 h-5 text-blue-500" />
                Dagliga påminnelser
                {getNotificationStatusIcon()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Aktivera påminnelser</Label>
                    <p className="text-sm text-muted-foreground">
                      Få dagliga notifikationer att reflektera
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.enabled}
                    onCheckedChange={handleNotificationToggle}
                  />
                </div>

                {notificationSettings.permission === 'denied' && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription className="text-red-800 text-sm">
                      Notifikationer är blockerade. Tillåt dem i webbläsarinställningar för att få påminnelser.
                    </AlertDescription>
                  </Alert>
                )}

                {notificationSettings.enabled && (
                  <>
                    <div>
                      <Label htmlFor="reminder-time">Tid för påminnelse</Label>
                      <Input
                        id="reminder-time"
                        type="time"
                        value={notificationSettings.time}
                        onChange={(e) => handleTimeChange(e.target.value)}
                        className="mt-2 bg-white/50 border-white/30 focus:bg-white/70"
                      />
                    </div>

                    <div>
                      <Label htmlFor="reminder-message">Påminnelsemeddelande</Label>
                      <Textarea
                        id="reminder-message"
                        value={notificationSettings.message}
                        onChange={(e) => handleMessageChange(e.target.value)}
                        placeholder="Anpassa ditt påminnelsemeddelande..."
                        className="mt-2 resize-none bg-white/50 border-white/30 focus:bg-white/70"
                        rows={3}
                        maxLength={100}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {notificationSettings.message.length}/100 tecken
                      </div>
                    </div>

                    <Button
                      onClick={handleTestNotification}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <TestTube className="w-4 h-4 mr-2" />
                      Testa notifikation
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Premium Settings */}
          <Card className="glass-card border-white/30 shadow-medium hover-lift animate-in" style={{animationDelay: '0.1s'}}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                <Crown className="w-5 h-5 text-yellow-500" />
                Premium
                {isPremium && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Aktivt
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isPremium ? (
                <div className="text-center space-y-2">
                  <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
                  <h3 className="font-semibold text-gray-800">Tack för ditt stöd! 🙏</h3>
                  <p className="text-sm text-gray-600">
                    Du har tillgång till alla premium-funktioner.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-800 mb-2">Uppgradera till Premium</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
                      <div>✨ AI-insikter</div>
                      <div>📊 Avancerad statistik</div>
                      <div>💾 Export-funktion</div>
                      <div>🚫 Ingen reklam</div>
                    </div>
                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold text-orange-600">99 kr/mån</div>
                      <div className="text-sm text-orange-700">eller 299 kr/år</div>
                    </div>
                    <Button
                      onClick={handleUpgradeToPremium}
                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Uppgradera nu
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* App Info */}
          <Card className="glass-card border-white/30 shadow-medium hover-lift animate-in" style={{animationDelay: '0.2s'}}>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-gray-800 text-xl">✨ 3 Saker Idag</h3>
                <p className="text-sm text-gray-600">
                  En enkel tacksamhetsdagbok för att fokusera på det positiva i livet.
                </p>
                <Badge className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-3 py-1">
                  Version 2.0
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}