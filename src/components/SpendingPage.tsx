import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
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
  Coffee
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
  if (transactions.length === 0) {
    return (
      <div className="p-6">
        {/* Zero State Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                <h3 className="text-2xl font-semibold text-gray-900">$0.00</h3>
                <span className="text-xs text-gray-500">No expenses yet</span>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <CreditCard size={20} className="text-gray-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Budget Remaining</p>
                <h3 className="text-2xl font-semibold text-gray-900">$0.00</h3>
                <span className="text-xs text-gray-500">Set up budgets to track</span>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <ArrowDownRight size={20} className="text-gray-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Daily Average</p>
                <h3 className="text-2xl font-semibold text-gray-900">$0.00</h3>
                <span className="text-xs text-gray-500">Add transactions to see average</span>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <Calendar size={20} className="text-gray-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Largest Purchase</p>
                <h3 className="text-2xl font-semibold text-gray-900">$0.00</h3>
                <span className="text-xs text-gray-500">No purchases yet</span>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <ArrowUpRight size={20} className="text-gray-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Empty State Content */}
        <div className="text-center py-16">
          <FileText size={64} className="mx-auto text-gray-400 mb-6" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Transactions Yet</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Start by importing your transaction history from a CSV file or add transactions manually to see your spending analysis.
          </p>
          <div className="space-x-4">
            <Button className="gap-2">
              <Plus size={16} />
              Add Transaction
            </Button>
            <div className="relative">
              <Button variant="outline" className="gap-2" disabled={isImporting}>
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
    );
  }

  return (
    <div className="p-6">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Spent</p>
              <h3 className="text-2xl font-semibold text-gray-900">
                ${totalSpent.toFixed(2)}
              </h3>
              <span className="text-xs text-gray-500">
                {transactions.filter(t => t.amount < 0).length} transactions
              </span>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <CreditCard size={20} className="text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Income</p>
              <h3 className="text-2xl font-semibold text-gray-900">
                ${totalIncome.toFixed(2)}
              </h3>
              <span className="text-xs text-gray-500">
                {transactions.filter(t => t.amount > 0).length} deposits
              </span>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <ArrowDownRight size={20} className="text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Daily Average</p>
              <h3 className="text-2xl font-semibold text-gray-900">
                ${dailyAverage.toFixed(2)}
              </h3>
              <span className="text-xs text-gray-500">Based on spending</span>
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
              <h3 className="text-2xl font-semibold text-gray-900">
                ${largestPurchase.toFixed(2)}
              </h3>
              <span className="text-xs text-gray-500">Single transaction</span>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <ArrowUpRight size={20} className="text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search, Filter and View Toggle */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-4">
          {/* Search */}
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-48"
          >
            <option value="All">All Categories</option>
            {allCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-md">
            <Button
              variant={viewMode === 'simple' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('simple')}
              className="gap-1 text-xs"
            >
              <Grid3X3 size={14} />
              Simple
            </Button>
            <Button
              variant={viewMode === 'full' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('full')}
              className="gap-1 text-xs"
            >
              <List size={14} />
              Full
            </Button>
          </div>

          {/* Clear Filters */}
          {(selectedCategory !== 'All' || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="gap-2"
            >
              <X size={16} />
              Clear
            </Button>
          )}
        </div>

        {/* Simple Results Summary */}
        {(selectedCategory !== 'All' || searchQuery) && (
          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredTransactions.length} of {transactions.length} transactions
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
        )}
      </Card>

      {/* Top Categories Overview */}
      {categoryStats.length > 0 && selectedCategory === 'All' && (
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Spending Categories</h3>
          <div className="space-y-3">
            {categoryStats.slice(0, 5).map((stat, index) => (
              <div 
                key={stat.category}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => setSelectedCategory(stat.category)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium text-gray-900">{stat.category}</div>
                  <div className="text-xs text-gray-500">{stat.count} transactions</div>
                </div>
                <div className="text-lg font-semibold text-gray-900">${stat.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Transactions List */}
        <div className="col-span-2">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all">
                  {selectedCategory === 'All' ? 'All Transactions' : selectedCategory} 
                  ({filteredTransactions.length})
                </TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download size={16} />
                  Export
                </Button>
                <div className="relative">
                  <Button variant="outline" size="sm" className="gap-2" disabled={isImporting}>
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
                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    onClick={deleteAllTransactions}
                    disabled={isBulkDeleting}
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

            <TabsContent value="all" className="space-y-4">
              {filteredTransactions.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="text-gray-500">
                    <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="font-medium text-gray-900 mb-2">
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
                      >
                        <X size={16} />
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </Card>
              ) : viewMode === 'simple' ? (
                // Simple View - Grouped Cards
                <div className="grid grid-cols-3 gap-4">
                  {getGroupedTransactions().map((group, index) => {
                    const IconComponent = group.icon;
                    return (
                      <Card key={index} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <IconComponent size={20} className="text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 text-sm">{group.name}</h4>
                              <p className="text-xs text-gray-500">{group.count} transaction{group.count > 1 ? 's' : ''}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Total Amount</span>
                            <span className="font-semibold text-lg text-gray-900">
                              ${group.totalAmount.toFixed(2)}
                            </span>
                          </div>
                          
                          {group.isRecurring && (
                            <div className="flex items-center gap-1 text-xs text-green-600">
                              <Repeat size={12} />
                              <span>{group.frequency}</span>
                            </div>
                          )}
                          
                          <div className="text-xs text-gray-500 mt-2">
                            Latest: {new Date(group.transactions[0].date).toLocaleDateString()}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                // Full View - Original Transaction List
                filteredTransactions.map((transaction) => (
                <Card key={transaction.id} className="p-4">
                  {editingTransaction === transaction.id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <Input
                            name="description"
                            value={editForm.description}
                            onChange={handleEditFormChange}
                            placeholder="Transaction description"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                          <Input
                            name="amount"
                            type="number"
                            step="0.01"
                            value={editForm.amount}
                            onChange={handleEditFormChange}
                            placeholder="0.00"
                            className="text-sm"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          <Input
                            name="category"
                            value={editForm.category}
                            onChange={handleEditFormChange}
                            placeholder="Category"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                          <Input
                            name="location"
                            value={editForm.location}
                            onChange={handleEditFormChange}
                            placeholder="Location (optional)"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                          <Input
                            name="date"
                            type="date"
                            value={editForm.date}
                            onChange={handleEditFormChange}
                            className="text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                        <Input
                          name="paymentMethod"
                          value={editForm.paymentMethod}
                          onChange={handleEditFormChange}
                          placeholder="Payment method (optional)"
                          className="text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={cancelEdit}
                          disabled={isDeleting}
                          className="gap-1"
                        >
                          <X size={14} />
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={saveEdit}
                          disabled={isDeleting}
                          className="gap-1"
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
                          transaction.amount > 0 ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <CreditCard size={16} className={
                            transaction.amount > 0 ? 'text-green-600' : 'text-gray-600'
                          } />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                            {transaction.recurring && (
                              <Badge variant="outline" className="text-xs">Recurring</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
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
                            <p className="text-xs text-gray-500 mt-1">{transaction.paymentMethod}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className={`font-semibold ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">{transaction.category}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(transaction)}
                            className="h-8 w-8 p-0 hover:bg-blue-50 text-blue-600"
                            disabled={editingTransaction !== null || isDeleting}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTransaction(transaction.id)}
                            className="h-8 w-8 p-0 hover:bg-red-50 text-red-600"
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
                </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="income" className="space-y-4">
              {filteredTransactions.filter(t => t.amount > 0).map((transaction) => (
                <Card key={transaction.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-full">
                        <CreditCard size={16} className="text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
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
              {filteredTransactions.filter(t => t.amount < 0).map((transaction) => (
                <Card key={transaction.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-100 rounded-full">
                        <CreditCard size={16} className="text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{new Date(transaction.date).toLocaleDateString()}</span>
                          {transaction.location && (
                            <span>{transaction.location}</span>
                          )}
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

        {/* Category Analysis */}
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Spending by Category</h3>
            <div className="space-y-3">
              {categoryData.slice(0, 5).map((category, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{category.category}</h4>
                      <p className="text-sm text-gray-500">{category.transactions} transactions</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${category.amount.toFixed(2)}</p>
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