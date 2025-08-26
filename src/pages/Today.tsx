import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Heart, Flame, Target, Zap, ToggleLeft, ToggleRight, Trophy, Sparkles, ArrowRight } from "lucide-react";
import { storage, Achievement } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";

export default function Today() {
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [line3, setLine3] = useState("");
  const [goal, setGoal] = useState("");
  const [dailyAction, setDailyAction] = useState("");
  const [streak, setStreak] = useState(0);
  const [isDetailedMode, setIsDetailedMode] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);
  const [entriesCount, setEntriesCount] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("sv-SE");

  useEffect(() => {
    // Load today's entry if it exists
    const todaysEntry = storage.getTodaysEntry();
    if (todaysEntry) {
      setLine1(todaysEntry.line1);
      setLine2(todaysEntry.line2);
      setLine3(todaysEntry.line3);
      setGoal(todaysEntry.goal || "");
      setDailyAction(todaysEntry.dailyAction || "");
    }

    // Load user preferences
    const prefs = storage.getPreferences();
    setIsDetailedMode(prefs.preferredMode === 'detailed');
    
    // Load streak and trial info
    const allEntries = storage.getEntries();
    setStreak(storage.getStreak());
    setTrialDaysLeft(storage.getTrialDaysLeft());
    setEntriesCount(allEntries.length);
  }, []);

  const handleModeToggle = (detailed: boolean) => {
    setIsDetailedMode(detailed);
    storage.setPreferredMode(detailed ? 'detailed' : 'simple');
  };

  const handleSave = () => {
    const requiredFields = isDetailedMode 
      ? [line1.trim(), line2.trim(), line3.trim()]
      : [line1.trim()];
    
    if (requiredFields.some(field => !field)) {
      toast({
        title: "Ofullständig post",
        description: isDetailedMode 
          ? "Fyll i alla tre tacksamhetsfält innan du sparar."
          : "Fyll i tacksamhetsfältet innan du sparar.",
        variant: "destructive",
      });
      return;
    }

    storage.saveEntry({
      date: new Date().toISOString().split("T")[0],
      line1: line1.trim(),
      line2: line2.trim() || "",
      line3: line3.trim() || "",
      goal: goal.trim() || undefined,
      dailyAction: dailyAction.trim() || undefined,
    });

    setStreak(storage.getStreak());
    
    // Check for new achievements
    const newAchievements = storage.checkAndUnlockAchievements();
    if (newAchievements.length > 0) {
      newAchievements.forEach(achievement => {
        toast({
          title: "🎉 Ny utmärkelse!",
          description: `${achievement.icon} ${achievement.title}: ${achievement.description}`,
          duration: 4000,
        });
      });
    }
    
    toast({
      title: "Sparat!",
      description: "Din tacksamhetspost för idag har sparats.",
    });
  };

  return (
    <Layout>
      <div className="p-4 max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800 shimmer">
              ✨ 3 Saker Idag
            </h1>
            {trialDaysLeft > 0 && (
              <Badge className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-2 py-1 text-xs">
                🎁 {trialDaysLeft} dagar kvar
              </Badge>
            )}
          </div>
          <p className="text-gray-600 text-lg mb-4">{today}</p>
          
          {streak > 0 && (
            <Badge className="mb-4 bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 shadow-medium animate-in">
              <Flame className="w-4 h-4 mr-1" />
              {streak} dag{streak !== 1 ? "ar" : ""} i rad 🔥
            </Badge>
          )}

          {/* Mode toggle */}
          <div className="flex items-center justify-center gap-3 bg-white/50 backdrop-blur-sm rounded-lg p-3 mb-4">
            <Label htmlFor="mode-toggle" className="text-sm font-medium">
              {isDetailedMode ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
            </Label>
            <Switch
              id="mode-toggle"
              checked={isDetailedMode}
              onCheckedChange={handleModeToggle}
            />
            <span className="text-sm text-gray-600">
              {isDetailedMode ? "Detaljerat läge" : "Enkelt läge"}
            </span>
          </div>
        </div>

        {/* Gratitude Card */}
        <Card className="mb-4 glass-card border-white/30 shadow-medium hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
              <Heart className="w-5 h-5 text-rose-500" />
              {isDetailedMode ? "Vad är du tacksam för idag?" : "Vad är du mest tacksam för idag?"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Simple mode - single field */}
            {!isDetailedMode && (
              <div>
                <Textarea
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  placeholder="Beskriv något du verkligen uppskattar idag..."
                  className="resize-none touch-manipulation bg-white/50 border-white/30 focus:bg-white/70 transition-all duration-200 backdrop-blur-sm"
                  rows={4}
                  maxLength={300}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {line1.length}/300 tecken
                </div>
              </div>
            )}

            {/* Detailed mode - three fields */}
            {isDetailedMode && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    1. Första saken:
                  </label>
                  <Textarea
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    placeholder="Något du uppskattar..."
                    className="resize-none touch-manipulation bg-white/50 border-white/30 focus:bg-white/70 transition-all duration-200 backdrop-blur-sm"
                    rows={3}
                    maxLength={200}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    2. Andra saken:
                  </label>
                  <Textarea
                    value={line2}
                    onChange={(e) => setLine2(e.target.value)}
                    placeholder="Något som gjorde dig glad..."
                    className="resize-none touch-manipulation bg-white/50 border-white/30 focus:bg-white/70 transition-all duration-200 backdrop-blur-sm"
                    rows={3}
                    maxLength={200}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    3. Tredje saken:
                  </label>
                  <Textarea
                    value={line3}
                    onChange={(e) => setLine3(e.target.value)}
                    placeholder="Något som fick dig att le..."
                    className="resize-none touch-manipulation bg-white/50 border-white/30 focus:bg-white/70 transition-all duration-200 backdrop-blur-sm"
                    rows={3}
                    maxLength={200}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Goals Card */}
        <Card className="mb-6 glass-card border-white/30 shadow-medium hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
              <Target className="w-5 h-5 text-blue-500" />
              Mål & Framsteg
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Vad vill du uppnå denna vecka? (valfritt)
              </label>
              <Input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="T.ex. träna 3 gånger, läsa en bok..."
                className="bg-white/50 border-white/30 focus:bg-white/70 transition-all duration-200 backdrop-blur-sm"
                maxLength={100}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Vad har du gjort för ditt mål idag? (valfritt)
              </label>
              <Input
                value={dailyAction}
                onChange={(e) => setDailyAction(e.target.value)}
                placeholder="En liten handling mot ditt mål..."
                className="bg-white/50 border-white/30 focus:bg-white/70 transition-all duration-200 backdrop-blur-sm"
                maxLength={100}
              />
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={handleSave}
          className="w-full btn-gradient text-white font-semibold py-4 text-lg shadow-medium hover:shadow-strong transition-all duration-200 mb-4"
          size="lg"
        >
          ✨ Spara dagens reflektion
        </Button>

        {/* AI Insights promotion after enough data */}
        {entriesCount >= 7 && (
          <Card className="mb-4 glass-card border-white/30 shadow-medium hover-lift bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    🎉 Dina AI-insikter är redo!
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Med {entriesCount} dagar av data kan vi nu ge dig personliga rekommendationer.
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/insights')}
                  size="sm"
                  className="bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:shadow-medium transition-all duration-200 flex-shrink-0"
                >
                  Se insikter
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}