import React, { useState } from 'react';
import { 
  Calendar, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreHorizontal,
  CreditCard,
  MapPin,
  Clock,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';

export default function SpendingPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('This Month');

  const transactions = [
    {
      id: 1,
      merchant: 'Starbucks Coffee',
      category: 'Food & Dining',
      amount: -4.85,
      date: 'Today, 2:15 PM',
      location: 'Downtown Seattle',
      paymentMethod: 'Credit Card •••• 4526',
      recurring: false
    },
    {
      id: 2,
      merchant: 'Shell Gas Station',
      category: 'Transportation',
      amount: -45.20,
      date: 'Yesterday, 8:30 AM',
      location: 'Highway 101',
      paymentMethod: 'Debit Card •••• 2847',
      recurring: false
    },
    {
      id: 3,
      merchant: 'Amazon Prime',
      category: 'Subscriptions',
      amount: -14.99,
      date: 'Dec 26, 2024',
      location: 'Online',
      paymentMethod: 'Credit Card •••• 4526',
      recurring: true
    },
    {
      id: 4,
      merchant: 'Whole Foods Market',
      category: 'Groceries',
      amount: -127.83,
      date: 'Dec 25, 2024',
      location: 'Capitol Hill',
      paymentMethod: 'Credit Card •••• 4526',
      recurring: false
    },
    {
      id: 5,
      merchant: 'Salary Deposit',
      category: 'Income',
      amount: 4250.00,
      date: 'Dec 24, 2024',
      location: 'Direct Deposit',
      paymentMethod: 'Bank Account •••• 9384',
      recurring: true
    }
  ];

  const categorySpending = [
    { category: 'Food & Dining', amount: 680, budget: 600, percentage: 113, trend: 'up', change: '+15%' },
    { category: 'Transportation', amount: 420, budget: 500, percentage: 84, trend: 'down', change: '-5%' },
    { category: 'Groceries', amount: 350, budget: 400, percentage: 88, trend: 'up', change: '+8%' },
    { category: 'Entertainment', amount: 280, budget: 300, percentage: 93, trend: 'up', change: '+12%' },
    { category: 'Subscriptions', amount: 89, budget: 100, percentage: 89, trend: 'down', change: '-2%' },
    { category: 'Shopping', amount: 156, budget: 200, percentage: 78, trend: 'down', change: '-10%' }
  ];

  const spendingInsights = [
    {
      type: 'warning',
      title: 'Budget Alert: Food & Dining',
      description: 'You\'ve exceeded your dining budget by 13%. You\'ve spent $80 more than planned.',
      action: 'Adjust budget'
    },
    {
      type: 'success',
      title: 'Great Savings: Transportation',
      description: 'You\'re saving $80 this month on transportation compared to your budget.',
      action: 'Keep it up'
    },
    {
      type: 'info',
      title: 'Recurring Payment Due',
      description: 'Your Netflix subscription ($15.99) will be charged in 3 days.',
      action: 'Review subscriptions'
    }
  ];

  const weeklySpending = [320, 280, 450, 380];

  return (
    <div className="p-6">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Spent</p>
              <h3 className="text-2xl font-semibold text-gray-900">$3,240</h3>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight size={12} className="text-red-500" />
                <span className="text-xs text-red-500">+12% vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <CreditCard size={20} className="text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Budget Remaining</p>
              <h3 className="text-2xl font-semibold text-gray-900">$760</h3>
              <div className="flex items-center gap-1 mt-1">
                <ArrowDownRight size={12} className="text-green-500" />
                <span className="text-xs text-green-500">19% of budget left</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp size={20} className="text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Daily Average</p>
              <h3 className="text-2xl font-semibold text-gray-900">$108</h3>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight size={12} className="text-red-500" />
                <span className="text-xs text-red-500">+8% vs target</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar size={20} className="text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Largest Purchase</p>
              <h3 className="text-2xl font-semibold text-gray-900">$127</h3>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-500">Whole Foods Market</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <ArrowUpRight size={20} className="text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Transactions List */}
        <div className="col-span-2">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all">All Transactions</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter size={16} />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download size={16} />
                  Export
                </Button>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4">
              {transactions.map((transaction) => (
                <Card key={transaction.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${
                        transaction.amount > 0 ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <CreditCard size={16} className={
                          transaction.amount > 0 ? 'text-green-600' : 'text-gray-600'
                        } />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{transaction.merchant}</h4>
                          {transaction.recurring && (
                            <Badge variant="outline" className="text-xs">Recurring</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            <span>{transaction.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin size={12} />
                            <span>{transaction.location}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{transaction.paymentMethod}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">{transaction.category}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="income" className="space-y-4">
              {transactions.filter(t => t.amount > 0).map((transaction) => (
                <Card key={transaction.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-full">
                        <CreditCard size={16} className="text-green-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{transaction.merchant}</h4>
                          {transaction.recurring && (
                            <Badge variant="outline" className="text-xs">Recurring</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            <span>{transaction.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        +${transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">{transaction.category}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="expenses" className="space-y-4">
              {transactions.filter(t => t.amount < 0).map((transaction) => (
                <Card key={transaction.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-100 rounded-full">
                        <CreditCard size={16} className="text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{transaction.merchant}</h4>
                          {transaction.recurring && (
                            <Badge variant="outline" className="text-xs">Recurring</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            <span>{transaction.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin size={12} />
                            <span>{transaction.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">{transaction.category}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Category Breakdown</h3>
              <Button variant="ghost" size="sm">
                <MoreHorizontal size={16} />
              </Button>
            </div>
            <div className="space-y-4">
              {categorySpending.map((category, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{category.category}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">${category.amount}</span>
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
                  <div className="space-y-2">
                    <Progress 
                      value={category.percentage} 
                      className={`h-2 ${category.percentage > 100 ? 'text-red-500' : ''}`}
                    />
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>${category.amount} of ${category.budget}</span>
                      <span>{category.percentage}%</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Spending Insights</h3>
              <Button variant="ghost" size="sm">
                <MoreHorizontal size={16} />
              </Button>
            </div>
            <div className="space-y-4">
              {spendingInsights.map((insight, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      insight.type === 'warning' ? 'bg-red-100' :
                      insight.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {insight.type === 'warning' && <AlertTriangle size={14} className="text-red-600" />}
                      {insight.type === 'success' && <TrendingUp size={14} className="text-green-600" />}
                      {insight.type === 'info' && <Clock size={14} className="text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">{insight.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
                      <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-blue-600 hover:text-blue-700">
                        {insight.action} →
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}