import React, { useState, useEffect } from 'react';
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Target,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Upload,
  FileText,
  RefreshCw,
  MoreHorizontal,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { transactionsAPI, goalsAPI, Transaction, Goal } from '../services/api';
import api from '../services/api';

const COLORS = ['#10B981', '#EF4444', '#8B5CF6', '#F59E0B', '#06B6D4', '#84CC16'];

export function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionResponse, goalResponse] = await Promise.all([
          transactionsAPI.getAll(),
          goalsAPI.getAll()
        ]);
        setTransactions(transactionResponse.transactions || []);
        setGoals(goalResponse.goals || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Convert Wells Fargo CSV to standard format
  const convertWellsFargoCSV = (lines: string[]): string => {
    const convertedLines = ['Date,Description,Amount,Category,Location,Payment Method']; // Header
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      try {
        // Parse Wells Fargo format: "Date","Amount","Flag","Empty","Description"
        const columns = line.split('","');
        if (columns.length !== 5) continue;

        // Clean up the columns (remove quotes)
        const date = columns[0].replace(/^"|"$/g, '');
        const amount = columns[1].replace(/^"|"$/g, '');
        const description = columns[4].replace(/^"|"$/g, '');

        // Skip if essential data is missing
        if (!date || !amount || !description) continue;

        // Auto-categorize
        const category = categorizeTransaction(description, parseFloat(amount));
        const location = extractLocation(description);
        const paymentMethod = getPaymentMethod(description);

        // Format the converted line
        const convertedLine = [
          date,
          `"${description}"`,
          amount,
          `"${category}"`,
          `"${location}"`,
          `"${paymentMethod}"`
        ].join(',');

        convertedLines.push(convertedLine);

      } catch (error) {
        console.warn(`Skipping line ${i + 1}: ${error}`);
      }
    }

    return convertedLines.join('\n');
  };

  // Universal CSV processor - handles any format and uploads in one action
  const handleUniversalCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }

    setIsProcessing(true);
    try {
      // Read the uploaded file
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());

      if (lines.length === 0) {
        alert('CSV file is empty');
        return;
      }

      // Try to detect format and convert
      let csvContent: string;
      const firstLine = lines[0].toLowerCase();

      // Check if it's Wells Fargo format (has exactly 5 columns)
      const firstLineColumns = lines[0].split(',');
      if (firstLineColumns.length === 5 && !firstLine.includes('date') && !firstLine.includes('description')) {
        console.log('Detected Wells Fargo format, converting...');
        csvContent = convertWellsFargoCSV(lines);
      } else {
        // Assume it's already in a standard format
        console.log('Using file as-is...');
        csvContent = text;
      }

      // Create a new file with the converted content
      const convertedBlob = new Blob([csvContent], { type: 'text/csv' });
      const convertedFile = new File([convertedBlob], 'converted_transactions.csv', { type: 'text/csv' });

      // Upload via the API
      const formData = new FormData();
      formData.append('csvFile', convertedFile);

      const response = await api.post('/api/csv-import/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        alert(`Successfully imported ${response.data.imported} transactions!`);
        // Refresh data
        const transactionResponse = await transactionsAPI.getAll();
        setTransactions(transactionResponse.transactions || []);
      } else {
        alert('Failed to import CSV file');
      }

    } catch (error: any) {
      console.error('Error processing CSV:', error);
      alert('Failed to process CSV: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsProcessing(false);
      // Reset the input
      event.target.value = '';
    }
  };

  // Improved categorization logic based on your actual transactions
  const categorizeTransaction = (description: string, amount: number): string => {
    const desc = description.toLowerCase();
    
    // ALL POSITIVE AMOUNTS ARE INCOME - NO EXCEPTIONS!
    if (amount > 0) {
      return 'Income';
    }
    
    // Credit Card Payments
    if (desc.includes('wells fargo card') || desc.includes('applecard') || desc.includes('credit card pymt') ||
        desc.includes('cc payment') || desc.includes('card payment') || desc.includes('credit card')) {
      return 'Credit Card Payments';
    }
    
    // Rent & Housing
    if (desc.includes('bilt') || desc.includes('rent') || desc.includes('housing') || 
        desc.includes('apartment') || desc.includes('lease')) {
      return 'Rent & Housing';
    }
    
    // Money Transfers (including Venmo)
    if (desc.includes('venmo') || desc.includes('zelle') || desc.includes('paypal') || 
        desc.includes('cashapp') || desc.includes('transfer') || desc.includes('wire') || 
        desc.includes('ach') || desc.includes('send money') || desc.includes('money transfer')) {
      return 'Money Transfers';
    }
    
    // Online Bill Payments
    if (desc.includes('online pymt') || desc.includes('online payment') || desc.includes('bill pay') ||
        desc.includes('autopay') || desc.includes('auto pay') || desc.includes('scheduled payment')) {
      return 'Bill Payments';
    }
    
    // Subscriptions & Services - Recurring digital payments
    if (desc.includes('apple.com') || desc.includes('netflix') || desc.includes('spotify') || 
        desc.includes('amazon prime') || desc.includes('windscribe') || desc.includes('adobe') ||
        desc.includes('microsoft') || desc.includes('distrokid') || desc.includes('subscription') ||
        desc.includes('recurring payment') || desc.includes('monthly') || desc.includes('annual')) {
      return 'Subscriptions';
    }
    
    // Shopping - Purchases, retail stores
    if (desc.includes('purchase authorized') || desc.includes('amazon') || desc.includes('target') ||
        desc.includes('walmart') || desc.includes('store') || desc.includes('shop') ||
        desc.includes('retail') || desc.includes('merchant') || desc.includes('pos purchase')) {
      return 'Shopping';
    }
    
    // ATM & Cash
    if (desc.includes('atm withdrawal') || desc.includes('atm') || desc.includes('cash advance') ||
        desc.includes('cash back') || desc.includes('withdrawal')) {
      return 'ATM & Cash';
    }
    
    // Fees & Charges
    if (desc.includes('fee') || desc.includes('charge') || desc.includes('interest') ||
        desc.includes('penalty') || desc.includes('service charge') || desc.includes('overdraft')) {
      return 'Fees & Charges';
    }
    
    // For everything else, use a simple generic category
    return 'Others';
  };

  // Extract location from description
  const extractLocation = (description: string): string => {
    const desc = description.toLowerCase();
    
    if (desc.includes(' ca ') || desc.includes(' california ')) {
      const match = description.match(/\s([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\s+CA\s/i);
      if (match) return match[1];
    }
    
    if (desc.includes('atm')) {
      const match = description.match(/ATM.*?(\d+\s+[^0-9]+(?:[A-Z][a-z]+\s+)*[A-Z][a-z]+)/i);
      if (match) return match[1];
    }
    
    return '';
  };

  // Determine payment method from description
  const getPaymentMethod = (description: string): string => {
    const desc = description.toLowerCase();
    
    if (desc.includes('card 9185') || desc.includes('purchase authorized') || desc.includes('recurring payment authorized')) {
      return 'Credit Card';
    }
    if (desc.includes('atm')) return 'ATM';
    if (desc.includes('venmo')) return 'Venmo';
    if (desc.includes('zelle')) return 'Zelle';
    if (desc.includes('dir dep') || desc.includes('direct deposit') || desc.includes('payroll')) return 'Direct Deposit';
    if (desc.includes('online pymt') || desc.includes('auto pay')) return 'Online Payment';
    if (desc.includes('mobile deposit')) return 'Mobile Deposit';
    
    return 'Bank Transfer';
  };

  const triggerFileInput = () => {
    document.getElementById('universal-csv-input')?.click();
  };

  // Calculate real stats from user data
  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const netWorth = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  
  const totalGoalsTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalGoalsCurrent = goals.reduce((sum, g) => sum + g.currentAmount, 0);

  // Process data for charts
  const processChartData = () => {
    if (transactions.length === 0) {
      return { spendingByCategory: [], monthlyTrend: [], categoryStats: [] };
    }

    // Group by category for spending analysis
    const spendingByCategory = transactions
      .filter(t => t.amount < 0)
      .reduce((acc, t) => {
        const category = t.category || 'Others';
        if (!acc[category]) {
          acc[category] = { amount: 0, count: 0 };
        }
        acc[category].amount += Math.abs(t.amount);
        acc[category].count += 1;
        return acc;
      }, {} as Record<string, { amount: number; count: 0 }>);

    const categoryStats = Object.entries(spendingByCategory)
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        count: data.count,
        percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    return { categoryStats };
  };

  const { categoryStats } = processChartData();

  // Empty state
  if (transactions.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, here's your financial overview</p>
          </div>
          <Button className="gap-2" onClick={triggerFileInput} disabled={isProcessing}>
            <Upload className="h-4 w-4" />
            {isProcessing ? 'Processing...' : 'Upload CSV'}
          </Button>
        </div>

        {/* Empty state */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="col-span-2 md:col-span-1">
            <CardContent className="p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Transactions Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start by uploading a CSV file with your transaction history or add transactions manually.
              </p>
              <div className="space-y-3">
                <input
                  id="universal-csv-input"
                  type="file"
                  accept=".csv"
                  onChange={handleUniversalCSVUpload}
                  style={{ display: 'none' }}
                />
                <Button 
                  className="w-full gap-2"
                  onClick={triggerFileInput}
                  disabled={isProcessing}
                >
                  <Upload className="h-4 w-4" />
                  {isProcessing ? 'Processing...' : 'Upload CSV File'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 border border-dashed rounded-lg">
                <Upload className="h-5 w-5 text-blue-500" />
                <div>
                  <h4 className="font-medium">Upload Any CSV</h4>
                  <p className="text-sm text-muted-foreground">Automatically converts and imports your bank data</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border border-dashed rounded-lg">
                <DollarSign className="h-5 w-5 text-green-500" />
                <div>
                  <h4 className="font-medium">Set Financial Goals</h4>
                  <p className="text-sm text-muted-foreground">Track progress toward your targets</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border border-dashed rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <div>
                  <h4 className="font-medium">Track Spending</h4>
                  <p className="text-sm text-muted-foreground">Analyze your expenses and income</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show real data if available
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, here's your financial overview</p>
        </div>
        <Button className="gap-2" onClick={triggerFileInput} disabled={isProcessing}>
          <Upload className="h-4 w-4" />
          {isProcessing ? 'Processing...' : 'Upload CSV'}
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Worth
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">${netWorth.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs">
              <ArrowUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">{savingsRate.toFixed(0)}%</span>
              <span className="text-muted-foreground">savings rate</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">${totalExpenses.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs">
              <ArrowDown className="h-3 w-3 text-red-500" />
              <span className="text-red-500">10%</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Income
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">${totalIncome.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs">
              <ArrowUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">20%</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Goals Progress
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">${totalGoalsCurrent.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs">
              <ArrowUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">25%</span>
              <span className="text-muted-foreground">of target</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Spending by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryStats.length > 0 ? (
              <div className="space-y-4">
                {categoryStats.slice(0, 5).map((category, index) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{category.category}</span>
                        <span className="text-muted-foreground">({category.count} transactions)</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">
                          ${category.amount.toFixed(2)}
                        </span>
                        <span className="ml-2 text-muted-foreground">
                          {category.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${category.percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                No spending data available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-sm">
                        {transaction.description.length > 30 
                          ? transaction.description.substring(0, 30) + '...' 
                          : transaction.description
                        }
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p 
                        className={`font-semibold ${transaction.amount > 0 ? 'text-green-500' : 'text-foreground'}`}
                      >
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                No transactions yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Goals Progress */}
      {goals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Goals Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.slice(0, 3).map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{goal.title}</span>
                  <span className="text-muted-foreground">
                    ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                  </span>
                </div>
                <Progress 
                  value={(goal.currentAmount / goal.targetAmount) * 100} 
                  className="h-2" 
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Hidden CSV input */}
      <input
        id="universal-csv-input"
        type="file"
        accept=".csv"
        onChange={handleUniversalCSVUpload}
        style={{ display: 'none' }}
      />
    </div>
  );
}