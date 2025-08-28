import { useState } from "react";
import { motion } from "motion/react";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "./components/ui/sidebar";
import {
  Home,
  BarChart3,
  Target,
  BookOpen,
  Activity,
  CreditCard,
  TrendingUp,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { Dashboard } from "./components/Dashboard";
import { Analytics } from "./components/Analytics";
import { Goals } from "./components/Goals";
import { Education } from "./components/Education";
import { Health } from "./components/Health";
import { Transactions } from "./components/Transactions";
import { AuthPage } from "./components/AuthPage";
import { Separator } from "./components/ui/separator";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";

const navigation = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", icon: Home, id: "dashboard" },
      { title: "Analytics", icon: BarChart3, id: "analytics" },
      { title: "Transactions", icon: CreditCard, id: "transactions" },
    ],
  },
  {
    title: "Planning",
    items: [
      { title: "Goals", icon: Target, id: "goals" },
      { title: "Health Score", icon: Activity, id: "health" },
      { title: "Education", icon: BookOpen, id: "education" },
    ],
  },
];

function AppContent() {
  const [activeView, setActiveView] = useState("dashboard");
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const handleLogout = () => {
    logout();
    setActiveView('dashboard');
  };

  const renderContent = () => {
    const components = {
      dashboard: Dashboard,
      analytics: Analytics,
      goals: Goals,
      education: Education,
      health: Health,
      transactions: Transactions,
    };

    const Component = components[activeView as keyof typeof components];
    
    if (!Component) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-2">
            <h3>Coming Soon</h3>
            <p className="text-muted-foreground">This feature is under development</p>
          </div>
        </div>
      );
    }

    return (
      <motion.div
        key={activeView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Component />
      </motion.div>
    );
  };

  return (
    <div className="dark">
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                <TrendingUp className="h-4 w-4 text-sidebar-primary-foreground" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-sidebar-foreground">FinPal</h2>
                <p className="text-xs text-sidebar-foreground/60">Personal Finance AI</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            {navigation.map((group) => (
              <SidebarGroup key={group.title}>
                <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs px-2">
                  {group.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          onClick={() => setActiveView(item.id)}
                          isActive={activeView === item.id}
                          className="w-full"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          {item.id === "health" && (
                            <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
                              78
                            </Badge>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
            
            {/* Settings section */}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveView('settings')}
                      isActive={activeView === 'settings'}
                      className="w-full"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex-1" />
            
            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.name || 'User'}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveView('settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}