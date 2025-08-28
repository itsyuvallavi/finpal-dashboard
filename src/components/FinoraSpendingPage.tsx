import React, { useState, useEffect } from 'react';
import { 
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Search,
  ChevronDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import './ui/finora-theme.css';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  status: 'paid' | 'overdue' | 'pending';
  icon: string;
}

// Mock data matching the Finora design
const mockTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Dropbox Business',
    amount: -299,
    category: 'Software',
    date: '14/05/25',
    status: 'paid',
    icon: '📦'
  },
  {
    id: '2', 
    description: 'Coworking Space',
    amount: -1200,
    category: 'Office',
    date: '11/05/25',
    status: 'overdue',
    icon: '🏢'
  },
  {
    id: '3',
    description: 'Shipping Fees',
    amount: -85,
    category: 'Bank Fees',
    date: '11/05/25',
    status: 'paid',
    icon: '🚚'
  },
  {
    id: '4',
    description: 'Slack Plan',
    amount: -160,
    category: 'Software',
    date: '08/05/25',
    status: 'pending',
    icon: '💬'
  },
  {
    id: '5',
    description: 'Figma Pro',
    amount: -144,
    category: 'Software',
    date: '07/05/25',
    status: 'pending',
    icon: '🎨'
  },
  {
    id: '6',
    description: 'Coworking Space',
    amount: 5500,
    category: 'Staff / salaries',
    date: '07/05/25',
    status: 'paid',
    icon: '👥'
  },
  {
    id: '7',
    description: 'Bonus Payments',
    amount: 2200,
    category: 'Staff / salaries',
    date: '05/05/25',
    status: 'paid',
    icon: '💰'
  },
  {
    id: '8',
    description: 'Google Workspace',
    amount: -300,
    category: 'Software',
    date: '03/05/25',
    status: 'paid',
    icon: '🌐'
  }
];

// Mini chart component
const MiniChart = ({ data, color, type }: { data: number[], color: string, type: 'up' | 'down' }) => {
  return (
    <div className="mini-chart flex items-end justify-center gap-0.5">
      {data.map((value, index) => (
        <div
          key={index}
          className="w-1 rounded-sm transition-all duration-300"
          style={{
            height: `${Math.max(8, (value / Math.max(...data)) * 32)}px`,
            backgroundColor: color,
            opacity: 0.8 + (index * 0.05)
          }}
        />
      ))}
    </div>
  );
};

// Status badge component
const StatusBadge = ({ status }: { status: 'paid' | 'overdue' | 'pending' }) => {
  const statusConfig = {
    paid: { text: 'Paid', className: 'status-paid' },
    overdue: { text: 'Overdue', className: 'status-overdue' },
    pending: { text: 'Pending', className: 'status-pending' }
  };

  const config = statusConfig[status];
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.className}`}>
      {config.text}
    </span>
  );
};

export default function FinoraSpendingPage() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [dateFilter, setDateFilter] = useState('Date');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate totals
  const revenue = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expenses = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
  const netProfit = revenue - expenses;

  // Mock chart data
  const revenueData = [20, 35, 25, 40, 30, 45, 35, 50];
  const expensesData = [30, 25, 35, 20, 40, 25, 45, 30];
  const profitData = [15, 25, 20, 35, 25, 40, 30, 45];

  return (
    <div className="min-h-screen" style={{ background: 'var(--background-primary)' }}>
      {/* Header */}
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Transactions
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Here is a summary of your financial information
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Revenue Card */}
          <div className="finora-card p-6 relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Revenue</p>
                <h3 className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                  ${revenue.toLocaleString()}
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
                  40%
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  vs last month
                </span>
              </div>
              <MiniChart data={revenueData} color="var(--chart-revenue)" type="up" />
            </div>
          </div>

          {/* Expenses Card */}
          <div className="finora-card p-6 relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Expenses</p>
                <h3 className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                  ${expenses.toLocaleString()}
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
              <MiniChart data={expensesData} color="var(--chart-expense)" type="down" />
            </div>
          </div>

          {/* Net Profit Card */}
          <div className="finora-card p-6 relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Net profit</p>
                <h3 className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                  ${netProfit.toLocaleString()}
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
              <MiniChart data={profitData} color="var(--chart-profit)" type="up" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          {/* Date Filter */}
          <div className="relative">
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="appearance-none bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              style={{ color: 'var(--text-primary)', background: 'var(--background-card)' }}
            >
              <option>Date</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              style={{ color: 'var(--text-primary)', background: 'var(--background-card)' }}
            >
              <option>All Status</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Overdue</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              style={{ color: 'var(--text-primary)', background: 'var(--background-card)' }}
            >
              <option>All Categories</option>
              <option>Software</option>
              <option>Office</option>
              <option>Staff / salaries</option>
              <option>Bank Fees</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
          </div>

          {/* Search */}
          <div className="relative ml-auto">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[200px]"
              style={{ color: 'var(--text-primary)', background: 'var(--background-card)' }}
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="finora-card overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-primary)' }}>
            <div className="grid grid-cols-12 gap-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              <div className="col-span-5">Payments</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-3">Date</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y" style={{ borderColor: 'var(--border-primary)' }}>
            {transactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="transaction-row px-6 py-4 transition-colors cursor-pointer"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Payment Info */}
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                      {transaction.icon}
                    </div>
                    <div>
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {transaction.description}
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="col-span-2">
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {transaction.category}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <StatusBadge status={transaction.status} />
                  </div>

                  {/* Date */}
                  <div className="col-span-3">
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {transaction.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}