import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Lock, CheckCircle } from "lucide-react";
import { storage, Achievement } from "@/lib/storage";
import Layout from "@/components/Layout";

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [availableAchievements, setAvailableAchievements] = useState<Achievement[]>([]);
  const [streak, setStreak] = useState(0);
  const [entriesCount, setEntriesCount] = useState(0);

  useEffect(() => {
    const userAchievements = storage.getAchievements();
    const allAchievements = storage.getAvailableAchievements();
    const entries = storage.getEntries();
    
    setAchievements(userAchievements);
    setAvailableAchievements(allAchievements);
    setStreak(storage.getStreak());
    setEntriesCount(entries.length);
  }, []);

  const isUnlocked = (achievementId: string) => {
    return achievements.some(a => a.id === achievementId && a.unlockedAt);
  };

  const getProgress = (achievementId: string) => {
    switch (achievementId) {
      case "first-entry":
        return Math.min(100, (entriesCount / 1) * 100);
      case "week-streak":
        return Math.min(100, (streak / 7) * 100);
      case "month-streak":
        return Math.min(100, (streak / 30) * 100);
      case "goal-setter":
        const hasGoal = storage.getEntries().some(e => e.goal?.trim());
        return hasGoal ? 100 : 0;
      case "action-taker":
        const hasDailyAction = storage.getEntries().some(e => e.dailyAction?.trim());
        return hasDailyAction ? 100 : 0;
      default:
        return 0;
    }
  };

  const getProgressText = (achievementId: string) => {
    switch (achievementId) {
      case "first-entry":
        return `${entriesCount}/1 post`;
      case "week-streak":
        return `${streak}/7 dagar`;
      case "month-streak":
        return `${streak}/30 dagar`;
      case "goal-setter":
        return storage.getEntries().some(e => e.goal?.trim()) ? "Klart!" : "Sätt ett mål";
      case "action-taker":
        return storage.getEntries().some(e => e.dailyAction?.trim()) ? "Klart!" : "Gör en handling";
      default:
        return "";
    }
  };

  const unlockedCount = achievements.filter(a => a.unlockedAt).length;
  const totalCount = availableAchievements.length;

  return (
    <Layout>
      <div className="p-4 max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 shimmer">
            🏆 Utmärkelser
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            {unlockedCount} av {totalCount} upplåsta
          </p>
          <Progress 
            value={(unlockedCount / totalCount) * 100} 
            className="h-3 mb-4"
          />
        </div>

        <div className="space-y-4">
          {availableAchievements.map((achievement) => {
            const unlocked = isUnlocked(achievement.id);
            const progress = getProgress(achievement.id);
            const progressText = getProgressText(achievement.id);

            return (
              <Card 
                key={achievement.id} 
                className={`glass-card border-white/30 shadow-medium hover-lift transition-all duration-300 ${
                  unlocked ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <div className={`text-2xl ${unlocked ? 'animate-pulse' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={unlocked ? 'text-gray-800' : 'text-gray-500'}>
                            {achievement.title}
                          </span>
                          {unlocked ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Lock className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <p className={`text-sm mt-1 ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                          {achievement.description}
                        </p>
                      </div>
                    </CardTitle>
                    {unlocked && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                        <Trophy className="w-3 h-3 mr-1" />
                        Upplåst!
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                {!unlocked && (
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Framsteg</span>
                        <span className="text-sm text-gray-500">{progressText}</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </CardContent>
                )}

                {unlocked && achievements.find(a => a.id === achievement.id)?.unlockedAt && (
                  <CardContent className="pt-0">
                    <div className="text-xs text-gray-500">
                      Upplåst: {new Date(achievements.find(a => a.id === achievement.id)!.unlockedAt!).toLocaleDateString("sv-SE")}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {unlockedCount > 0 && (
          <Card className="mt-6 glass-card border-white/30 shadow-medium">
            <CardContent className="pt-6 text-center">
              <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
              <h3 className="font-semibold text-gray-800 mb-2">Fantastiskt jobbat! 🎉</h3>
              <p className="text-sm text-gray-600">
                Du har redan låst upp {unlockedCount} utmärkelse{unlockedCount !== 1 ? 'r' : ''}. 
                Fortsätt din tacksamhetsresa för att låsa upp fler!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}