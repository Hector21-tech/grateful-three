import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Flame } from "lucide-react";
import { storage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";

export default function Today() {
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [line3, setLine3] = useState("");
  const [streak, setStreak] = useState(0);
  const { toast } = useToast();

  const today = new Date().toLocaleDateString("sv-SE");

  useEffect(() => {
    // Load today's entry if it exists
    const todaysEntry = storage.getTodaysEntry();
    if (todaysEntry) {
      setLine1(todaysEntry.line1);
      setLine2(todaysEntry.line2);
      setLine3(todaysEntry.line3);
    }

    // Load streak
    setStreak(storage.getStreak());
  }, []);

  const handleSave = () => {
    if (!line1.trim() || !line2.trim() || !line3.trim()) {
      toast({
        title: "Ofullständig post",
        description: "Fyll i alla tre fält innan du sparar.",
        variant: "destructive",
      });
      return;
    }

    storage.saveEntry({
      date: new Date().toISOString().split("T")[0],
      line1: line1.trim(),
      line2: line2.trim(),
      line3: line3.trim(),
    });

    setStreak(storage.getStreak());
    
    toast({
      title: "Sparat!",
      description: "Din tacksamhetspost för idag har sparats.",
    });
  };

  return (
    <Layout>
      <div className="p-4 max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            3 Saker Idag
          </h1>
          <p className="text-muted-foreground">{today}</p>
          
          {streak > 0 && (
            <Badge variant="secondary" className="mt-2">
              <Flame className="w-4 h-4 mr-1" />
              {streak} dag{streak !== 1 ? "ar" : ""} i rad
            </Badge>
          )}
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="w-5 h-5 text-primary" />
              Vad är du tacksam för idag?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                1. Första saken:
              </label>
              <Textarea
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                placeholder="Något du uppskattar..."
                className="resize-none"
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                2. Andra saken:
              </label>
              <Textarea
                value={line2}
                onChange={(e) => setLine2(e.target.value)}
                placeholder="Något som gjorde dig glad..."
                className="resize-none"
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                3. Tredje saken:
              </label>
              <Textarea
                value={line3}
                onChange={(e) => setLine3(e.target.value)}
                placeholder="Något som fick dig att le..."
                className="resize-none"
                rows={2}
              />
            </div>

            <Button 
              onClick={handleSave}
              className="w-full"
              size="lg"
            >
              Spara dagens tacksamhet
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}