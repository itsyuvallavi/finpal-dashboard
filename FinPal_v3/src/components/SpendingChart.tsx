import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';

const spendingData = [
  { month: 'Jan', spending: 3200, income: 8500 },
  { month: 'Feb', spending: 3800, income: 8200 },
  { month: 'Mar', spending: 4100, income: 8800 },
  { month: 'Apr', spending: 3600, income: 8600 },
  { month: 'May', spending: 4290, income: 8250 },
  { month: 'Jun', spending: 3900, income: 8750 }
];

const categoryData = [
  { category: 'Software', amount: 850, color: '#8b5cf6' },
  { category: 'Office', amount: 1500, color: '#06b6d4' },
  { category: 'Staff', amount: 5500, color: '#10b981' },
  { category: 'Bank Fees', amount: 1050, color: '#f59e0b' },
  { category: 'Other', amount: 390, color: '#ef4444' }
];

export function SpendingChart() {
  return (
    <div className="bg-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-xl font-semibold">Spending Overview</h3>
        <select className="bg-gray-700 text-gray-300 px-3 py-1 rounded-lg border border-gray-600 text-sm">
          <option>Last 6 months</option>
          <option>Last 3 months</option>
          <option>This year</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Trend Chart */}
        <div>
          <h4 className="text-gray-300 text-sm mb-4">Monthly Trends</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendingData}>
                <defs>
                  <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stackId="1"
                  stroke="#10b981"
                  fill="url(#incomeGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="spending"
                  stackId="2"
                  stroke="#8b5cf6"
                  fill="url(#spendingGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Category Breakdown */}
        <div>
          <h4 className="text-gray-300 text-sm mb-4">Spending by Category</h4>
          <div className="space-y-3">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-gray-300 text-sm">{category.category}</span>
                </div>
                <span className="text-white font-medium">${category.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Spending</span>
              <span className="text-white font-semibold">$9,290</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}