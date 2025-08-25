import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Bell, Crown, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";

export default function Settings() {
  const [reminderTime, setReminderTime] = useState("19:00");
  const [isPro, setIsPro] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load settings from localStorage
    const savedTime = localStorage.getItem("reminder-time");
    const savedPro = localStorage.getItem("is-pro");
    
    if (savedTime) setReminderTime(savedTime);
    if (savedPro) setIsPro(savedPro === "true");
  }, []);

  const handleReminderTimeChange = (time: string) => {
    setReminderTime(time);
    localStorage.setItem("reminder-time", time);
    toast({
      title: "Påminnelse sparad",
      description: `Du kommer få en påminnelse kl ${time} varje dag.`,
    });
  };

  const handleProToggle = () => {
    const newProStatus = !isPro;
    setIsPro(newProStatus);
    localStorage.setItem("is-pro", newProStatus.toString());
    
    toast({
      title: newProStatus ? "Pro aktiverat!" : "Pro inaktiverat",
      description: newProStatus 
        ? "Tack för ditt stöd! Reklam är nu borttagen." 
        : "Reklam visas nu igen.",
    });
  };

  return (
    <Layout>
      <div className="p-4 max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 shimmer">
            ⚙️ Inställningar
          </h1>
          <p className="text-gray-600 text-lg">Anpassa din upplevelse</p>
        </div>

        <div className="space-y-4">
          {/* Reminder Settings */}
          <Card className="glass-card border-white/30 shadow-medium hover-lift animate-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                <Bell className="w-5 h-5 text-blue-500" />
                Daglig påminnelse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reminder-time">Tid för påminnelse</Label>
                  <Select value={reminderTime} onValueChange={handleReminderTimeChange}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="07:00">07:00 - Morgon</SelectItem>
                      <SelectItem value="12:00">12:00 - Lunch</SelectItem>
                      <SelectItem value="18:00">18:00 - Kväll</SelectItem>
                      <SelectItem value="19:00">19:00 - Kväll</SelectItem>
                      <SelectItem value="20:00">20:00 - Kväll</SelectItem>
                      <SelectItem value="21:00">21:00 - Kväll</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-sm text-muted-foreground">
                  * Push-notiser kommer att aktiveras när appen packas som native app.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pro Settings */}
          <Card className="glass-card border-white/30 shadow-medium hover-lift animate-in" style={{animationDelay: '0.1s'}}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                <Crown className="w-5 h-5 text-yellow-500" />
                Pro-version
                {isPro && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Aktivt
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="pro-toggle">Ta bort reklam</Label>
                  <p className="text-sm text-muted-foreground">
                    Stöd appen och få en reklamfri upplevelse
                  </p>
                </div>
                <Switch
                  id="pro-toggle"
                  checked={isPro}
                  onCheckedChange={handleProToggle}
                />
              </div>
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
                <Badge className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-3 py-1">Version 1.0</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}