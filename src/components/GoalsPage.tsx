import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Plus,
  CheckCircle,
  FileText
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { goalsAPI } from '../services/api';

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await goalsAPI.getAll();
        setGoals(response.goals || []);
      } catch (error) {
        console.error('Error fetching goals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, []);

  // Calculate real stats from user data
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;
  const totalMonthlyContributions = goals.reduce((sum, goal) => sum + goal.monthlyContribution, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800';
      case 'behind': return 'bg-red-100 text-red-800';
      case 'ahead': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
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

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (goals.length === 0) {
    return (
      <div className="p-6">
        {/* Zero State Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Saved</p>
                <h3 className="text-2xl font-semibold text-gray-900">$0.00</h3>
                <span className="text-xs text-gray-500">Create goals to start saving</span>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <DollarSign size={20} className="text-gray-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Target</p>
                <h3 className="text-2xl font-semibold text-gray-900">$0.00</h3>
                <span className="text-xs text-gray-500">No goals set yet</span>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <Target size={20} className="text-gray-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Monthly Savings</p>
                <h3 className="text-2xl font-semibold text-gray-900">$0.00</h3>
                <span className="text-xs text-gray-500">Set contribution amounts</span>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <Calendar size={20} className="text-gray-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Goals</p>
                <h3 className="text-2xl font-semibold text-gray-900">0</h3>
                <span className="text-xs text-gray-500">Create your first goal</span>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <CheckCircle size={20} className="text-gray-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Empty State Content */}
        <div className="text-center py-16">
          <Target size={64} className="mx-auto text-gray-400 mb-6" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Financial Goals Yet</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Start your financial journey by setting meaningful goals. Whether it's building an emergency fund, 
            saving for a vacation, or planning for retirement, we'll help you track your progress.
          </p>
          <Button className="gap-2">
            <Plus size={16} />
            Create Your First Goal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Saved</p>
              <h3 className="text-2xl font-semibold text-gray-900">
                ${totalSaved.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp size={12} className="text-green-500" />
                <span className="text-xs text-green-500">{overallProgress}% of target</span>
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
              <h3 className="text-2xl font-semibold text-gray-900">
                ${totalTarget.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
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
              <h3 className="text-2xl font-semibold text-gray-900">
                ${totalMonthlyContributions.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
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
                <span className="text-xs text-gray-500">
                  {goals.filter(g => g.status === 'on-track').length} on track
                </span>
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
                        <Badge variant="outline" className={getStatusColor(goal.status)}>
                          {goal.status}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(goal.priority)}>
                          {goal.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>Due {formatDate(goal.targetDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign size={14} />
                          <span>${goal.monthlyContribution}/month</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Progress</span>
                      <span className="text-sm text-gray-600">
                        ${goal.currentAmount.toLocaleString()} of ${goal.targetAmount.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)} 
                      className="h-3" 
                    />
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{Math.round((goal.currentAmount / goal.targetAmount) * 100)}% complete</span>
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
                    <Progress 
                      value={Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)} 
                      className="h-3" 
                    />
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{Math.round((goal.currentAmount / goal.targetAmount) * 100)}% complete</span>
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
                    <Progress 
                      value={Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)} 
                      className="h-3" 
                    />
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{Math.round((goal.currentAmount / goal.targetAmount) * 100)}% complete</span>
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
          {/* Goal Categories */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Goal Categories</h3>
            <div className="space-y-2">
              {Array.from(new Set(goals.map(g => g.category))).map((category) => (
                <div key={category} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <span className="text-sm font-medium text-gray-700">{category}</span>
                  <Badge variant="secondary" className="text-xs">
                    {goals.filter(g => g.category === category).length}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start gap-2">
                <Plus size={16} />
                Add New Goal
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}