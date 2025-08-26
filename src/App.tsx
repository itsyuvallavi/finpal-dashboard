import React, { useState } from 'react';
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
  Brain
} from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Avatar, AvatarFallback } from './components/ui/avatar';
import { Badge } from './components/ui/badge';
import { Progress } from './components/ui/progress';

// Import page components
import Dashboard from './components/Dashboard';
import SpendingPage from './components/SpendingPage';
import BudgetsPage from './components/BudgetsPage';
import GoalsPage from './components/GoalsPage';
import InvestmentsPage from './components/InvestmentsPage';
import LearnPage from './components/LearnPage';
import SettingsPage from './components/SettingsPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('Dashboard');

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', count: null },
    { icon: CreditCard, label: 'Spending', count: 3 },
    { icon: Target, label: 'Budgets', count: null },
    { icon: TrendingUp, label: 'Goals', count: 2 },
    { icon: BookOpen, label: 'Investments', count: null },
    { icon: Brain, label: 'Learn', count: null },
    { icon: Settings, label: 'Settings', count: null },
  ];

  const goalCategories = [
    { label: 'Emergency Fund', progress: 68, target: '$10,000', current: '$6,800' },
    { label: 'Vacation', progress: 45, target: '$5,000', current: '$2,250' },
    { label: 'Investment Fund', progress: 23, target: '$15,000', current: '$3,450' },
  ];

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Spending':
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
        return 'Spending Analysis';
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
        return 'Search transactions...';
      case 'Budgets':
        return 'Search budget categories...';
      case 'Goals':
        return 'Search goals...';
      case 'Investments':
        return 'Search investments...';
      case 'Learn':
        return 'Search courses...';
      default:
        return 'Search transactions, goals...';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-semibold text-gray-900">FinanceAI</h1>
          <p className="text-xs text-gray-500 mt-1">Your Personal Finance Coach</p>
        </div>
        
        <nav className="flex-1 px-4">
          <ul className="space-y-1">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => setCurrentPage(item.label)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    currentPage === item.label
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <Badge variant="secondary" className="text-xs">
                      {item.count}
                    </Badge>
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <p className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quick Goals
            </p>
            <ul className="mt-2 space-y-2">
              {goalCategories.map((goal, index) => (
                <li key={index}>
                  <button
                    onClick={() => setCurrentPage('Goals')}
                    className="w-full px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{goal.label}</span>
                      <span className="text-xs text-gray-500">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-1.5" />
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{goal.current}</span>
                      <span className="text-xs text-gray-500">{goal.target}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-sm bg-blue-100 text-blue-600">
                SJ
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
              <p className="text-xs text-gray-500">Financial Health: Good</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <h2 className="text-lg font-semibold text-gray-900">{getPageTitle()}</h2>
              <div className="relative flex-1 max-w-md ml-8">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder={getSearchPlaceholder()}
                  className="pl-10 bg-gray-50 border-0"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter size={16} />
                This Month
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="gap-2">
                <Brain size={16} />
                AI Insights
              </Button>
              <Button size="sm" className="gap-2 bg-black hover:bg-gray-800">
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

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {renderCurrentPage()}
        </div>
      </div>
    </div>
  );
}