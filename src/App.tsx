import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth.tsx';
import { 
  Search, 
  Filter, 
  Plus, 
  Home, 
  CreditCard, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Settings, 
  Brain,
  LogOut,
  BarChart3,
  Users,
  Calendar,
  Star
} from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Avatar, AvatarFallback } from './components/ui/avatar';
import { Badge } from './components/ui/badge';
import { Progress } from './components/ui/progress';

// Import page components
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import SpendingPage from './components/SpendingPage';
import BudgetsPage from './components/BudgetsPage';
import GoalsPage from './components/GoalsPage';
import InvestmentsPage from './components/InvestmentsPage';
import LearnPage from './components/LearnPage';
import SettingsPage from './components/SettingsPage';

// Import Finora theme
import './components/ui/finora-theme.css';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  
  const handleAddButtonClick = () => {
    switch (currentPage) {
      case 'Dashboard':
      case 'Spending':
        // For now, just alert - we can enhance this later with a proper modal
        alert('Add Transaction feature coming soon! Use CSV import for now.');
        break;
      case 'Goals':
        alert('Add Goal feature coming soon!');
        break;
      case 'Settings':
        alert('No add functionality needed for Settings page');
        break;
      default:
        alert('Add functionality coming soon for this page!');
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('Dashboard');
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--background-primary)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', count: null, enabled: true },
    { icon: BarChart3, label: 'Analytics', count: null, enabled: true, isActive: currentPage === 'Spending' },
    { icon: CreditCard, label: 'Spending', count: null, enabled: true },
    { icon: Target, label: 'Budgets', count: null, enabled: false },
    { icon: TrendingUp, label: 'Goals', count: null, enabled: true },
    { icon: Users, label: 'Investments', count: null, enabled: false },
    { icon: Calendar, label: 'Learn', count: null, enabled: false },
    { icon: Star, label: 'Favorites', count: null, enabled: false },
  ];

  // Goals will be empty until user creates them
  const goalCategories = [];

  const isPageEnabled = (pageName: string) => {
    const item = sidebarItems.find(item => item.label === pageName);
    return item ? item.enabled : false;
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'Spending':
        return <SpendingPage />;
      case 'Analytics':
        return <SpendingPage />;
      case 'Budgets':
        return <BudgetsPage />;
      case 'Goals':
        return <GoalsPage />;
      case 'Investments':
        return <InvestmentsPage />;
      case 'Learn':
        return <LearnPage />;
      case 'Settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'Dashboard':
        return 'Dashboard Overview';
      case 'Spending':
      case 'Analytics':
        return 'Transactions';
      case 'Budgets':
        return 'Budget Management';
      case 'Goals':
        return 'Financial Goals';
      case 'Investments':
        return 'Investment Portfolio';
      case 'Learn':
        return 'Financial Education';
      case 'Settings':
        return 'Account Settings';
      default:
        return 'Dashboard Overview';
    }
  };

  const getSearchPlaceholder = () => {
    switch (currentPage) {
      case 'Spending':
      case 'Analytics':
        return 'Search...';
      case 'Budgets':
        return 'Search budget categories...';
      case 'Goals':
        return 'Search goals...';
      case 'Investments':
        return 'Search investments...';
      case 'Learn':
        return 'Search courses...';
      default:
        return 'Search...';
    }
  };

  return (
    <div className="flex h-screen" style={{ background: 'var(--background-primary)' }}>
      {/* Finora Purple Sidebar */}
      <div className="w-20 finora-sidebar flex flex-col items-center py-6">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <div className="w-6 h-6 rounded bg-white/90 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-purple-600"></div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col items-center space-y-2">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentPage === item.label || (item.label === 'Analytics' && currentPage === 'Spending');
            
            return (
              <button
                key={index}
                onClick={() => item.enabled && setCurrentPage(item.label)}
                disabled={!item.enabled}
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
                  ${!item.enabled 
                    ? 'opacity-30 cursor-not-allowed' 
                    : isActive 
                      ? 'bg-white/20 backdrop-blur-sm shadow-lg' 
                      : 'hover:bg-white/10 backdrop-blur-sm cursor-pointer'
                  }
                `}
                title={item.label}
              >
                <Icon 
                  size={20} 
                  className={`
                    ${!item.enabled
                      ? 'text-white/30'
                      : isActive 
                        ? 'text-white' 
                        : 'text-white/70 hover:text-white'
                    } transition-colors duration-200
                  `} 
                />
              </button>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="mt-auto mb-4">
          <button 
            onClick={() => setCurrentPage('Settings')}
            className={`
              w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
              ${currentPage === 'Settings' 
                ? 'bg-white/20 backdrop-blur-sm shadow-lg' 
                : 'hover:bg-white/10 backdrop-blur-sm'
              }
            `}
            title="Settings"
          >
            <Settings 
              size={20} 
              className={`
                ${currentPage === 'Settings' ? 'text-white' : 'text-white/70 hover:text-white'} 
                transition-colors duration-200
              `} 
            />
          </button>
        </div>

        {/* User Avatar */}
        <div>
          <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white/20">
            <Avatar className="w-full h-full">
              <AvatarFallback className="text-sm bg-white text-purple-600">
                {user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Only show if not on main analytics/spending page */}
        {currentPage !== 'Spending' && currentPage !== 'Analytics' && (
          <div className="finora-card border-0 border-b rounded-none px-6 py-4" style={{ borderColor: 'var(--border-primary)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {getPageTitle()}
                </h2>
                <div className="relative flex-1 max-w-md ml-8">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} size={16} />
                  <Input
                    placeholder={getSearchPlaceholder()}
                    className="pl-10 border-gray-600 focus:ring-purple-500"
                    style={{ 
                      background: 'var(--background-card)', 
                      color: 'var(--text-primary)',
                      borderColor: 'var(--border-primary)'
                    }}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 border-gray-600 hover:bg-gray-700"
                  style={{ 
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <Filter size={16} />
                  This Month
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`gap-2 border-gray-600 hover:bg-gray-700 ${!isPageEnabled(currentPage) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  disabled={!isPageEnabled(currentPage)}
                  style={{ 
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <Brain size={16} />
                  AI Insights
                </Button>
                <Button 
                  size="sm" 
                  className={`gap-2 bg-purple-600 hover:bg-purple-700 ${!isPageEnabled(currentPage) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  disabled={!isPageEnabled(currentPage)}
                  onClick={handleAddButtonClick}
                >
                  <Plus size={16} />
                  {currentPage === 'Spending' ? 'Add Transaction' :
                   currentPage === 'Budgets' ? 'Add Budget' :
                   currentPage === 'Goals' ? 'Add Goal' :
                   currentPage === 'Investments' ? 'Add Investment' :
                   currentPage === 'Learn' ? 'Enroll Course' : 'Add Transaction'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {renderCurrentPage()}
        </div>
      </div>
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