import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Target, TrendingUp, Sparkles, ArrowRight, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    {
      icon: Gift,
      title: "Välkommen till din gratis provperiod!",
      description: "Få full tillgång till alla premium-funktioner i 7 dagar. Inga begränsningar, inga kreditkort behövs.",
      content: (
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-4">
            <Gift className="w-10 h-10 text-white" />
          </div>
          <Badge className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 text-lg">
            🎁 7 dagar helt gratis
          </Badge>
          <p className="text-gray-600 text-lg leading-relaxed">
            Upptäck kraften i daglig tacksamhet och målsättning. Alla AI-insikter och premium-funktioner inkluderade!
          </p>
        </div>
      )
    },
    {
      icon: Heart,
      title: "Tacksamhet förändrar allt",
      description: "Forskning visar att daglig tacksamhet ökar lycka med 25% och förbättrar sömn.",
      content: (
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3">
              <div className="text-2xl mb-1">😊</div>
              <div className="font-semibold">+25% lycka</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3">
              <div className="text-2xl mb-1">😴</div>
              <div className="font-semibold">Bättre sömn</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3">
              <div className="text-2xl mb-1">💪</div>
              <div className="font-semibold">Mindre stress</div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3">
              <div className="text-2xl mb-1">🫶</div>
              <div className="font-semibold">Starkare relationer</div>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Target,
      title: "Sätt och nå dina mål",
      description: "Kombinera tacksamhet med målsättning för maximal effekt på ditt välmående.",
      content: (
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center mb-4">
            <Target className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-lg p-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
              <span className="text-gray-700">Sätt ett meningsfullt mål</span>
            </div>
            <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-lg p-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
              <span className="text-gray-700">Ta små steg varje dag</span>
            </div>
            <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-lg p-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
              <span className="text-gray-700">Reflektera över framstegen</span>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Sparkles,
      title: "AI hjälper dig växa",
      description: "Få personliga insikter och rekommendationer baserat på dina reflektion.",
      content: (
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <div className="text-sm text-gray-600 mb-2">Exempel på AI-insikt:</div>
            <div className="text-gray-800 italic">
              "Du tenderar att vara mest tacksam på måndagar och onsdagar. Dina mål relaterade till hälsa får mest framsteg när du kombinerar dem med familjetid."
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Upptäck mönster du inte visste att du hade och få tips för att nå dina mål snabbare.
          </p>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark onboarding as completed and navigate to app
      storage.setOnboardingCompleted();
      storage.setTrialStartDate();
      navigate("/");
    }
  };

  const handleSkip = () => {
    storage.setOnboardingCompleted();
    storage.setTrialStartDate();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card border-white/30 shadow-strong">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-between items-center mb-4">
            <Badge variant="secondary" className="text-xs">
              {currentStep + 1} av {steps.length}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700"
            >
              Hoppa över
            </Button>
          </div>
          <Progress value={progress} className="h-2 mb-6" />
          <CardTitle className="text-xl text-gray-800 mb-2">
            {currentStepData.title}
          </CardTitle>
          <p className="text-gray-600 text-sm leading-relaxed">
            {currentStepData.description}
          </p>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="mb-8">
            {currentStepData.content}
          </div>
          
          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1"
              >
                Tillbaka
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="flex-1 btn-gradient text-white font-semibold shadow-medium hover:shadow-strong transition-all duration-200"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Börja min resa!
                </>
              ) : (
                <>
                  Nästa
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}