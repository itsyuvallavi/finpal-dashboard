import React from 'react';
import { 
  Target,
  Settings,
  PieChart,
  TrendingUp,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

export default function BudgetsPage() {
  const comingSoonFeatures = [
    {
      icon: <Target size={24} />,
      title: 'Smart Budget Creation',
      description: 'AI-powered budget recommendations based on your spending patterns'
    },
    {
      icon: <PieChart size={24} />,
      title: 'Category Management',
      description: 'Create and customize budget categories that fit your lifestyle'
    },
    {
      icon: <TrendingUp size={24} />,
      title: 'Budget Analytics',
      description: 'Track spending vs budgets with detailed insights and trends'
    },
    {
      icon: <AlertTriangle size={24} />,
      title: 'Smart Alerts',
      description: 'Get notified before you overspend with intelligent warnings'
    },
    {
      icon: <Calendar size={24} />,
      title: 'Monthly Planning',
      description: 'Plan ahead with monthly and yearly budget forecasting'
    },
    {
      icon: <Settings size={24} />,
      title: 'Budget Optimization',
      description: 'AI suggestions to optimize your budget allocation'
    }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto opacity-50 pointer-events-none">
      {/* Coming Soon Header */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <Target size={64} className="mx-auto text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold text-gray-500 mb-2">Budget Management</h1>
          <p className="text-lg text-gray-400">Feature coming soon</p>
        </div>
        <Button size="lg" className="bg-gray-400 hover:bg-gray-400 cursor-not-allowed" disabled>
          Coming Soon
        </Button>
      </div>

      {/* Planned Features */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-500 mb-8 text-center">Planned Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comingSoonFeatures.map((feature, index) => (
            <Card key={index} className="p-6 text-center bg-gray-50 border-gray-200">
              <div className="mb-4 flex justify-center text-gray-400">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-500 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Current Status */}
      <Card className="p-8 bg-gray-100 border-gray-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-500 mb-4">Development Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <span className="text-sm text-gray-400">UI Design</span>
              <span className="text-sm font-medium text-gray-400">📅 Planned</span>
            </div>
            <div className="flex items-center justify-between max-w-md mx-auto">
              <span className="text-sm text-gray-400">Backend Integration</span>
              <span className="text-sm font-medium text-gray-400">📅 Planned</span>
            </div>
            <div className="flex items-center justify-between max-w-md mx-auto">
              <span className="text-sm text-gray-400">AI Features</span>
              <span className="text-sm font-medium text-gray-400">📅 Planned</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}