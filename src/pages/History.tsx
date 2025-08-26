import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Download, ChevronDown, ChevronUp, Calendar, Crown, Lock, BarChart3, Target } from "lucide-react";
import { storage, GratitudeEntry } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";

export default function History() {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
  const [isPremium, setIsPremium] = useState(false);
  const [isTrialActive, setIsTrialActive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setEntries(storage.getEntries());
    const prefs = storage.getPreferences();
    setIsPremium(prefs.isPremium);
    setIsTrialActive(storage.isTrialActive());
  }, []);

  const filteredEntries = entries.filter(entry =>
    entry.line1.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.line2.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.line3.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.date.includes(searchTerm)
  );

  const toggleExpanded = (entryId: string) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(entryId)) {
      newExpanded.delete(entryId);
    } else {
      newExpanded.add(entryId);
    }
    setExpandedEntries(newExpanded);
  };

  const handleExport = () => {
    if (!isPremium && !isTrialActive) {
      toast({
        title: "Premium krävs",
        description: "Exportfunktionen kräver Premium-medlemskap.",
        variant: "destructive",
      });
      return;
    }

    const textContent = storage.exportToText();
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tacksamhetsdagbok-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export klar!",
      description: "Din tacksamhetsdagbok har laddats ner som .txt-fil.",
    });
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("sv-SE", { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  return (
    <Layout>
      <div className="p-4 max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 shimmer">
            📜 Historik
          </h1>
          <Badge className="bg-gradient-to-r from-blue-400 to-purple-500 text-white px-4 py-2 shadow-medium">
            <Calendar className="w-4 h-4 mr-1" />
            {entries.length} inlägg
          </Badge>
        </div>

        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sök i dina poster..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50 border-white/30 focus:bg-white/70 backdrop-blur-sm transition-all duration-200"
            />
          </div>

          <Button 
            onClick={handleExport}
            className={`w-full font-semibold py-3 shadow-medium hover:shadow-strong transition-all duration-200 hover-lift ${
              isPremium || isTrialActive 
                ? "bg-gradient-to-r from-green-400 to-blue-500 text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            disabled={entries.length === 0}
          >
            {isPremium || isTrialActive ? (
              <>
                <Download className="w-4 h-4 mr-2" />
                💾 Exportera som .txt
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                💾 Exportera (Premium)
              </>
            )}
          </Button>
        </div>

        {/* Premium upgrade prompt for non-premium users */}
        {!isPremium && !isTrialActive && entries.length > 5 && (
          <Alert className="mb-6 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <Crown className="w-4 h-4" />
            <AlertDescription className="text-purple-800">
              <div className="flex items-center justify-between">
                <div>
                  <strong>Uppgradera till Premium</strong>
                  <div className="text-sm mt-1">Få exportfunktion och avancerad statistik</div>
                </div>
                <Button 
                  onClick={handleUpgradeToPremium}
                  size="sm"
                  className="bg-gradient-to-r from-purple-400 to-pink-400 text-white ml-3 flex-shrink-0"
                >
                  Uppgradera
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Advanced analytics for premium users */}
        {(isPremium || isTrialActive) && entries.length > 0 && (
          <Card className="mb-4 glass-card border-white/30 shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Statistik
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">{entries.length}</div>
                  <div className="text-xs text-gray-600">Totalt poster</div>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.floor(entries.length / 7)}
                  </div>
                  <div className="text-xs text-gray-600">Veckor aktiv</div>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-600">
                    {entries.filter(e => e.goal?.trim()).length}
                  </div>
                  <div className="text-xs text-gray-600">Mål satta</div>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-2xl font-bold text-orange-600">
                    {entries.filter(e => e.dailyAction?.trim()).length}
                  </div>
                  <div className="text-xs text-gray-600">Handlingar gjorda</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {filteredEntries.length === 0 ? (
            <Card className="glass-card border-white/30 shadow-soft">
              <CardContent className="pt-6 text-center">
                <p className="text-gray-600">
                  {searchTerm ? "🔍 Inga matchande poster hittades." : "🌱 Inga poster ännu. Börja med att skriva något idag!"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredEntries.map((entry, index) => (
              <Card key={entry.id} className="glass-card border-white/30 shadow-soft hover-lift" style={{animationDelay: `${index * 0.1}s`}}>
                <Collapsible>
                  <CollapsibleTrigger
                    onClick={() => toggleExpanded(entry.id)}
                    className="w-full"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center justify-between text-sm">
                        <span>{formatDate(entry.date)}</span>
                        {expandedEntries.has(entry.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">1.</p>
                        <p className="text-sm">{entry.line1}</p>
                      </div>
                      {entry.line2 && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">2.</p>
                          <p className="text-sm">{entry.line2}</p>
                        </div>
                      )}
                      {entry.line3 && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">3.</p>
                          <p className="text-sm">{entry.line3}</p>
                        </div>
                      )}
                      
                      {(entry.goal || entry.dailyAction) && (
                        <div className="border-t border-gray-200 pt-3 mt-4">
                          {entry.goal && (
                            <div className="mb-2">
                              <div className="flex items-center gap-2 mb-1">
                                <Target className="w-3 h-3 text-blue-500" />
                                <p className="text-xs font-medium text-blue-700">Mål:</p>
                              </div>
                              <p className="text-sm text-gray-700 ml-5">{entry.goal}</p>
                            </div>
                          )}
                          {entry.dailyAction && (
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <BarChart3 className="w-3 h-3 text-green-500" />
                                <p className="text-xs font-medium text-green-700">Handling:</p>
                              </div>
                              <p className="text-sm text-gray-700 ml-5">{entry.dailyAction}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}