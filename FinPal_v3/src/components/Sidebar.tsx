import { 
  Home, 
  BarChart3, 
  CreditCard, 
  Calendar,
  Settings,
  HelpCircle,
  User,
  Target,
  BookOpen,
  Heart
} from "lucide-react";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const navigationItems = [
    { icon: Home, id: 'dashboard', label: 'Dashboard' },
    { icon: BarChart3, id: 'analytics', label: 'Analytics' },
    { icon: CreditCard, id: 'transactions', label: 'Transactions' },
    { icon: Target, id: 'goals', label: 'Goals' },
    { icon: Heart, id: 'health', label: 'Health Score' },
    { icon: BookOpen, id: 'education', label: 'Education' },
    { icon: Calendar, id: 'calendar', label: 'Calendar' },
    { icon: Settings, id: 'settings', label: 'Settings' },
    { icon: HelpCircle, id: 'help', label: 'Help' },
  ];

  return (
    <div className="w-20 h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 flex flex-col items-center py-6">
      {/* Logo */}
      <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-8">
        <div className="w-6 h-6 bg-white rounded-sm"></div>
      </div>

      {/* Navigation Icons */}
      <nav className="flex flex-col items-center space-y-4 flex-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors relative group ${
                isActive 
                  ? 'bg-purple-600 text-white' 
                  : 'text-purple-300 hover:text-white hover:bg-purple-700'
              }`}
              title={item.label}
            >
              <Icon size={20} />
              
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>

      {/* User Avatar */}
      <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
        <User size={20} className="text-white" />
      </div>
    </div>
  );
}