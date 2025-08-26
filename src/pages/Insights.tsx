import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  Heart, 
  Target, 
  Crown,
  Lock,
  Zap,
  BarChart3,
  MessageCircle
} from "lucide-react";
import { storage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";

export default function Insights() {
  const [entries, setEntries] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [isTrialActive, setIsTrialActive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const allEntries = storage.getEntries();
    const prefs = storage.getPreferences();
    
    setEntries(allEntries);
    setStreak(storage.getStreak());
    setTrialDaysLeft(storage.getTrialDaysLeft());
    setIsPremium(prefs.isPremium);
    setIsTrialActive(storage.isTrialActive());
  }, []);

  const handleUpgradeToPremium = () => {
    // In real app, this would open payment flow
    storage.setPremium(true);
    setIsPremium(true);
    
    toast({
      title: "🎉 Välkommen till Premium!",
      description: "Du har nu full tillgång till alla AI-insikter och premium-funktioner.",
      duration: 4000,
    });
  };

  const generateMockInsights = () => {
    const insights = [
      {
        type: "pattern",
        icon: <TrendingUp className="w-5 h-5" />,
        title: "Dina tacksamhetsmönster",
        content: "Du är mest tacksam på måndagar och onsdagar. Dina posts innehåller ofta ord som 'familj', 'hälsa' och 'natur'.",
        confidence: 89
      },
      {
        type: "goal",
        icon: <Target className="w-5 h-5" />,
        title: "Måluppfyllelse",
        content: "Dina mål relaterade till hälsa får 73% genomslag när du kombinerar dem med familjetid. Rekommendation: Planera träning tillsammans med familjen.",
        confidence: 76
      },
      {
        type: "emotion",
        icon: <Heart className="w-5 h-5" />,
        title: "Känslomässig trend",
        content: "Din positiva attityd har ökat med 15% senaste veckan. Största källorna till lycka: natur (32%), relationer (28%), och personlig utveckling (22%).",
        confidence: 92
      },
      {
        type: "recommendation",
        icon: <Sparkles className="w-5 h-5" />,
        title: "Personlig rekommendation",
        content: "Baserat på dina mönster: Försök reflektera över naturen på söndagar - det kan öka din veckostart med 25%.",
        confidence: 81
      }
    ];
    
    return insights;
  };

  const mockInsights = generateMockInsights();
  const hasAccess = isPremium || isTrialActive;

  const renderPaywall = () => (
    <div className="space-y-6">
      <Card className="glass-card border-white/30 shadow-strong bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-xl text-gray-800 mb-2">
            🚀 Lås upp AI-insikter
          </CardTitle>
          <p className="text-gray-600 leading-relaxed">
            Få djupa personliga insikter och rekommendationer baserat på din tacksamhetsdata
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-lg p-3">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-gray-700">Upptäck dina tacksamhetsmönster</span>
            </div>
            <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-lg p-3">
              <Target className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-700">Personliga målrekommendationer</span>
            </div>
            <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-lg p-3">
              <BarChart3 className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">Detaljerad framstegsanalys</span>
            </div>
            <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-lg p-3">
              <MessageCircle className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-gray-700">AI-drivna vardagsråd</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">99 kr/månad</div>
            <div className="text-sm text-orange-700">Eller 299 kr/år (spara 70%)</div>
            <div className="text-xs text-orange-600 mt-1">7 dagar gratis, avsluta när som helst</div>
          </div>

          <Button 
            onClick={handleUpgradeToPremium}
            className="w-full btn-gradient text-white font-semibold py-4 text-lg shadow-medium hover:shadow-strong transition-all duration-200"
            size="lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Starta Premium nu
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderInsightPreview = (insight: any, isBlurred: boolean = false) => (
    <Card 
      key={insight.title}
      className={`glass-card border-white/30 shadow-medium hover-lift transition-all duration-300 ${
        isBlurred ? 'relative' : ''
      }`}
    >
      {isBlurred && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <Lock className="w-8 h-8 mx-auto mb-2 text-gray-500" />
            <p className="text-sm font-medium text-gray-600">Premium krävs</p>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          {insight.icon}
          <span>{insight.title}</span>
          <Badge className="ml-auto text-xs bg-gradient-to-r from-purple-400 to-pink-400 text-white">
            <Zap className="w-3 h-3 mr-1" />
            {insight.confidence}% säker
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          {insight.content}
        </p>
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>AI-säkerhet</span>
            <span>{insight.confidence}%</span>
          </div>
          <Progress value={insight.confidence} className="h-1" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="p-4 max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 shimmer">
            ✨ AI-insikter
          </h1>
          <p className="text-gray-600 text-lg">
            Personliga rekommendationer baserat på din data
          </p>
          
          {trialDaysLeft > 0 && !isPremium && (
            <Badge className="mt-3 bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 py-1">
              🎁 {trialDaysLeft} dagar gratis kvar
            </Badge>
          )}
        </div>

        {entries.length < 3 && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Calendar className="w-4 h-4" />
            <AlertDescription className="text-blue-800">
              Fyll i minst 3 dagars reflektion för att få dina första AI-insikter!
              Du har {entries.length} av 3 poster.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {entries.length >= 3 ? (
            <>
              {hasAccess ? (
                // Show full insights for premium/trial users
                mockInsights.map(insight => renderInsightPreview(insight, false))
              ) : (
                // Show preview with paywall for free users
                <>
                  {renderInsightPreview(mockInsights[0], false)}
                  {renderInsightPreview(mockInsights[1], true)}
                  {renderInsightPreview(mockInsights[2], true)}
                  
                  <div className="mt-6">
                    {renderPaywall()}
                  </div>
                </>
              )}
            </>
          ) : (
            <Card className="glass-card border-white/30 shadow-medium text-center">
              <CardContent className="pt-6">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="font-semibold text-gray-800 mb-2">
                  Dina AI-insikter väntar
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Fortsätt fylla i dina dagliga reflektioner för att låsa upp 
                  personliga insikter och rekommendationer.
                </p>
                <Progress 
                  value={(entries.length / 3) * 100} 
                  className="mt-4 h-2"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {entries.length} av 3 poster klara
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}