import React, { useState } from 'react';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calendar,
  Target,
  MoreHorizontal,
  Settings,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export default function BudgetsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const budgetCategories = [
    {
      id: 1,
      name: 'Housing',
      budgeted: 1800,
      spent: 1850,
      remaining: -50,
      percentage: 103,
      trend: 'up',
      change: '+2.8%',
      status: 'over',
      icon: '🏠',
      transactions: 12
    },
    {
      id: 2,
      name: 'Food & Dining',
      budgeted: 600,
      spent: 680,
      remaining: -80,
      percentage: 113,
      trend: 'up',
      change: '+15%',
      status: 'over',
      icon: '🍽️',
      transactions: 28
    },
    {
      id: 3,
      name: 'Transportation',
      budgeted: 500,
      spent: 420,
      remaining: 80,
      percentage: 84,
      trend: 'down',
      change: '-5%',
      status: 'good',
      icon: '🚗',
      transactions: 15
    },
    {
      id: 4,
      name: 'Entertainment',
      budgeted: 300,
      spent: 280,
      remaining: 20,
      percentage: 93,
      trend: 'up',
      change: '+8%',
      status: 'warning',
      icon: '🎬',
      transactions: 9
    },
    {
      id: 5,
      name: 'Groceries',
      budgeted: 400,
      spent: 350,
      remaining: 50,
      percentage: 88,
      trend: 'up',
      change: '+8%',
      status: 'good',
      icon: '🛒',
      transactions: 22
    },
    {
      id: 6,
      name: 'Health & Fitness',
      budgeted: 200,
      spent: 145,
      remaining: 55,
      percentage: 73,
      trend: 'down',
      change: '-12%',
      status: 'good',
      icon: '💪',
      transactions: 6
    },
    {
      id: 7,
      name: 'Shopping',
      budgeted: 250,
      spent: 180,
      remaining: 70,
      percentage: 72,
      trend: 'down',
      change: '-10%',
      status: 'good',
      icon: '🛍️',
      transactions: 11
    },
    {
      id: 8,
      name: 'Subscriptions',
      budgeted: 100,
      spent: 89,
      remaining: 11,
      percentage: 89,
      trend: 'down',
      change: '-2%',
      status: 'good',
      icon: '📱',
      transactions: 7
    }
  ];

  const budgetInsights = [
    {
      type: 'alert',
      title: 'Food Budget Exceeded',
      description: 'You\'ve overspent by $80 on dining out this month. Consider meal planning to get back on track.',
      category: 'Food & Dining',
      priority: 'high'
    },
    {
      type: 'success',
      title: 'Transportation Savings',
      description: 'Great job! You\'re saving $80 on transportation this month. Keep up the good work.',
      category: 'Transportation',
      priority: 'medium'
    },
    {
      type: 'warning',
      title: 'Entertainment Budget Alert',
      description: 'You\'re at 93% of your entertainment budget with 5 days left in the month.',
      category: 'Entertainment',
      priority: 'medium'
    },
    {
      type: 'tip',
      title: 'Budget Optimization',
      description: 'Consider reallocating $50 from Transportation to Food & Dining for better balance.',
      category: 'General',
      priority: 'low'
    }
  ];

  const totalBudgeted = budgetCategories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;
  const overallPercentage = Math.round((totalSpent / totalBudgeted) * 100);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'over': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'good': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'over': return 'Over Budget';
      case 'warning': return 'Warning';
      case 'good': return 'On Track';
      default: return 'Unknown';
    }
  };

  return (
    <div className="p-6">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Budget</p>
              <h3 className="text-2xl font-semibold text-gray-900">${totalBudgeted.toLocaleString()}</h3>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-500">This month</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Target size={20} className="text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Spent</p>
              <h3 className="text-2xl font-semibold text-gray-900">${totalSpent.toLocaleString()}</h3>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight size={12} className="text-red-500" />
                <span className="text-xs text-red-500">{overallPercentage}% of budget</span>
              </div>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <DollarSign size={20} className="text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Remaining</p>
              <h3 className={`text-2xl font-semibold ${
                totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${Math.abs(totalRemaining).toLocaleString()}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                {totalRemaining >= 0 ? (
                  <ArrowDownRight size={12} className="text-green-500" />
                ) : (
                  <ArrowUpRight size={12} className="text-red-500" />
                )}
                <span className={`text-xs ${
                  totalRemaining >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {totalRemaining >= 0 ? 'Under budget' : 'Over budget'}
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-full ${
              totalRemaining >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <TrendingUp size={20} className={totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Categories</p>
              <h3 className="text-2xl font-semibold text-gray-900">{budgetCategories.length}</h3>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-500">
                  {budgetCategories.filter(c => c.status === 'over').length} over budget
                </span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <PieChart size={20} className="text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Budget Categories */}
        <div className="col-span-2">
          <Tabs defaultValue="categories" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="monthly">Monthly View</TabsTrigger>
                <TabsTrigger value="yearly">Yearly Plan</TabsTrigger>
              </TabsList>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <PlusCircle size={16} />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Budget Category</DialogTitle>
                    <DialogDescription>
                      Set up a new budget category with your spending limit and goals.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input id="name" placeholder="Category name" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="budget" className="text-right">
                        Budget
                      </Label>
                      <Input id="budget" placeholder="Monthly budget amount" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="icon" className="text-right">
                        Icon
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Choose an icon" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="🏠">🏠 Housing</SelectItem>
                          <SelectItem value="🍽️">🍽️ Food</SelectItem>
                          <SelectItem value="🚗">🚗 Transportation</SelectItem>
                          <SelectItem value="🎬">🎬 Entertainment</SelectItem>
                          <SelectItem value="🛒">🛒 Groceries</SelectItem>
                          <SelectItem value="💪">💪 Health</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsCreateDialogOpen(false)}>
                      Create Category
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <TabsContent value="categories" className="space-y-4">
              {budgetCategories.map((category) => (
                <Card key={category.id} className={`p-6 ${
                  category.status === 'over' ? 'border-red-200 bg-red-50' : ''
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500">{category.transactions} transactions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(category.status)}>
                        {getStatusText(category.status)}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit size={14} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Budget Progress</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">
                          ${category.spent.toLocaleString()} / ${category.budgeted.toLocaleString()}
                        </span>
                        <div className={`flex items-center gap-1 ${
                          category.trend === 'up' ? 'text-red-500' : 'text-green-500'
                        }`}>
                          {category.trend === 'up' ? 
                            <ArrowUpRight size={12} /> : 
                            <ArrowDownRight size={12} />
                          }
                          <span className="text-xs">{category.change}</span>
                        </div>
                      </div>
                    </div>
                    <Progress 
                      value={category.percentage} 
                      className={`h-3 ${
                        category.status === 'over' ? 'bg-red-100' : 
                        category.status === 'warning' ? 'bg-yellow-100' : 'bg-green-100'
                      }`}
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className={category.remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {category.remaining >= 0 ? 
                          `$${category.remaining} remaining` : 
                          `$${Math.abs(category.remaining)} over budget`
                        }
                      </span>
                      <span className="text-gray-500">{category.percentage}% used</span>
                    </div>
                  </div>
                </Card>
              ))}

              <Card className="p-6 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                <div className="text-center">
                  <PlusCircle size={24} className="mx-auto text-gray-400 mb-2" />
                  <h3 className="font-medium text-gray-700 mb-1">Add New Category</h3>
                  <p className="text-sm text-gray-500">Create a budget for a new spending category</p>
                  <Button variant="ghost" className="mt-3" onClick={() => setIsCreateDialogOpen(true)}>
                    Get Started
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="monthly" className="space-y-4">
              <Card className="p-6 text-center">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Monthly Budget View</h3>
                <p className="text-gray-600">Month-by-month budget planning and historical analysis coming soon.</p>
              </Card>
            </TabsContent>

            <TabsContent value="yearly" className="space-y-4">
              <Card className="p-6 text-center">
                <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Annual Budget Planning</h3>
                <p className="text-gray-600">Yearly budget planning with seasonal adjustments and goal alignment coming soon.</p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Budget Insights */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Budget Insights</h3>
              <Button variant="ghost" size="sm">
                <MoreHorizontal size={16} />
              </Button>
            </div>
            <div className="space-y-4">
              {budgetInsights.map((insight, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      insight.type === 'alert' ? 'bg-red-100' :
                      insight.type === 'success' ? 'bg-green-100' :
                      insight.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      {insight.type === 'alert' && <AlertTriangle size={14} className="text-red-600" />}
                      {insight.type === 'success' && <CheckCircle size={14} className="text-green-600" />}
                      {insight.type === 'warning' && <AlertTriangle size={14} className="text-yellow-600" />}
                      {insight.type === 'tip' && <Target size={14} className="text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">{insight.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{insight.category}</span>
                        <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-blue-600 hover:text-blue-700">
                          Take action →
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Settings size={16} />
                Budget Settings
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <PieChart size={16} />
                View Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Target size={16} />
                Set New Goals
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Calendar size={16} />
                Plan Next Month
              </Button>
            </div>
          </div>

          {/* Budget Tips */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Budget Tips</h3>
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-blue-100 rounded-full">
                    <Target size={12} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">50/30/20 Rule</h4>
                    <p className="text-xs text-gray-600">50% needs, 30% wants, 20% savings & debt</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-green-100 rounded-full">
                    <CheckCircle size={12} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Review Weekly</h4>
                    <p className="text-xs text-gray-600">Check your progress every week to stay on track</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-purple-100 rounded-full">
                    <TrendingUp size={12} className="text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Automate Savings</h4>
                    <p className="text-xs text-gray-600">Set up automatic transfers to reach your goals</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}