import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Plus,
  CheckCircle,
  FileText,
  ArrowUpRight,
  Clock
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
      case 'on-track': return 'text-green-400 border-green-400/30';
      case 'behind': return 'text-red-400 border-red-400/30';
      case 'ahead': return 'text-blue-400 border-blue-400/30';
      case 'completed': return 'text-purple-400 border-purple-400/30';
      default: return 'text-gray-400 border-gray-400/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 border-red-400/30';
      case 'medium': return 'text-yellow-400 border-yellow-400/30';
      case 'low': return 'text-green-400 border-green-400/30';
      default: return 'text-gray-400 border-gray-400/30';
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
      <div className="finora-goals-page" style={{ background: 'var(--background-primary)', color: 'var(--text-primary)' }}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p style={{ color: 'var(--text-secondary)' }}>Loading goals...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (goals.length === 0) {
    return (
      <div className="finora-goals-page p-8" style={{ background: 'var(--background-primary)', minHeight: '100vh' }}>
        {/* Zero State Stats */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          <div className="finora-card p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Saved</p>
                <h3 className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>$0.00</h3>
              </div>
              <div className="p-2 rounded-lg" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                <DollarSign size={20} className="text-green-400" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span>Create goals to start saving</span>
            </div>
          </div>

          <div className="finora-card p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Target</p>
                <h3 className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>$0.00</h3>
              </div>
              <div className="p-2 rounded-lg" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                <Target size={20} className="text-blue-400" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span>No goals set yet</span>
            </div>
          </div>

          <div className="finora-card p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Monthly Savings</p>
                <h3 className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>$0.00</h3>
              </div>
              <div className="p-2 rounded-lg" style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
                <Calendar size={20} className="text-purple-400" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span>Set contribution amounts</span>
            </div>
          </div>

          <div className="finora-card p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Active Goals</p>
                <h3 className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>0</h3>
              </div>
              <div className="p-2 rounded-lg" style={{ background: 'rgba(251, 146, 60, 0.1)' }}>
                <CheckCircle size={20} className="text-orange-400" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span>Create your first goal</span>
            </div>
          </div>
        </div>

        {/* Empty State Content */}
        <div className="text-center py-16">
          <Target size={64} className="mx-auto text-gray-400 mb-6" />
          <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            No Financial Goals Yet
          </h2>
          <p className="mb-8 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Start your financial journey by setting meaningful goals. Whether it's building an emergency fund, 
            saving for a vacation, or planning for retirement, we'll help you track your progress.
          </p>
          <Button 
            className="gap-2"
            style={{ background: 'var(--sidebar-primary)' }}
          >
            <Plus size={16} />
            Create Your First Goal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="finora-goals-page p-8" style={{ background: 'var(--background-primary)', minHeight: '100vh' }}>
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="finora-card p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Saved</p>
              <h3 className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                ${totalSaved.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-2 rounded-lg" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
              <DollarSign size={20} className="text-green-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <TrendingUp size={14} className="text-green-400" />
            <span>{overallProgress}% of target</span>
          </div>
        </div>

        <div className="finora-card p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Target</p>
              <h3 className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                ${totalTarget.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-2 rounded-lg" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <Target size={20} className="text-blue-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span>{overallProgress}% complete</span>
          </div>
        </div>

        <div className="finora-card p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Monthly Savings</p>
              <h3 className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                ${totalMonthlyContributions.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-2 rounded-lg" style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
              <Calendar size={20} className="text-purple-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span>Across all goals</span>
          </div>
        </div>

        <div className="finora-card p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Active Goals</p>
              <h3 className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{goals.length}</h3>
            </div>
            <div className="p-2 rounded-lg" style={{ background: 'rgba(251, 146, 60, 0.1)' }}>
              <CheckCircle size={20} className="text-orange-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span>
              {goals.filter(g => g.status === 'on-track').length} on track
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Goals List */}
        <div className="col-span-2">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList style={{ background: 'var(--background-card)' }}>
                <TabsTrigger value="all" style={{ color: 'var(--text-secondary)' }}>All Goals</TabsTrigger>
                <TabsTrigger value="on-track" style={{ color: 'var(--text-secondary)' }}>On Track</TabsTrigger>
                <TabsTrigger value="behind" style={{ color: 'var(--text-secondary)' }}>Behind</TabsTrigger>
              </TabsList>
              <Button 
                className="gap-2"
                style={{ background: 'var(--sidebar-primary)' }}
              >
                <Plus size={16} />
                Add New Goal
              </Button>
            </div>

            <TabsContent value="all" className="space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="finora-card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{goal.title}</h3>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getStatusColor(goal.status)}`}
                          style={{ background: 'transparent' }}
                        >
                          {goal.status}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(goal.priority)}`}
                          style={{ background: 'transparent' }}
                        >
                          {goal.priority}
                        </Badge>
                      </div>
                      <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{goal.description}</p>
                      <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
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
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Progress</span>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        ${goal.currentAmount.toLocaleString()} of ${goal.targetAmount.toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)} 
                      className="h-3" 
                      style={{ background: 'var(--background-primary)' }}
                    />
                    <div className="flex items-center justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <span>{Math.round((goal.currentAmount / goal.targetAmount) * 100)}% complete</span>
                      <span>${(goal.targetAmount - goal.currentAmount).toLocaleString()} remaining</span>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="on-track" className="space-y-4">
              {goals.filter(g => g.status === 'on-track').map((goal) => (
                <div key={goal.id} className="finora-card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{goal.title}</h3>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(goal.priority)}`}
                          style={{ background: 'transparent' }}
                        >
                          {goal.priority}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getStatusColor(goal.status)}`}
                          style={{ background: 'transparent' }}
                        >
                          {goal.status}
                        </Badge>
                      </div>
                      <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{goal.description}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Progress 
                      value={Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)} 
                      className="h-3" 
                      style={{ background: 'var(--background-primary)' }}
                    />
                    <div className="flex items-center justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <span>{Math.round((goal.currentAmount / goal.targetAmount) * 100)}% complete</span>
                      <span>${(goal.targetAmount - goal.currentAmount).toLocaleString()} remaining</span>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="behind" className="space-y-4">
              {goals.filter(g => g.status === 'behind').map((goal) => (
                <div key={goal.id} className="finora-card p-6 border-red-400/30">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{goal.title}</h3>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(goal.priority)}`}
                          style={{ background: 'transparent' }}
                        >
                          {goal.priority}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getStatusColor(goal.status)}`}
                          style={{ background: 'transparent' }}
                        >
                          {goal.status}
                        </Badge>
                      </div>
                      <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{goal.description}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Progress 
                      value={Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)} 
                      className="h-3" 
                      style={{ background: 'var(--background-primary)' }}
                    />
                    <div className="flex items-center justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <span>{Math.round((goal.currentAmount / goal.targetAmount) * 100)}% complete</span>
                      <span className="text-red-400">Needs attention</span>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Goal Categories */}
          <div>
            <h3 className="font-medium mb-4" style={{ color: 'var(--text-primary)' }}>Goal Categories</h3>
            <div className="space-y-2">
              {Array.from(new Set(goals.map(g => g.category))).map((category) => (
                <div key={category} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(107, 114, 128, 0.1)' }}>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{category}</span>
                  <Badge 
                    variant="secondary" 
                    className="text-xs"
                    style={{ 
                      background: 'rgba(107, 70, 193, 0.2)', 
                      color: 'var(--text-secondary)',
                      border: 'none'
                    }}
                  >
                    {goals.filter(g => g.category === category).length}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="font-medium mb-4" style={{ color: 'var(--text-primary)' }}>Quick Actions</h3>
            <div className="space-y-3">
              <Button 
                className="w-full justify-start gap-2"
                style={{ background: 'var(--sidebar-primary)' }}
              >
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