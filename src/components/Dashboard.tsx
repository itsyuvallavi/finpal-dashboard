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
  RefreshCw
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { transactionsAPI, goalsAPI } from '../services/api';
import api from '../services/api';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import GoalCreationModal from './GoalCreationModal';

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  const fetchData = async () => {
    try {
      const [transactionsRes, goalsRes] = await Promise.all([
        transactionsAPI.getAll(),
        goalsAPI.getAll()
      ]);
      setTransactions(transactionsRes.transactions || []);
      setGoals(goalsRes.goals || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      // Step 1: Read and analyze the CSV
      const text = await file.text();
      const lines = text.trim().split('\n');
      
      if (lines.length === 0) {
        throw new Error('CSV file is empty');
      }

      // Step 2: Detect format and convert
      const firstLine = lines[0];
      let convertedCSV = '';
      
      // Check if it's Wells Fargo format (5 columns with quotes)
      const isWellsFargoFormat = firstLine.startsWith('"') && firstLine.split('","').length === 5;
      
      if (isWellsFargoFormat) {
        console.log('Detected Wells Fargo format - converting...');
        convertedCSV = convertWellsFargoCSV(lines);
      } else {
        // Check if it has standard headers
        const hasStandardHeaders = firstLine.toLowerCase().includes('date') && 
                                 firstLine.toLowerCase().includes('description') && 
                                 firstLine.toLowerCase().includes('amount');
        
        if (hasStandardHeaders) {
          console.log('Detected standard CSV format - using as-is...');
          convertedCSV = text; // Use as-is
        } else {
          throw new Error('Unsupported CSV format. Please use Wells Fargo format or standard format with Date, Description, Amount headers.');
        }
      }

      // Step 3: Create blob and upload directly
      const blob = new Blob([convertedCSV], { type: 'text/csv' });
      const convertedFile = new File([blob], `converted-${file.name}`, { type: 'text/csv' });

      // Step 4: Upload the converted file
      const formData = new FormData();
      formData.append('csvFile', convertedFile);

      const response = await api.post('/api/csv/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Step 5: Success!
      alert(`🎉 Success! Processed and imported ${response.data.imported} transactions`);
      fetchData(); // Refresh data
      
    } catch (error: any) {
      console.error('CSV processing error:', error);
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
          category,
          location ? `"${location}"` : '',
          paymentMethod
        ].join(',');

        convertedLines.push(convertedLine);

      } catch (error) {
        console.warn(`Skipping line ${i + 1}: ${error}`);
      }
    }

    return convertedLines.join('\n');
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

    // Spending by category
    const categoryData = {};
    const expenses = transactions.filter(t => t.amount < 0);
    
    expenses.forEach(t => {
      const category = t.category || 'Other';
      categoryData[category] = (categoryData[category] || 0) + Math.abs(t.amount);
    });
    
    const spendingByCategory = Object.entries(categoryData)
      .map(([category, amount]) => ({
        name: category,
        value: Number(amount),
        percentage: totalExpenses > 0 ? ((Number(amount) / totalExpenses) * 100).toFixed(1) : '0'
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Top 6 categories

    // Category stats for simple display
    const categoryStats = Object.entries(categoryData)
      .map(([category, amount]) => ({
        category,
        amount: Number(amount),
        count: expenses.filter(t => (t.category || 'Other') === category).length,
        percentage: totalExpenses > 0 ? ((Number(amount) / totalExpenses) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    // Simple monthly data (last 3 months for clarity)
    const monthlyData = {};
    const now = new Date();
    
    // Initialize last 3 months
    for (let i = 2; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      monthlyData[monthKey] = {
        month: monthName,
        income: 0,
        expenses: 0,
        net: 0
      };
    }

    // Fill with actual data
    transactions.forEach(t => {
      const transactionDate = new Date(t.date);
      const monthKey = transactionDate.toISOString().slice(0, 7);
      
      if (monthlyData[monthKey]) {
        if (t.amount > 0) {
          monthlyData[monthKey].income += t.amount;
        } else {
          monthlyData[monthKey].expenses += Math.abs(t.amount);
        }
        monthlyData[monthKey].net = monthlyData[monthKey].income - monthlyData[monthKey].expenses;
      }
    });

    const monthlyTrend = Object.values(monthlyData);

    return { spendingByCategory, monthlyTrend, categoryStats };
  };

  const { spendingByCategory, monthlyTrend, categoryStats } = processChartData();

  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show empty state if no data
  const isEmpty = transactions.length === 0 && goals.length === 0;

  if (isEmpty) {
    return (
      <div className="p-6">
        {/* Zero State Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Net Worth</p>
                <h3 className="text-2xl font-semibold text-gray-900">$0.00</h3>
                <span className="text-xs text-gray-500">Start tracking to see progress</span>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <TrendingUp size={20} className="text-gray-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Spending</p>
                <h3 className="text-2xl font-semibold text-gray-900">$0.00</h3>
                <span className="text-xs text-gray-500">No transactions yet</span>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <CreditCard size={20} className="text-gray-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Savings Rate</p>
                <h3 className="text-2xl font-semibold text-gray-900">0%</h3>
                <span className="text-xs text-gray-500">Add income to calculate</span>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <PiggyBank size={20} className="text-gray-400" />
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
                <DollarSign size={20} className="text-gray-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Getting Started Section */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Transactions Yet</h3>
              <p className="text-gray-600 mb-6">
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
                  <Upload size={16} />
                  {isProcessing ? 'Processing...' : 'Upload CSV File'}
                </Button>
              </div>
            </div>
          </div>

          <div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Get Started</h3>
                <div className="space-y-3">
                  <Card className="p-4 border-dashed border-gray-300">
                    <div className="flex items-center gap-3">
                      <Upload size={20} className="text-blue-500" />
                      <div>
                        <h4 className="font-medium text-gray-900">Upload Any CSV</h4>
                        <p className="text-sm text-gray-600">Automatically converts and imports your bank data</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4 border-dashed border-gray-300">
                    <div className="flex items-center gap-3">
                      <DollarSign size={20} className="text-green-500" />
                      <div>
                        <h4 className="font-medium text-gray-900">Set Financial Goals</h4>
                        <p className="text-sm text-gray-600">Track progress toward your targets</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4 border-dashed border-gray-300">
                    <div className="flex items-center gap-3">
                      <Lightbulb size={20} className="text-yellow-500" />
                      <div>
                        <h4 className="font-medium text-gray-900">Get AI Insights</h4>
                        <p className="text-sm text-gray-600">Discover spending patterns</p>
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
    <div className="p-6">
      {/* Real Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Net Worth</p>
              <h3 className="text-2xl font-semibold text-gray-900">
                ${netWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
              <span className="text-xs text-gray-500">Based on transactions</span>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp size={20} className="text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Spending</p>
              <h3 className="text-2xl font-semibold text-gray-900">
                ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
              <span className="text-xs text-gray-500">{transactions.filter(t => t.amount < 0).length} transactions</span>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <CreditCard size={20} className="text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Savings Rate</p>
              <h3 className="text-2xl font-semibold text-gray-900">
                {savingsRate.toFixed(1)}%
              </h3>
              <span className="text-xs text-gray-500">
                {savingsRate > 0 ? 'You save ' : 'Track income to calculate'}
                {savingsRate > 0 && `$${(totalIncome - totalExpenses).toLocaleString()} monthly`}
              </span>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <PiggyBank size={20} className="text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Goals Progress</p>
              <h3 className="text-2xl font-semibold text-gray-900">
                ${totalGoalsCurrent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
              <span className="text-xs text-gray-500">
                of ${totalGoalsTarget.toLocaleString('en-US', { minimumFractionDigits: 2 })} target
              </span>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign size={20} className="text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Spending by Category */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Spending by Category</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Top categories</span>
              {transactions.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={recategorizeTransactions}
                  disabled={isProcessing}
                  className="gap-2 text-xs"
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
                      <span className="font-medium text-gray-900">{category.category}</span>
                      <span className="text-gray-500">({category.count} transactions)</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900">
                        ${category.amount.toFixed(2)}
                      </span>
                      <span className="text-gray-500 ml-2">
                        {category.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
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
            <div className="flex items-center justify-center py-12 text-gray-500">
              <div className="text-center">
                <TrendingUp size={48} className="mx-auto text-gray-300 mb-2" />
                <p>No spending data yet</p>
              </div>
            </div>
          )}
        </Card>

        {/* Monthly Trend - Simple Bars */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Overview</h3>
            <span className="text-sm text-gray-500">Last 3 months</span>
          </div>
          {monthlyTrend.length > 0 && transactions.length > 0 ? (
            <div className="space-y-4">
              {monthlyTrend.map((month, index) => (
                <div key={month.month} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900">{month.month}</span>
                    <div className="text-right">
                      <div className="text-green-600 font-semibold">
                        +${month.income.toFixed(0)}
                      </div>
                      <div className="text-red-600 font-semibold">
                        -${month.expenses.toFixed(0)}
                      </div>
                      <div className={`text-xs ${month.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Net: ${month.net.toFixed(0)}
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((month.income / Math.max(month.income, month.expenses)) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
                      <div 
                        className="bg-red-500 h-3 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((month.expenses / Math.max(month.income, month.expenses)) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-gray-500">
              <div className="text-center">
                <BarChart size={48} className="mx-auto text-gray-300 mb-2" />
                <p>No trend data yet</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onNavigate?.('Spending')}
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
              <Card key={transaction.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      transaction.amount > 0 ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <CreditCard size={16} className={`${
                        transaction.amount > 0 ? 'text-green-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Active Goals</h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowGoalModal(true)}
                className="gap-2"
              >
                <Plus size={16} />
                Add Goal
              </Button>
              {goals.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onNavigate?.('Goals')}
                >
                  View All
                </Button>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            {goals.length > 0 ? (
              goals.slice(0, 3).map((goal) => (
                <Card key={goal.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{goal.title}</h4>
                      <span className="text-sm text-gray-600">
                        {Math.round((goal.currentAmount / goal.targetAmount) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>${goal.currentAmount.toLocaleString()}</span>
                      <span>${goal.targetAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center border-dashed">
                <div className="text-gray-500">
                  <DollarSign size={48} className="mx-auto text-gray-300 mb-4" />
                  <h4 className="font-medium text-gray-900 mb-2">No Goals Yet</h4>
                  <p className="text-sm mb-4">Set your first financial goal to start tracking progress</p>
                  <Button 
                    variant="outline"
                    onClick={() => setShowGoalModal(true)}
                    className="gap-2"
                  >
                    <Plus size={16} />
                    Create Your First Goal
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Goal Creation Modal */}
      <GoalCreationModal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        onSuccess={fetchData}
      />

    </div>
  );
}