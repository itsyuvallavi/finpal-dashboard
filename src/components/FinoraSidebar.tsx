import React from 'react';
import { 
  Home,
  BarChart3,
  CreditCard,
  ShoppingBag,
  Users,
  Calendar,
  Star,
  Settings
} from 'lucide-react';
import './ui/finora-theme.css';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

// Navigation items matching the Finora design
const navigationItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard', active: false },
  { id: 'analytics', icon: BarChart3, label: 'Analytics', active: true },
  { id: 'transactions', icon: CreditCard, label: 'Transactions', active: false },
  { id: 'products', icon: ShoppingBag, label: 'Products', active: false },
  { id: 'customers', icon: Users, label: 'Customers', active: false },
  { id: 'calendar', icon: Calendar, label: 'Calendar', active: false },
  { id: 'favorites', icon: Star, label: 'Favorites', active: false },
];

export default function FinoraSidebar({ currentPage, onPageChange }: SidebarProps) {
  return (
    <div className="finora-sidebar w-20 h-screen flex flex-col items-center py-6 fixed left-0 top-0 z-50">
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
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === 'analytics'; // Analytics is active to match the design
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`
                w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
                ${isActive 
                  ? 'bg-white/20 backdrop-blur-sm shadow-lg' 
                  : 'hover:bg-white/10 backdrop-blur-sm'
                }
              `}
              title={item.label}
            >
              <Icon 
                size={20} 
                className={`
                  ${isActive ? 'text-white' : 'text-white/70 hover:text-white'}
                  transition-colors duration-200
                `} 
              />
            </button>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="mt-auto">
        <button 
          className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-white/10 backdrop-blur-sm transition-all duration-200"
          title="Settings"
        >
          <Settings size={20} className="text-white/70 hover:text-white transition-colors duration-200" />
        </button>
      </div>

      {/* User Avatar */}
      <div className="mt-4">
        <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white/20">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}