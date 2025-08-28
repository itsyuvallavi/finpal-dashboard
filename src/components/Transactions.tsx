import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { 
  Search, 
  Filter, 
  Plus, 
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Upload,
  Download,
  Edit,
  Trash2,
  RefreshCw,
  FileText
} from "lucide-react";
import { transactionsAPI, Transaction } from '../services/api';
import api from '../services/api';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(Math.abs(amount));
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await transactionsAPI.getAll();
        const sortedTransactions = (response.transactions || []).sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setTransactions(sortedTransactions);
        setFilteredTransactions(sortedTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  // Filter and sort transactions
  useEffect(() => {
    let filtered = [...transactions];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    // Type filter
    if (typeFilter !== 'all') {
      if (typeFilter === 'income') {
        filtered = filtered.filter(t => t.amount > 0);
      } else if (typeFilter === 'expense') {
        filtered = filtered.filter(t => t.amount < 0);
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      if (sortField === 'date') {
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
      } else {
        aValue = a.amount;
        bValue = b.amount;
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setFilteredTransactions(filtered);
  }, [transactions, searchQuery, categoryFilter, typeFilter, sortField, sortOrder]);

  // Get unique categories from transactions
  const categories = [...new Set(transactions.map(t => t.category))];

  const handleUniversalCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }

    setIsProcessing(true);
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());

      if (lines.length === 0) {
        alert('CSV file is empty');
        return;
      }

      // Try to detect format and convert if needed
      let csvContent: string;
      const firstLine = lines[0].toLowerCase();
      const firstLineColumns = lines[0].split(',');
      
      if (firstLineColumns.length === 5 && !firstLine.includes('date') && !firstLine.includes('description')) {
        console.log('Detected Wells Fargo format, converting...');
        csvContent = convertWellsFargoCSV(lines);
      } else {
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
        // Refresh transactions
        const transactionResponse = await transactionsAPI.getAll();
        const sortedTransactions = (transactionResponse.transactions || []).sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setTransactions(sortedTransactions);
      } else {
        alert('Failed to import CSV file');
      }
    } catch (error: any) {
      console.error('Error processing CSV:', error);
      alert('Failed to process CSV: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsProcessing(false);
      event.target.value = '';
    }
  };

  const convertWellsFargoCSV = (lines: string[]): string => {
    const convertedLines = ['Date,Description,Amount,Category,Location,Payment Method'];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      try {
        const columns = line.split('","');
        if (columns.length !== 5) continue;

        const date = columns[0].replace(/^"|"$/g, '');
        const amount = columns[1].replace(/^"|"$/g, '');
        const description = columns[4].replace(/^"|"$/g, '');

        if (!date || !amount || !description) continue;

        const category = categorizeTransaction(description, parseFloat(amount));
        const location = extractLocation(description);
        const paymentMethod = getPaymentMethod(description);

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

  const categorizeTransaction = (description: string, amount: number): string => {
    const desc = description.toLowerCase();
    
    if (amount > 0) return 'Income';
    
    if (desc.includes('wells fargo card') || desc.includes('applecard') || desc.includes('credit card')) {
      return 'Credit Card Payments';
    }
    if (desc.includes('rent') || desc.includes('bilt')) return 'Rent & Housing';
    if (desc.includes('venmo') || desc.includes('transfer')) return 'Money Transfers';
    if (desc.includes('spotify') || desc.includes('netflix') || desc.includes('subscription')) return 'Subscriptions';
    if (desc.includes('amazon') || desc.includes('purchase')) return 'Shopping';
    if (desc.includes('atm')) return 'ATM & Cash';
    
    return 'Others';
  };

  const extractLocation = (description: string): string => {
    const desc = description.toLowerCase();
    if (desc.includes(' ca ')) {
      const match = description.match(/\s([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\s+CA\s/i);
      if (match) return match[1];
    }
    return '';
  };

  const getPaymentMethod = (description: string): string => {
    const desc = description.toLowerCase();
    if (desc.includes('card') || desc.includes('purchase authorized')) return 'Credit Card';
    if (desc.includes('atm')) return 'ATM';
    if (desc.includes('venmo')) return 'Venmo';
    if (desc.includes('direct deposit')) return 'Direct Deposit';
    return 'Bank Transfer';
  };

  const triggerFileInput = () => {
    document.getElementById('csv-upload-input')?.click();
  };

  const exportTransactions = () => {
    const csv = [
      ['Date', 'Description', 'Amount', 'Category'],
      ...filteredTransactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        t.description,
        t.amount.toString(),
        t.category
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSort = (field: 'date' | 'amount') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const totalIncome = filteredTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = Math.abs(filteredTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0));

  const netBalance = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Transactions</h1>
          <p className="text-muted-foreground">Track all your financial activity</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportTransactions}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={triggerFileInput} disabled={isProcessing}>
            <Upload className="h-4 w-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Import CSV'}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="e.g. Grocery shopping" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" type="number" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea id="notes" placeholder="Add any additional notes..." />
                </div>
                <Button className="w-full">Add Transaction</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 md:grid-cols-3"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="text-2xl font-semibold text-green-500">
                  {formatCurrency(totalIncome)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-semibold text-red-500">
                  {formatCurrency(totalExpenses)}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Balance</p>
                <p className={`text-2xl font-semibold ${
                  netBalance >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatCurrency(netBalance)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction History ({filteredTransactions.length})</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search transactions..." 
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">
                    <Button 
                      variant="ghost" 
                      className="h-auto p-0 font-medium"
                      onClick={() => handleSort('date')}
                    >
                      Date
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">
                    <Button 
                      variant="ghost" 
                      className="h-auto p-0 font-medium"
                      onClick={() => handleSort('amount')}
                    >
                      Amount
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction, index) => (
                  <TableRow key={transaction.id} className="group hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="flex items-center gap-2"
                      >
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {formatDate(transaction.date)}
                      </motion.div>
                    </TableCell>
                    <TableCell>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="max-w-xs"
                      >
                        <div className="font-medium truncate" title={transaction.description}>
                          {transaction.description}
                        </div>
                      </motion.div>
                    </TableCell>
                    <TableCell>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                      >
                        <Badge variant="secondary">{transaction.category}</Badge>
                      </motion.div>
                    </TableCell>
                    <TableCell className="text-right">
                      <motion.span 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className={`font-medium ${
                          transaction.amount > 0 ? 'text-green-500' : 'text-foreground'
                        }`}
                      >
                        {transaction.amount > 0 ? '+' : ''}
                        {formatCurrency(transaction.amount)}
                      </motion.span>
                    </TableCell>
                    <TableCell className="text-right">
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="flex items-center justify-end gap-2"
                      >
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </motion.div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No transactions found</p>
              <Button className="gap-2" onClick={triggerFileInput} disabled={isProcessing}>
                <Upload className="h-4 w-4" />
                {isProcessing ? 'Processing...' : 'Import Your First Transactions'}
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions match your filters</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setTypeFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        id="csv-upload-input"
        type="file"
        accept=".csv"
        onChange={handleUniversalCSVUpload}
        style={{ display: 'none' }}
      />
    </div>
  );
}