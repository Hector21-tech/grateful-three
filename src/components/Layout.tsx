import { ReactNode } from "react";
import { useLocation, Link } from "react-router-dom";
import { Calendar, History, Settings, Trophy } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Calendar, label: "Idag" },
    { path: "/history", icon: History, label: "Historik" },
    { path: "/achievements", icon: Trophy, label: "Utmärkelser" },
    { path: "/settings", icon: Settings, label: "Inställningar" },
  ];

  return (
    <div className="min-h-screen gradient-warm flex flex-col">
      {/* Main content */}
      <main className="flex-1 pb-20 animate-in">
        {children}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-white/20 safe-area-inset-bottom">
        <div className="flex justify-around items-center py-3">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-200 touch-manipulation min-h-[48px] hover-lift ${
                location.pathname === path
                  ? "text-white bg-gradient-to-r from-orange-400 to-pink-400 shadow-medium"
                  : "text-gray-600 hover:text-gray-800 active:bg-white/30"
              }`}
            >
              <Icon size={24} />
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