import React, { useState, useEffect } from 'react';
import { 
  DollarSign,
  PiggyBank,
  TrendingUp,
  CreditCard,
  Lightbulb,
  BookOpen,
  FileText,
  Upload,
  Plus,
  RefreshCw,
  MoreHorizontal,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { transactionsAPI, goalsAPI } from '../services/api';
import api from '../services/api';

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  location?: string;
  paymentMethod?: string;
}

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
}

const COLORS = ['#10B981', '#EF4444', '#8B5CF6', '#F59E0B', '#06B6D4', '#84CC16'];

export default function Dashboard({ onNavigate }: DashboardProps) {
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

  // Recategorize existing transactions
  const recategorizeTransactions = async () => {
    if (!confirm('This will update all transaction categories based on the latest categorization rules. Continue?')) {
      return;
    }

    setIsProcessing(true);
    try {
      const response = await api.put('/api/transactions/recategorize/all');
      
      if (response.data) {
        alert(`Successfully updated ${response.data.updated} out of ${response.data.total} transactions!`);
        
        // Refresh transactions to show updated categories
        const updatedTransactions = await transactionsAPI.getAll();
        setTransactions(updatedTransactions.transactions || []);
      }
    } catch (error) {
      console.error('Error recategorizing transactions:', error);
      alert('Failed to update categories. Please try again.');
    } finally {
      setIsProcessing(false);
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
      <div className="p-8" style={{ background: 'var(--background-primary)', minHeight: '100vh' }}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Dashboard Overview
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Here is a summary of your financial information
          </p>
        </div>

        {/* Empty state with Finora styling */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="finora-card p-8">
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No Transactions Yet</h3>
              <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
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
                  className="w-full gap-2 bg-purple-600 hover:bg-purple-700"
                  onClick={triggerFileInput}
                  disabled={isProcessing}
                >
                  <Upload size={16} />
                  {isProcessing ? 'Processing...' : 'Upload CSV File'}
                </Button>
              </div>
            </div>
          </div>

          <div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Get Started</h3>
                <div className="space-y-3">
                  <Card className="finora-card p-4 border-dashed" style={{ borderColor: 'var(--border-primary)' }}>
                    <div className="flex items-center gap-3">
                      <Upload size={20} className="text-blue-500" />
                      <div>
                        <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>Upload Any CSV</h4>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Automatically converts and imports your bank data</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="finora-card p-4 border-dashed" style={{ borderColor: 'var(--border-primary)' }}>
                    <div className="flex items-center gap-3">
                      <DollarSign size={20} className="text-green-500" />
                      <div>
                        <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>Set Financial Goals</h4>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Track progress toward your targets</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="finora-card p-4 border-dashed" style={{ borderColor: 'var(--border-primary)' }}>
                    <div className="flex items-center gap-3">
                      <TrendingUp size={20} className="text-purple-500" />
                      <div>
                        <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>Track Spending</h4>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Analyze your expenses and income</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show real data if available
  return (
    <div className="p-8" style={{ background: 'var(--background-primary)', minHeight: '100vh' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Dashboard Overview
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Here is a summary of your financial information
        </p>
      </div>

      {/* Finora Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="finora-card p-6 relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Net Worth</p>
              <h3 className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                ${netWorth.toLocaleString()}
              </h3>
            </div>
            <button className="p-1 rounded hover:bg-gray-700 transition-colors">
              <MoreHorizontal size={16} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <ArrowUp size={12} style={{ color: 'var(--chart-revenue)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--chart-revenue)' }}>
                {savingsRate.toFixed(0)}%
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                vs last month
              </span>
            </div>
            <div className="mini-chart flex items-end justify-center gap-0.5">
              {[20, 35, 25, 40, 30, 45, 35, 50].map((value, index) => (
                <div
                  key={index}
                  className="w-1 rounded-sm transition-all duration-300"
                  style={{
                    height: `${Math.max(8, (value / 50) * 32)}px`,
                    backgroundColor: 'var(--chart-revenue)',
                    opacity: 0.8 + (index * 0.05)
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="finora-card p-6 relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Expenses</p>
              <h3 className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                ${totalExpenses.toLocaleString()}
              </h3>
            </div>
            <button className="p-1 rounded hover:bg-gray-700 transition-colors">
              <MoreHorizontal size={16} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <ArrowDown size={12} style={{ color: 'var(--chart-expense)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--chart-expense)' }}>
                10%
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                vs last month
              </span>
            </div>
            <div className="mini-chart flex items-end justify-center gap-0.5">
              {[30, 25, 35, 20, 40, 25, 45, 30].map((value, index) => (
                <div
                  key={index}
                  className="w-1 rounded-sm transition-all duration-300"
                  style={{
                    height: `${Math.max(8, (value / 50) * 32)}px`,
                    backgroundColor: 'var(--chart-expense)',
                    opacity: 0.8 + (index * 0.05)
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="finora-card p-6 relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Income</p>
              <h3 className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                ${totalIncome.toLocaleString()}
              </h3>
            </div>
            <button className="p-1 rounded hover:bg-gray-700 transition-colors">
              <MoreHorizontal size={16} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <ArrowUp size={12} style={{ color: 'var(--chart-profit)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--chart-profit)' }}>
                20%
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                vs last month
              </span>
            </div>
            <div className="mini-chart flex items-end justify-center gap-0.5">
              {[15, 25, 20, 35, 25, 40, 30, 45].map((value, index) => (
                <div
                  key={index}
                  className="w-1 rounded-sm transition-all duration-300"
                  style={{
                    height: `${Math.max(8, (value / 50) * 32)}px`,
                    backgroundColor: 'var(--chart-profit)',
                    opacity: 0.8 + (index * 0.05)
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="finora-card p-6 relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Goals Progress</p>
              <h3 className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                ${totalGoalsCurrent.toLocaleString()}
              </h3>
            </div>
            <button className="p-1 rounded hover:bg-gray-700 transition-colors">
              <MoreHorizontal size={16} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <ArrowUp size={12} style={{ color: 'var(--chart-revenue)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--chart-revenue)' }}>
                25%
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                of target
              </span>
            </div>
            <div className="mini-chart flex items-end justify-center gap-0.5">
              {[10, 15, 12, 25, 18, 30, 22, 35].map((value, index) => (
                <div
                  key={index}
                  className="w-1 rounded-sm transition-all duration-300"
                  style={{
                    height: `${Math.max(8, (value / 35) * 32)}px`,
                    backgroundColor: 'var(--chart-revenue)',
                    opacity: 0.8 + (index * 0.05)
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Spending by Category */}
        <div className="finora-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Spending by Category</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Top categories</span>
              {transactions.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={recategorizeTransactions}
                  disabled={isProcessing}
                  className="gap-2 text-xs border-gray-600 hover:bg-gray-700"
                  style={{ 
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <RefreshCw size={14} />
                  {isProcessing ? 'Updating...' : 'Update Categories'}
                </Button>
              )}
            </div>
          </div>
          {categoryStats.length > 0 ? (
            <div className="space-y-4">
              {categoryStats.slice(0, 5).map((category, index) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{category.category}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>({category.count} transactions)</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        ${category.amount.toFixed(2)}
                      </span>
                      <span className="ml-2" style={{ color: 'var(--text-secondary)' }}>
                        {category.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${category.percentage}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
              No spending data available
            </p>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="finora-card p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Recent Transactions</h3>
          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                      {transaction.description.length > 30 
                        ? transaction.description.substring(0, 30) + '...' 
                        : transaction.description
                      }
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {transaction.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p 
                      className={`font-semibold ${transaction.amount > 0 ? 'text-green-500' : ''}`}
                      style={{ color: transaction.amount > 0 ? 'var(--chart-revenue)' : 'var(--text-primary)' }}
                    >
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full mt-4 border-gray-600 hover:bg-gray-700"
                onClick={() => onNavigate?.('Spending')}
                style={{ 
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-secondary)'
                }}
              >
                View All
              </Button>
            </div>
          ) : (
            <p className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
              No transactions yet
            </p>
          )}
        </div>
      </div>

      {/* Upload Section */}
      <div className="finora-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Import Transactions</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Upload your bank CSV file to automatically categorize and import transactions
            </p>
          </div>
          <div>
            <input
              id="universal-csv-input"
              type="file"
              accept=".csv"
              onChange={handleUniversalCSVUpload}
              style={{ display: 'none' }}
            />
            <Button 
              className="gap-2 bg-purple-600 hover:bg-purple-700"
              onClick={triggerFileInput}
              disabled={isProcessing}
            >
              <Upload size={16} />
              {isProcessing ? 'Processing...' : 'Upload CSV File'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}