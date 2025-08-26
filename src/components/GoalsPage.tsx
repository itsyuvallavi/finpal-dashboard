import React, { useState } from 'react';
import { 
  Target, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export default function GoalsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('All Goals');

  const goals = [
    {
      id: 1,
      title: 'Emergency Fund',
      description: 'Build 6 months of living expenses',
      currentAmount: 6800,
      targetAmount: 10000,
      targetDate: '2025-06-01',
      category: 'Safety Net',
      priority: 'high',
      monthlyContribution: 400,
      status: 'on-track',
      daysRemaining: 155,
      progressPercentage: 68
    },
    {
      id: 2,
      title: 'Vacation to Japan',
      description: 'Two-week trip including flights and accommodation',
      currentAmount: 2250,
      targetAmount: 5000,
      targetDate: '2025-08-15',
      category: 'Travel',
      priority: 'medium',
      monthlyContribution: 350,
      status: 'on-track',
      daysRemaining: 230,
      progressPercentage: 45
    },
    {
      id: 3,
      title: 'Investment Portfolio',
      description: 'Build diversified investment portfolio',
      currentAmount: 3450,
      targetAmount: 15000,
      targetDate: '2026-12-31',
      category: 'Investment',
      priority: 'medium',
      monthlyContribution: 500,
      status: 'behind',
      daysRemaining: 735,
      progressPercentage: 23
    },
    {
      id: 4,
      title: 'New Car Down Payment',
      description: '20% down payment for reliable vehicle',
      currentAmount: 1200,
      targetAmount: 8000,
      targetDate: '2025-12-01',
      category: 'Transportation',
      priority: 'low',
      monthlyContribution: 600,
      status: 'ahead',
      daysRemaining: 340,
      progressPercentage: 15
    }
  ];

  const goalInsights = [
    {
      type: 'success',
      title: 'Emergency Fund Milestone',
      description: 'You\'re ahead of schedule! At this rate, you\'ll reach your goal 2 months early.',
      goalId: 1
    },
    {
      type: 'warning',
      title: 'Investment Goal Behind',
      description: 'Consider increasing monthly contributions by $150 to stay on track.',
      goalId: 3
    },
    {
      type: 'tip',
      title: 'Auto-Save Opportunity',
      description: 'Round up purchases to boost your vacation fund faster.',
      goalId: 2
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800';
      case 'behind': return 'bg-red-100 text-red-800';
      case 'ahead': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const overallProgress = Math.round((totalSaved / totalTarget) * 100);

  return (
    <div className="p-6">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Saved</p>
              <h3 className="text-2xl font-semibold text-gray-900">${totalSaved.toLocaleString()}</h3>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp size={12} className="text-green-500" />
                <span className="text-xs text-green-500">+12% this month</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign size={20} className="text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Target</p>
              <h3 className="text-2xl font-semibold text-gray-900">${totalTarget.toLocaleString()}</h3>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-500">{overallProgress}% complete</span>
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
              <p className="text-sm text-gray-600 mb-1">Monthly Savings</p>
              <h3 className="text-2xl font-semibold text-gray-900">$1,850</h3>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-500">Across all goals</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar size={20} className="text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Goals</p>
              <h3 className="text-2xl font-semibold text-gray-900">{goals.length}</h3>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-500">2 on track</span>
              </div>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <CheckCircle size={20} className="text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Goals List */}
        <div className="col-span-2">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all">All Goals</TabsTrigger>
                <TabsTrigger value="on-track">On Track</TabsTrigger>
                <TabsTrigger value="behind">Behind</TabsTrigger>
              </TabsList>
              <Button className="gap-2">
                <Plus size={16} />
                Add New Goal
              </Button>
            </div>

            <TabsContent value="all" className="space-y-4">
              {goals.map((goal) => (
                <Card key={goal.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                        <Badge variant="outline" className={getPriorityColor(goal.priority)}>
                          {goal.priority}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(goal.status)}>
                          {goal.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>Due {formatDate(goal.targetDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{goal.daysRemaining} days left</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign size={14} />
                          <span>${goal.monthlyContribution}/month</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Progress</span>
                      <span className="text-sm text-gray-600">
                        ${goal.currentAmount.toLocaleString()} of ${goal.targetAmount.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={goal.progressPercentage} className="h-3" />
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{goal.progressPercentage}% complete</span>
                      <span>${(goal.targetAmount - goal.currentAmount).toLocaleString()} remaining</span>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="on-track" className="space-y-4">
              {goals.filter(g => g.status === 'on-track').map((goal) => (
                <Card key={goal.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                        <Badge variant="outline" className={getPriorityColor(goal.priority)}>
                          {goal.priority}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(goal.status)}>
                          {goal.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Progress value={goal.progressPercentage} className="h-3" />
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{goal.progressPercentage}% complete</span>
                      <span>${(goal.targetAmount - goal.currentAmount).toLocaleString()} remaining</span>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="behind" className="space-y-4">
              {goals.filter(g => g.status === 'behind').map((goal) => (
                <Card key={goal.id} className="p-6 border-red-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                        <Badge variant="outline" className={getPriorityColor(goal.priority)}>
                          {goal.priority}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(goal.status)}>
                          {goal.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Progress value={goal.progressPercentage} className="h-3" />
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{goal.progressPercentage}% complete</span>
                      <span className="text-red-600">Needs attention</span>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Goal Insights */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Goal Insights</h3>
            <div className="space-y-4">
              {goalInsights.map((insight, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      insight.type === 'warning' ? 'bg-red-100' :
                      insight.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {insight.type === 'warning' && <AlertCircle size={14} className="text-red-600" />}
                      {insight.type === 'success' && <CheckCircle size={14} className="text-green-600" />}
                      {insight.type === 'tip' && <Target size={14} className="text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">{insight.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
                      <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-blue-600 hover:text-blue-700">
                        View details →
                      </Button>
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
                <Plus size={16} />
                Create New Goal
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <TrendingUp size={16} />
                Boost Savings
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Calendar size={16} />
                Schedule Review
              </Button>
            </div>
          </div>

          {/* Goal Categories */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {['Safety Net', 'Travel', 'Investment', 'Transportation'].map((category) => (
                <div key={category} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                  <span className="text-sm text-gray-700">{category}</span>
                  <Badge variant="secondary" className="text-xs">
                    {goals.filter(g => g.category === category).length}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}