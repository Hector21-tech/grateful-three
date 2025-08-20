import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, History, Settings, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
  showProBanner?: boolean;
}

export default function Layout({ children, showProBanner = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-warm flex flex-col">
      {/* Header */}
      <header className="bg-gradient-card shadow-card backdrop-blur-sm border-b border-border/50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-2">
            <Heart className="h-6 w-6 text-primary fill-current" />
            <h1 className="text-xl font-semibold text-foreground">3 Saker Idag</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-6">
        {children}
      </main>

      {/* Pro banner placeholder */}
      {showProBanner && (
        <div className="bg-accent/20 border-t border-border/50 p-3">
          <div className="max-w-md mx-auto text-center text-sm text-muted-foreground">
            <div className="h-12 bg-accent/30 rounded-md flex items-center justify-center">
              Annonser (AdMob-plats)
            </div>
          </div>
        </div>
      )}

      {/* Bottom navigation */}
      <nav className="bg-gradient-card shadow-card backdrop-blur-sm border-t border-border/50">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-around py-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )
              }
            >
              <Heart className="h-5 w-5" />
              <span className="text-xs font-medium">Idag</span>
            </NavLink>
            
            <NavLink
              to="/historik"
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )
              }
            >
              <History className="h-5 w-5" />
              <span className="text-xs font-medium">Historik</span>
            </NavLink>
            
            <NavLink
              to="/installningar"
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )
              }
            >
              <Settings className="h-5 w-5" />
              <span className="text-xs font-medium">Inställningar</span>
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
}