import { ReactNode } from "react";
import { useLocation, Link } from "react-router-dom";
import { Calendar, History, Settings } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Calendar, label: "Idag" },
    { path: "/history", icon: History, label: "Historik" },
    { path: "/settings", icon: Settings, label: "Inställningar" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main content */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex justify-around items-center py-2">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                location.pathname === path
                  ? "text-primary bg-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Ad banner placeholder */}
      <div className="h-12 bg-muted/50 border-t border-border flex items-center justify-center text-xs text-muted-foreground">
        <div className="text-center">Annonsplats</div>
      </div>
    </div>
  );
}