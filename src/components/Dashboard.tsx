import React from 'react';
import { 
  MoreHorizontal, 
  DollarSign,
  PiggyBank,
  TrendingUp,
  CreditCard,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
  Plus,
  BookOpen
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

export default function Dashboard() {
  const aiInsights = [
    {
      type: 'warning',
      title: 'Spending Alert',
      description: 'You\'ve spent 15% more on dining out this week compared to your average. Consider meal planning to stay on track.',
      priority: 'high'
    },
    {
      type: 'success',
      title: 'Great Progress!',
      description: 'You\'re ahead of schedule on your Emergency Fund goal. Keep up the momentum!',
      priority: 'medium'
    },
    {
      type: 'education',
      title: 'Learning Opportunity',
      description: 'Ready to learn about index funds? This matches your risk tolerance and investment timeline.',
      priority: 'low'
    }
  ];

  const learningModules = [
    {
      title: 'Budgeting Basics',
      description: 'Master the fundamentals of personal budgeting',
      progress: 100,
      level: 'Beginner',
      completed: true
    },
    {
      title: 'Emergency Fund Strategy',
      description: 'Build your financial safety net step by step',
      progress: 75,
      level: 'Beginner',
      completed: false
    },
    {
      title: 'Introduction to Investing',
      description: 'Start your investment journey with confidence',
      progress: 30,
      level: 'Intermediate',
      completed: false
    },
    {
      title: 'Risk Assessment',
      description: 'Understand your investment risk tolerance',
      progress: 0,
      level: 'Intermediate',
      completed: false
    }
  ];

  const spendingCategories = [
    { category: 'Housing', amount: '$1,850', percentage: 35, change: '+2%', trending: 'up' },
    { category: 'Food', amount: '$680', percentage: 13, change: '+15%', trending: 'up' },
    { category: 'Transportation', amount: '$420', percentage: 8, change: '-5%', trending: 'down' },
    { category: 'Entertainment', amount: '$280', percentage: 5, change: '+8%', trending: 'up' },
  ];

  return (
    <div className="p-6">
      {/* Financial Health Overview */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* Net Worth */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Net Worth</p>
              <h3 className="text-2xl font-semibold text-gray-900">$24,680</h3>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight size={12} className="text-green-500" />
                <span className="text-xs text-green-500">+8.2% this month</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp size={20} className="text-green-600" />
            </div>
          </div>
        </Card>

        {/* Monthly Spending */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Monthly Spending</p>
              <h3 className="text-2xl font-semibold text-gray-900">$3,240</h3>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight size={12} className="text-red-500" />
                <span className="text-xs text-red-500">+12% vs budget</span>
              </div>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <CreditCard size={20} className="text-red-600" />
            </div>
          </div>
        </Card>

        {/* Savings Rate */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Savings Rate</p>
              <h3 className="text-2xl font-semibold text-gray-900">22%</h3>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight size={12} className="text-green-500" />
                <span className="text-xs text-green-500">+3% vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <PiggyBank size={20} className="text-blue-600" />
            </div>
          </div>
        </Card>

        {/* Investment Growth */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Investment Growth</p>
              <h3 className="text-2xl font-semibold text-gray-900">$8,450</h3>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight size={12} className="text-green-500" />
                <span className="text-xs text-green-500">+5.8% this quarter</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign size={20} className="text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* AI Insights Column */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">AI Insights</h3>
            <Button variant="ghost" size="sm" className="p-1">
              <MoreHorizontal size={16} />
            </Button>
          </div>
          
          <div className="space-y-4">
            {aiInsights.map((insight, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    insight.type === 'warning' ? 'bg-orange-100' :
                    insight.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {insight.type === 'warning' && <AlertCircle size={16} className="text-orange-600" />}
                    {insight.type === 'success' && <CheckCircle size={16} className="text-green-600" />}
                    {insight.type === 'education' && <Lightbulb size={16} className="text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                    <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-blue-600 hover:text-blue-700">
                      Learn more →
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Spending Breakdown Column */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Spending This Month</h3>
            <Button variant="ghost" size="sm" className="p-1">
              <MoreHorizontal size={16} />
            </Button>
          </div>
          
          <div className="space-y-4">
            {spendingCategories.map((category, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{category.category}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{category.amount}</span>
                    <div className={`flex items-center gap-1 ${
                      category.trending === 'up' ? 'text-red-500' : 'text-green-500'
                    }`}>
                      {category.trending === 'up' ? 
                        <ArrowUpRight size={12} /> : 
                        <ArrowDownRight size={12} />
                      }
                      <span className="text-xs">{category.change}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={category.percentage} className="flex-1 h-2" />
                  <span className="text-xs text-gray-500 w-8">{category.percentage}%</span>
                </div>
              </Card>
            ))}
            
            <Card className="p-4 border-dashed border-gray-300">
              <div className="text-center">
                <Plus size={16} className="mx-auto text-gray-400 mb-1" />
                <p className="text-sm text-gray-600">Add new category</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Learning Progress Column */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Learning Progress</h3>
            <Button variant="ghost" size="sm" className="p-1">
              <MoreHorizontal size={16} />
            </Button>
          </div>
          
          <div className="space-y-4">
            {learningModules.map((module, index) => (
              <Card key={index} className={`p-4 ${module.completed ? 'bg-green-50 border-green-200' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{module.title}</h4>
                      {module.completed && <CheckCircle size={14} className="text-green-600" />}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                    <Badge variant="outline" className="text-xs">
                      {module.level}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Progress value={module.progress} className="flex-1 h-2 mr-3" />
                  <span className="text-xs text-gray-500">{module.progress}%</span>
                </div>
                
                {!module.completed && (
                  <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-blue-600 hover:text-blue-700">
                    Continue learning →
                  </Button>
                )}
              </Card>
            ))}
            
            <Card className="p-4 border-dashed border-gray-300">
              <div className="text-center">
                <BookOpen size={16} className="mx-auto text-gray-400 mb-1" />
                <p className="text-sm text-gray-600">Explore more courses</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}