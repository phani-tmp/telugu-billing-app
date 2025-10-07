import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Inventory from "@/pages/Inventory";
import NewBill from "@/pages/NewBill";
import History from "@/pages/History";
import { Package, FileText, History as HistoryIcon } from "lucide-react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Inventory} />
      <Route path="/new-bill" component={NewBill} />
      <Route path="/history" component={History} />
    </Switch>
  );
}

function BottomNav() {
  const [location, setLocation] = useLocation();
  
  const navItems = [
    { path: "/", icon: Package, label: "వస్తువులు" },
    { path: "/new-bill", icon: FileText, label: "కొత్త బిల్లు" },
    { path: "/history", icon: HistoryIcon, label: "చరిత్ర" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex items-center justify-around max-w-2xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              data-testid={`nav-${item.path}`}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors hover-elevate ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Router />
          <BottomNav />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
