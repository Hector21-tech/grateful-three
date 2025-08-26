import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Today from "./pages/Today";
import History from "./pages/History";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Achievements from "./pages/Achievements";
import Insights from "./pages/Insights";
import { storage } from "./lib/storage";

const queryClient = new QueryClient();

const App = () => {
  const preferences = storage.getPreferences();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/onboarding" 
              element={preferences.onboardingCompleted ? <Navigate to="/" replace /> : <Onboarding />} 
            />
            <Route 
              path="/" 
              element={!preferences.onboardingCompleted ? <Navigate to="/onboarding" replace /> : <Today />} 
            />
            <Route 
              path="/history" 
              element={!preferences.onboardingCompleted ? <Navigate to="/onboarding" replace /> : <History />} 
            />
            <Route 
              path="/settings" 
              element={!preferences.onboardingCompleted ? <Navigate to="/onboarding" replace /> : <Settings />} 
            />
            <Route 
              path="/achievements" 
              element={!preferences.onboardingCompleted ? <Navigate to="/onboarding" replace /> : <Achievements />} 
            />
            <Route 
              path="/insights" 
              element={!preferences.onboardingCompleted ? <Navigate to="/onboarding" replace /> : <Insights />} 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
