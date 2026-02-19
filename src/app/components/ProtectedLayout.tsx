import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { AUTH_DISABLED } from '../lib/auth';
import { Button } from './ui/button';
import { 
  LayoutDashboard, 
  BarChart3, 
  TrendingUp, 
  Lightbulb, 
  FileText, 
  MessageSquare,
  LogOut,
  Building2,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import ChatAssistant from './ChatAssistant';
import { cn } from './ui/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Imbalance Engine', href: '/imbalance', icon: BarChart3 },
  { name: 'Forecast Engine', href: '/forecast', icon: TrendingUp },
  { name: 'Simulation Wizard', href: '/simulation', icon: Lightbulb },
  { name: 'Budget Brief', href: '/brief', icon: FileText },
  { name: 'Feedback Tracking', href: '/feedback', icon: MessageSquare },
];

export default function ProtectedLayout() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  useEffect(() => {
    if (!AUTH_DISABLED && !loading && !user) {
      navigate('/login');
    }
  }, [AUTH_DISABLED, user, loading, navigate]);

  if (!AUTH_DISABLED && loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!AUTH_DISABLED && !user) {
    return null;
  }

  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Guest User';
  const displayRole = user?.user_metadata?.role || 'Guest';

  const handleSignOut = async () => {
    await signOut();
    if (AUTH_DISABLED) {
      navigate('/dashboard');
      return;
    }
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
          sidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="h-16 border-b border-sidebar-border flex items-center justify-between px-4">
          <div className="flex items-center gap-2 overflow-hidden">
            <Building2 className="w-6 h-6 text-sidebar-primary flex-shrink-0" />
            {!sidebarCollapsed && (
              <span className="font-bold text-sidebar-foreground text-lg">CitySpark</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.href)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-sidebar-border p-4">
          <div className={cn(
            "flex items-center gap-3 mb-3",
            sidebarCollapsed && "justify-center"
          )}>
            <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {displayName}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {displayRole}
                </p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className={cn(
              "w-full text-sidebar-foreground hover:bg-sidebar-accent",
              sidebarCollapsed && "justify-center px-2"
            )}
          >
            <LogOut className="w-4 h-4" />
            {!sidebarCollapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              {navigation.find(item => item.href === location.pathname)?.name || 'CitySpark'}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enterprise GovTech Intelligence Platform
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right mr-3">
              <p className="text-sm font-medium text-foreground">
                {displayName}
              </p>
              <p className="text-xs text-muted-foreground">
                {displayRole}
              </p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Floating Chat Assistant */}
      <ChatAssistant />
    </div>
  );
}
