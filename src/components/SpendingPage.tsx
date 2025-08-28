import React, { useState, useEffect } from 'react';
import { 
  Search,
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight,
  CreditCard,
  MapPin,
  Clock,
  FileText,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  AlertCircle,
  Loader2,
  Upload,
  List,
  Grid3X3,
  Repeat,
  Building,
  Smartphone,
  Car,
  Shield,
  Coffee,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { transactionsAPI } from '../services/api';
import api from '../services/api';

export default function SpendingPage() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [editForm, setEditForm] = useState({
    description: '',
    amount: '',
    category: '',
    location: '',
    paymentMethod: '',
    date: ''
  });

  // Filter states (simplified)
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // View toggle state
  const [viewMode, setViewMode] = useState('full'); // 'full' or 'simple'

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await transactionsAPI.getAll();
        setTransactions(response.transactions || []);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Calculate real stats from user data
  const totalSpent = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const dailyAverage = transactions.length > 0 ? totalSpent / 30 : 0; // Rough daily average
  
  const largestPurchase = transactions
    .filter(t => t.amount < 0)
    .reduce((max, t) => Math.abs(t.amount) > max ? Math.abs(t.amount) : max, 0);

  // Get unique categories for filtering
  const allCategories = [...new Set(transactions.map(t => t.category || 'Others'))].sort();

  // Simple filter transactions (newest first by default)
  useEffect(() => {
    let filtered = [...transactions];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(t => (t.category || 'Others') === selectedCategory);
    }

    // Always sort by date, newest first
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredTransactions(filtered);
  }, [transactions, searchQuery, selectedCategory]);

  // Category statistics for all transactions (not filtered)
  const getCategoryStats = () => {
    const categoryData = {};
    transactions.filter(t => t.amount < 0).forEach(t => {
      const category = t.category || 'Others';
      categoryData[category] = (categoryData[category] || 0) + Math.abs(t.amount);
    });
    
    return Object.entries(categoryData)
      .map(([category, amount]) => ({
        category,
        amount: Number(amount),
        count: transactions.filter(t => (t.category || 'Others') === category && t.amount < 0).length,
        percentage: totalSpent > 0 ? ((Number(amount) / totalSpent) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  const categoryStats = getCategoryStats();

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
    }, {});

  const categoryData = Object.entries(spendingByCategory)
    .map(([category, data]) => ({
      category,
      amount: data.amount,
      transactions: data.count
    }))
    .sort((a, b) => b.amount - a.amount);

  const startEdit = (transaction) => {
    setEditingTransaction(transaction.id);
    setEditForm({
      description: transaction.description || '',
      amount: Math.abs(transaction.amount).toString(),
      category: transaction.category || '',
      location: transaction.location || '',
      paymentMethod: transaction.paymentMethod || '',
      date: new Date(transaction.date).toISOString().split('T')[0]
    });
  };

  const cancelEdit = () => {
    setEditingTransaction(null);
    setEditForm({
      description: '',
      amount: '',
      category: '',
      location: '',
      paymentMethod: '',
      date: ''
    });
  };

  const saveEdit = async () => {
    if (!editingTransaction) return;
    
    setIsDeleting(true);
    try {
      const originalTransaction = transactions.find(t => t.id === editingTransaction);
      const updatedData = {
        description: editForm.description,
        amount: originalTransaction.amount > 0 ? parseFloat(editForm.amount) : -parseFloat(editForm.amount),
        category: editForm.category,
        location: editForm.location || null,
        paymentMethod: editForm.paymentMethod || null,
        date: editForm.date,
      };

      await api.put(`/api/transactions/${editingTransaction}`, updatedData);
      
      // Refresh transactions
      const response = await transactionsAPI.getAll();
      setTransactions(response.transactions || []);
      
      cancelEdit();
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Failed to update transaction');
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteTransaction = async (transactionId) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/api/transactions/${transactionId}`);
      
      // Refresh transactions
      const response = await transactionsAPI.getAll();
      setTransactions(response.transactions || []);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction');
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteAllTransactions = async () => {
    if (!confirm('Are you sure you want to delete ALL transactions? This action cannot be undone.')) return;
    
    setIsBulkDeleting(true);
    try {
      // Delete all transactions one by one or create a bulk delete endpoint
      await api.delete('/api/transactions/bulk');
      
      // Clear transactions locally
      setTransactions([]);
    } catch (error) {
      console.error('Error deleting all transactions:', error);
      alert('Failed to delete all transactions');
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleCSVImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }

    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append('csvFile', file);

      const response = await api.post('/api/csv-import/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        alert(`Successfully imported ${response.data.imported} transactions!`);
        
        // Refresh transactions
        const transactionResponse = await transactionsAPI.getAll();
        setTransactions(transactionResponse.transactions || []);
      } else {
        alert('Failed to import CSV file');
      }
    } catch (error) {
      console.error('Error importing CSV:', error);
      alert('Failed to import CSV file. Please check the file format.');
    } finally {
      setIsImporting(false);
      // Reset the file input
      event.target.value = '';
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // Company icon mapping
  const getCompanyIcon = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('windscribe')) return Building;
    if (desc.includes('apple') || desc.includes('icloud')) return Smartphone;
    if (desc.includes('progressive') || desc.includes('car insurance')) return Car;
    if (desc.includes('lemonade') || desc.includes('insurance')) return Shield;
    if (desc.includes('netflix') || desc.includes('spotify')) return FileText;
    if (desc.includes('coffee') || desc.includes('starbucks')) return Coffee;
    if (desc.includes('venmo') || desc.includes('zelle')) return CreditCard;
    return Building; // Default icon
  };

  // Group transactions for simple view
  const getGroupedTransactions = () => {
    const groups = {};
    
    filteredTransactions.forEach(transaction => {
      // Group by company/service name
      const desc = transaction.description.toLowerCase();
      let groupKey = 'Other';
      
      // Identify recurring services
      if (desc.includes('windscribe')) groupKey = 'Windscribe';
      else if (desc.includes('apple') || desc.includes('icloud')) groupKey = 'Apple';
      else if (desc.includes('progressive')) groupKey = 'Progressive Insurance';
      else if (desc.includes('lemonade')) groupKey = 'Lemonade Insurance';
      else if (desc.includes('netflix')) groupKey = 'Netflix';
      else if (desc.includes('spotify')) groupKey = 'Spotify';
      else if (desc.includes('amazon')) groupKey = 'Amazon';
      else if (desc.includes('venmo payment')) groupKey = 'Venmo Payments';
      else if (desc.includes('zelle')) groupKey = 'Zelle Transfers';
      else if (desc.includes('wells fargo card')) groupKey = 'Credit Card Payments';
      else if (desc.includes('online pymt')) groupKey = 'Online Bill Payments';
      else if (desc.includes('bilt')) groupKey = 'Rent (Bilt)';
      else if (desc.includes('atm')) groupKey = 'ATM Withdrawals';
      else {
        // For other transactions, group by category
        groupKey = transaction.category || 'Others';
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = {
          name: groupKey,
          transactions: [],
          totalAmount: 0,
          count: 0,
          isRecurring: false,
          frequency: null,
          icon: getCompanyIcon(transaction.description)
        };
      }
      
      groups[groupKey].transactions.push(transaction);
      groups[groupKey].totalAmount += Math.abs(transaction.amount);
      groups[groupKey].count++;
      
      // Detect recurring payments (if more than 2 similar transactions)
      if (groups[groupKey].count >= 2) {
        groups[groupKey].isRecurring = true;
        groups[groupKey].frequency = 'Monthly'; // Simplified - could be enhanced
      }
    });
    
    return Object.values(groups).sort((a, b) => b.totalAmount - a.totalAmount);
  };

  if (isLoading) {
    return (
      <div className="finora-spending-page" style={{ background: 'var(--background-primary)', color: 'var(--text-primary)' }}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p style={{ color: 'var(--text-secondary)' }}>Loading transactions...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (transactions.length === 0) {
    return (
      <div className="finora-spending-page" style={{ background: 'var(--background-primary)', minHeight: '100vh' }}>
        {/* Header with Search and Controls */}
        <div className="sticky top-0 finora-card border-0 border-b rounded-none px-6 py-4" style={{ 
          borderColor: 'var(--border-primary)', 
          background: 'var(--background-card)'
        }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                Transactions
              </h2>
              <div className="relative flex-1 max-w-md ml-8">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} size={16} />
                <Input
                  placeholder="Search transactions..."
                  className="pl-10 border-gray-600 focus:ring-purple-500"
                  style={{ 
                    background: 'var(--background-primary)', 
                    color: 'var(--text-primary)',
                    borderColor: 'var(--border-primary)'
                  }}
                />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-gray-600 hover:bg-gray-700"
                style={{ 
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-secondary)',
                  background: 'transparent'
                }}
              >
                <Filter size={16} />
                All Categories
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 p-1 rounded-md" style={{ background: 'var(--background-primary)' }}>
                <Button
                  variant={viewMode === 'simple' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('simple')}
                  className="gap-1 text-xs"
                  style={{ 
                    background: viewMode === 'simple' ? 'var(--sidebar-primary)' : 'transparent',
                    color: viewMode === 'simple' ? 'white' : 'var(--text-secondary)'
                  }}
                >
                  <Grid3X3 size={14} />
                  Simple
                </Button>
                <Button
                  variant={viewMode === 'full' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('full')}
                  className="gap-1 text-xs"
                  style={{ 
                    background: viewMode === 'full' ? 'var(--sidebar-primary)' : 'transparent',
                    color: viewMode === 'full' ? 'white' : 'var(--text-secondary)'
                  }}
                >
                  <List size={14} />
                  Full
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                style={{ 
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-secondary)',
                  background: 'transparent'
                }}
              >
                <Download size={16} />
                Export
              </Button>
              <div className="relative">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2" 
                  disabled={isImporting}
                  style={{ 
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-secondary)',
                    background: 'transparent'
                  }}
                >
                  {isImporting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Upload size={16} />
                  )}
                  {isImporting ? 'Importing...' : 'Import CSV'}
                </Button>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVImport}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  disabled={isImporting}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Zero State Stats */}
          <div className="grid grid-cols-4 gap-6 mb-12">
            <div className="finora-card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Spent</p>
                  <h3 className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>$0.00</h3>
                </div>
                <div className="p-2 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                  <ArrowDownRight size={20} className="text-red-400" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <TrendingDown size={14} className="text-red-400" />
                <span>No expenses yet</span>
              </div>
            </div>

            <div className="finora-card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Income</p>
                  <h3 className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>$0.00</h3>
                </div>
                <div className="p-2 rounded-lg" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                  <ArrowUpRight size={20} className="text-green-400" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <TrendingUp size={14} className="text-green-400" />
                <span>No income yet</span>
              </div>
            </div>

            <div className="finora-card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Daily Average</p>
                  <h3 className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>$0.00</h3>
                </div>
                <div className="p-2 rounded-lg" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                  <Clock size={20} className="text-blue-400" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span>Add transactions to see average</span>
              </div>
            </div>

            <div className="finora-card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Largest Purchase</p>
                  <h3 className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>$0.00</h3>
                </div>
                <div className="p-2 rounded-lg" style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
                  <CreditCard size={20} className="text-purple-400" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span>No purchases yet</span>
              </div>
            </div>
          </div>

          {/* Empty State Content */}
          <div className="text-center py-16">
            <FileText size={64} className="mx-auto text-gray-400 mb-6" />
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              No Transactions Yet
            </h2>
            <p className="mb-8 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Start by importing your transaction history from a CSV file or add transactions manually to see your spending analysis.
            </p>
            <div className="space-x-4">
              <Button 
                className="gap-2 bg-purple-600 hover:bg-purple-700"
                style={{ background: 'var(--sidebar-primary)' }}
              >
                <Plus size={16} />
                Add Transaction
              </Button>
              <div className="relative inline-block">
                <Button 
                  variant="outline" 
                  className="gap-2" 
                  disabled={isImporting}
                  style={{ 
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-secondary)',
                    background: 'transparent'
                  }}
                >
                  {isImporting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Upload size={16} />
                  )}
                  {isImporting ? 'Importing...' : 'Import CSV File'}
                </Button>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVImport}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  disabled={isImporting}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="finora-spending-page" style={{ background: 'var(--background-primary)', minHeight: '100vh' }}>
      {/* Header with Search and Controls */}
      <div className="sticky top-0 finora-card border-0 border-b rounded-none px-6 py-4" style={{ 
        borderColor: 'var(--border-primary)', 
        background: 'var(--background-card)'
      }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Transactions
            </h2>
            <div className="relative flex-1 max-w-md ml-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} size={16} />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-600 focus:ring-purple-500"
                style={{ 
                  background: 'var(--background-primary)', 
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-primary)'
                }}
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-48"
              style={{ 
                background: 'var(--background-primary)', 
                color: 'var(--text-primary)',
                borderColor: 'var(--border-primary)'
              }}
            >
              <option value="All">All Categories</option>
              {allCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 p-1 rounded-md" style={{ background: 'var(--background-primary)' }}>
              <Button
                variant={viewMode === 'simple' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('simple')}
                className="gap-1 text-xs"
                style={{ 
                  background: viewMode === 'simple' ? 'var(--sidebar-primary)' : 'transparent',
                  color: viewMode === 'simple' ? 'white' : 'var(--text-secondary)'
                }}
              >
                <Grid3X3 size={14} />
                Simple
              </Button>
              <Button
                variant={viewMode === 'full' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('full')}
                className="gap-1 text-xs"
                style={{ 
                  background: viewMode === 'full' ? 'var(--sidebar-primary)' : 'transparent',
                  color: viewMode === 'full' ? 'white' : 'var(--text-secondary)'
                }}
              >
                <List size={14} />
                Full
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              style={{ 
                borderColor: 'var(--border-primary)',
                color: 'var(--text-secondary)',
                background: 'transparent'
              }}
            >
              <Download size={16} />
              Export
            </Button>
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2" 
                disabled={isImporting}
                style={{ 
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-secondary)',
                  background: 'transparent'
                }}
              >
                {isImporting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Upload size={16} />
                )}
                {isImporting ? 'Importing...' : 'Import CSV'}
              </Button>
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                disabled={isImporting}
              />
            </div>
            {transactions.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                onClick={deleteAllTransactions}
                disabled={isBulkDeleting}
                style={{ 
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                  background: 'transparent'
                }}
              >
                {isBulkDeleting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                {isBulkDeleting ? 'Deleting...' : 'Delete All'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Header Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="finora-card p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Spent</p>
                <h3 className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                  ${totalSpent.toFixed(2)}
                </h3>
              </div>
              <div className="p-2 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                <ArrowDownRight size={20} className="text-red-400" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <TrendingDown size={14} className="text-red-400" />
              <span>{transactions.filter(t => t.amount < 0).length} transactions</span>
            </div>
          </div>

          <div className="finora-card p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Income</p>
                <h3 className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                  ${totalIncome.toFixed(2)}
                </h3>
              </div>
              <div className="p-2 rounded-lg" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                <ArrowUpRight size={20} className="text-green-400" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <TrendingUp size={14} className="text-green-400" />
              <span>{transactions.filter(t => t.amount > 0).length} deposits</span>
            </div>
          </div>

          <div className="finora-card p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Daily Average</p>
                <h3 className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                  ${dailyAverage.toFixed(2)}
                </h3>
              </div>
              <div className="p-2 rounded-lg" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                <Clock size={20} className="text-blue-400" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span>Based on spending</span>
            </div>
          </div>

          <div className="finora-card p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Largest Purchase</p>
                <h3 className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                  ${largestPurchase.toFixed(2)}
                </h3>
              </div>
              <div className="p-2 rounded-lg" style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
                <CreditCard size={20} className="text-purple-400" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span>Single transaction</span>
            </div>
          </div>
        </div>

        {/* Top Categories Overview */}
        {categoryStats.length > 0 && selectedCategory === 'All' && (
          <div className="finora-card p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Top Spending Categories
            </h3>
            <div className="space-y-3">
              {categoryStats.slice(0, 5).map((stat, index) => (
                <div 
                  key={stat.category}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-colors"
                  style={{ background: 'rgba(107, 114, 128, 0.1)' }}
                  onClick={() => setSelectedCategory(stat.category)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {stat.category}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {stat.count} transactions
                    </div>
                  </div>
                  <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    ${stat.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clear Filters */}
        {(selectedCategory !== 'All' || searchQuery) && (
          <div className="finora-card p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Showing {filteredTransactions.length} of {transactions.length} transactions
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                {searchQuery && ` matching "${searchQuery}"`}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="gap-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                <X size={16} />
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6">
          {/* Transactions List */}
          <div className="col-span-2">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6" style={{ background: 'var(--background-card)' }}>
                <TabsTrigger 
                  value="all"
                  style={{ 
                    color: 'var(--text-secondary)',
                    data: { state: 'active' }
                  }}
                >
                  {selectedCategory === 'All' ? 'All Transactions' : selectedCategory} 
                  ({filteredTransactions.length})
                </TabsTrigger>
                <TabsTrigger value="income" style={{ color: 'var(--text-secondary)' }}>Income</TabsTrigger>
                <TabsTrigger value="expenses" style={{ color: 'var(--text-secondary)' }}>Expenses</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {filteredTransactions.length === 0 ? (
                  <div className="finora-card p-8 text-center">
                    <div style={{ color: 'var(--text-secondary)' }}>
                      <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                        {selectedCategory !== 'All' || searchQuery 
                          ? 'No transactions match your filters' 
                          : 'No transactions found'
                        }
                      </h3>
                      <p className="text-sm mb-4">
                        {selectedCategory !== 'All' || searchQuery 
                          ? 'Try adjusting your search or category filter'
                          : 'Import your transaction history to get started'
                        }
                      </p>
                      {(selectedCategory !== 'All' || searchQuery) && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedCategory('All');
                            setSearchQuery('');
                          }}
                          className="gap-2"
                          style={{ 
                            borderColor: 'var(--border-primary)',
                            color: 'var(--text-secondary)',
                            background: 'transparent'
                          }}
                        >
                          <X size={16} />
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </div>
                ) : viewMode === 'simple' ? (
                  // Simple View - Grouped Cards
                  <div className="grid grid-cols-3 gap-4">
                    {getGroupedTransactions().map((group, index) => {
                      const IconComponent = group.icon;
                      return (
                        <div key={index} className="finora-card p-4 hover:bg-gray-700/30 transition-all cursor-pointer">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg" style={{ background: 'rgba(59, 130, 246, 0.2)' }}>
                                <IconComponent size={20} className="text-blue-400" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                                  {group.name}
                                </h4>
                                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                  {group.count} transaction{group.count > 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Amount</span>
                              <span className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                                ${group.totalAmount.toFixed(2)}
                              </span>
                            </div>
                            
                            {group.isRecurring && (
                              <div className="flex items-center gap-1 text-xs text-green-400">
                                <Repeat size={12} />
                                <span>{group.frequency}</span>
                              </div>
                            )}
                            
                            <div className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                              Latest: {new Date(group.transactions[0].date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // Full View - Original Transaction List
                  filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="finora-card p-4">
                    {editingTransaction === transaction.id ? (
                      // Edit Mode
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                              Description
                            </label>
                            <Input
                              name="description"
                              value={editForm.description}
                              onChange={handleEditFormChange}
                              placeholder="Transaction description"
                              className="text-sm"
                              style={{ 
                                background: 'var(--background-primary)', 
                                color: 'var(--text-primary)',
                                borderColor: 'var(--border-primary)'
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                              Amount
                            </label>
                            <Input
                              name="amount"
                              type="number"
                              step="0.01"
                              value={editForm.amount}
                              onChange={handleEditFormChange}
                              placeholder="0.00"
                              className="text-sm"
                              style={{ 
                                background: 'var(--background-primary)', 
                                color: 'var(--text-primary)',
                                borderColor: 'var(--border-primary)'
                              }}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                              Category
                            </label>
                            <Input
                              name="category"
                              value={editForm.category}
                              onChange={handleEditFormChange}
                              placeholder="Category"
                              className="text-sm"
                              style={{ 
                                background: 'var(--background-primary)', 
                                color: 'var(--text-primary)',
                                borderColor: 'var(--border-primary)'
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                              Location
                            </label>
                            <Input
                              name="location"
                              value={editForm.location}
                              onChange={handleEditFormChange}
                              placeholder="Location (optional)"
                              className="text-sm"
                              style={{ 
                                background: 'var(--background-primary)', 
                                color: 'var(--text-primary)',
                                borderColor: 'var(--border-primary)'
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                              Date
                            </label>
                            <Input
                              name="date"
                              type="date"
                              value={editForm.date}
                              onChange={handleEditFormChange}
                              className="text-sm"
                              style={{ 
                                background: 'var(--background-primary)', 
                                color: 'var(--text-primary)',
                                borderColor: 'var(--border-primary)'
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                            Payment Method
                          </label>
                          <Input
                            name="paymentMethod"
                            value={editForm.paymentMethod}
                            onChange={handleEditFormChange}
                            placeholder="Payment method (optional)"
                            className="text-sm"
                            style={{ 
                              background: 'var(--background-primary)', 
                              color: 'var(--text-primary)',
                              borderColor: 'var(--border-primary)'
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={cancelEdit}
                            disabled={isDeleting}
                            className="gap-1"
                            style={{ 
                              borderColor: 'var(--border-primary)',
                              color: 'var(--text-secondary)',
                              background: 'transparent'
                            }}
                          >
                            <X size={14} />
                            Cancel
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={saveEdit}
                            disabled={isDeleting}
                            className="gap-1"
                            style={{ background: 'var(--sidebar-primary)' }}
                          >
                            {isDeleting ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Save size={14} />
                            )}
                            {isDeleting ? 'Saving...' : 'Save'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`p-3 rounded-full ${
                            transaction.amount > 0 ? 'bg-green-500/20' : 'bg-gray-500/20'
                          }`}>
                            <CreditCard size={16} className={
                              transaction.amount > 0 ? 'text-green-400' : 'text-gray-400'
                            } />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                {transaction.description}
                              </h4>
                              {transaction.recurring && (
                                <Badge variant="outline" className="text-xs" style={{ 
                                  borderColor: 'var(--border-primary)', 
                                  color: 'var(--text-secondary)' 
                                }}>
                                  Recurring
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                              <div className="flex items-center gap-1">
                                <Clock size={12} />
                                <span>{new Date(transaction.date).toLocaleDateString()}</span>
                              </div>
                              {transaction.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin size={12} />
                                  <span>{transaction.location}</span>
                                </div>
                              )}
                            </div>
                            {transaction.paymentMethod && (
                              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                                {transaction.paymentMethod}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className={`font-semibold ${
                              transaction.amount > 0 ? 'text-green-400' : ''
                            }`} style={{ color: transaction.amount > 0 ? undefined : 'var(--text-primary)' }}>
                              {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                            </p>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {transaction.category}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEdit(transaction)}
                              className="h-8 w-8 p-0 hover:bg-blue-500/20 text-blue-400"
                              disabled={editingTransaction !== null || isDeleting}
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTransaction(transaction.id)}
                              className="h-8 w-8 p-0 hover:bg-red-500/20 text-red-400"
                              disabled={editingTransaction !== null || isDeleting}
                            >
                              {isDeleting ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="income" className="space-y-4">
                {filteredTransactions.filter(t => t.amount > 0).map((transaction) => (
                  <div key={transaction.id} className="finora-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/20 rounded-full">
                          <CreditCard size={16} className="text-green-400" />
                        </div>
                        <div>
                          <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            {transaction.description}
                          </h4>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-400">
                          +${transaction.amount.toFixed(2)}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {transaction.category}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="expenses" className="space-y-4">
                {filteredTransactions.filter(t => t.amount < 0).map((transaction) => (
                  <div key={transaction.id} className="finora-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-500/20 rounded-full">
                          <CreditCard size={16} className="text-gray-400" />
                        </div>
                        <div>
                          <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            {transaction.description}
                          </h4>
                          <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            <span>{new Date(transaction.date).toLocaleDateString()}</span>
                            {transaction.location && (
                              <span>{transaction.location}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                          ${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {transaction.category}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Category Analysis */}
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
                Spending by Category
              </h3>
              <div className="space-y-3">
                {categoryData.slice(0, 5).map((category, index) => (
                  <div key={index} className="finora-card p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                          {category.category}
                        </h4>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {category.transactions} transactions
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                          ${category.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}