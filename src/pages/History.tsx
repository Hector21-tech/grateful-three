import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { getEntries, deleteEntry, exportEntries, type GratitudeEntry } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Search, ChevronDown, ChevronUp, Trash2, Download } from 'lucide-react';
import Layout from '@/components/Layout';

export default function History() {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const allEntries = getEntries();
    setEntries(allEntries);
  };

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    
    const query = searchQuery.toLowerCase();
    return entries.filter(entry => 
      entry.line1.toLowerCase().includes(query) ||
      entry.line2.toLowerCase().includes(query) ||
      entry.line3.toLowerCase().includes(query) ||
      entry.date.includes(query)
    );
  }, [entries, searchQuery]);

  const toggleExpanded = (entryId: string) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(entryId)) {
      newExpanded.delete(entryId);
    } else {
      newExpanded.add(entryId);
    }
    setExpandedEntries(newExpanded);
  };

  const handleDelete = async (entry: GratitudeEntry) => {
    if (!confirm(`Ta bort inlägget från ${formatDate(entry.date)}?`)) {
      return;
    }

    try {
      deleteEntry(entry.id);
      loadEntries();
      toast({
        title: "Inlägget borttaget",
        description: "Din tacksamhet har tagits bort."
      });
    } catch (error) {
      toast({
        title: "Fel",
        description: "Kunde inte ta bort inlägget.",
        variant: "destructive"
      });
    }
  };

  const handleExport = () => {
    try {
      const exportText = exportEntries();
      const blob = new Blob([exportText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `tacksamhetsdagbok-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export klar! 📁",
        description: "Din tacksamhetsdagbok har laddats ner."
      });
    } catch (error) {
      toast({
        title: "Fel",
        description: "Kunde inte exportera dina inlägg.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('sv-SE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Din tacksamhetshistorik
          </h2>
          <p className="text-sm text-muted-foreground">
            {entries.length} {entries.length === 1 ? 'inlägg' : 'inlägg'} totalt
          </p>
        </div>

        {/* Search and Export */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sök i dina tacksamhetsanteckningar..."
              className="pl-9 bg-background/50 border-border/50 focus:border-primary"
            />
          </div>

          {entries.length > 0 && (
            <Button
              onClick={handleExport}
              variant="outline"
              className="w-full border-border/50 hover:bg-secondary/50"
            >
              <Download className="h-4 w-4 mr-2" />
              Ladda ner som textfil
            </Button>
          )}
        </div>

        {/* Entries list */}
        <div className="space-y-3">
          {filteredEntries.length === 0 ? (
            <Card className="bg-gradient-card border-border/50 p-6 text-center">
              <p className="text-muted-foreground">
                {searchQuery ? 'Inga inlägg matchade din sökning.' : 'Inga inlägg ännu. Börja med att skriva dagens tacksamhet!'}
              </p>
            </Card>
          ) : (
            filteredEntries.map((entry) => {
              const isExpanded = expandedEntries.has(entry.id);
              return (
                <Card key={entry.id} className="bg-gradient-card shadow-card border-border/50 p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground capitalize">
                        {formatDate(entry.date)}
                      </h3>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleDelete(entry)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => toggleExpanded(entry.id)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Content preview or full */}
                    {isExpanded ? (
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium text-foreground">1. </span>
                          <span className="text-muted-foreground">{entry.line1}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-foreground">2. </span>
                          <span className="text-muted-foreground">{entry.line2}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-foreground">3. </span>
                          <span className="text-muted-foreground">{entry.line3}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">1. </span>
                        {entry.line1.length > 50 ? `${entry.line1.substring(0, 50)}...` : entry.line1}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
}