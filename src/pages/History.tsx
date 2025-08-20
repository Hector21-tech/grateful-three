import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Search, Download, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { storage, GratitudeEntry } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";

export default function History() {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    setEntries(storage.getEntries());
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
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Historik
          </h1>
          <Badge variant="outline">
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
              className="pl-10"
            />
          </div>

          <Button 
            onClick={handleExport}
            variant="outline"
            className="w-full"
            disabled={entries.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportera som .txt
          </Button>
        </div>

        <div className="space-y-3">
          {filteredEntries.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  {searchTerm ? "Inga matchande poster hittades." : "Inga poster ännu. Börja med att skriva något idag!"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredEntries.map((entry) => (
              <Card key={entry.id}>
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
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">2.</p>
                        <p className="text-sm">{entry.line2}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">3.</p>
                        <p className="text-sm">{entry.line3}</p>
                      </div>
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