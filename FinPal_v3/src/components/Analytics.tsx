import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// Define chart colors for dark theme
const CHART_COLORS = {
  primary: "#8b5cf6",    // Purple
  secondary: "#06b6d4",  // Cyan
  tertiary: "#10b981",   // Green
  quaternary: "#f59e0b", // Yellow
  quinary: "#ef4444",    // Red
};

const spendingData = [
  { month: "Jan", spending: 2400, income: 4000 },
  { month: "Feb", spending: 2800, income: 3800 },
  { month: "Mar", spending: 3200, income: 4200 },
  { month: "Apr", spending: 2900, income: 4100 },
  { month: "May", spending: 3100, income: 4300 },
  { month: "Jun", spending: 2700, income: 4000 },
];

const categoryData = [
  { category: "Food", amount: 890, percentage: 28 },
  { category: "Transport", amount: 650, percentage: 20 },
  { category: "Entertainment", amount: 420, percentage: 13 },
  { category: "Utilities", amount: 380, percentage: 12 },
  { category: "Shopping", amount: 320, percentage: 10 },
  { category: "Other", amount: 540, percentage: 17 },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function Analytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Analytics</h1>
          <p className="text-muted-foreground">Deep dive into your spending patterns</p>
        </div>
        <Select defaultValue="6months">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">3 months</SelectItem>
            <SelectItem value="6months">6 months</SelectItem>
            <SelectItem value="1year">1 year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 md:grid-cols-2"
          >
            {/* Income vs Spending */}
            <motion.div variants={item}>
              <Card>
                <CardHeader>
                  <CardTitle>Income vs Spending</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={spendingData} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
                      <defs>
                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.05}/>
                        </linearGradient>
                        <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis 
                        dataKey="month" 
                        stroke="#9ca3af"
                        fontSize={12}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#9ca3af"
                        fontSize={12}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#f9fafb",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)"
                        }}
                        formatter={(value: number, name: string) => [
                          `$${value.toLocaleString()}`,
                          name === 'income' ? 'Income' : 'Spending'
                        ]}
                      />
                      <Legend 
                        wrapperStyle={{
                          paddingTop: '20px',
                          color: '#9ca3af',
                          fontSize: '12px'
                        }}
                        iconType="rect"
                      />
                      <Area
                        type="monotone"
                        dataKey="income"
                        stroke={CHART_COLORS.primary}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#incomeGradient)"
                        name="Income"
                      />
                      <Area
                        type="monotone"
                        dataKey="spending"
                        stroke={CHART_COLORS.secondary}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#spendingGradient)"
                        name="Spending"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Category Breakdown */}
            <motion.div variants={item}>
              <Card>
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={categoryData} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis 
                        dataKey="category" 
                        stroke="#9ca3af"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#9ca3af"
                        fontSize={12}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#f9fafb",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)"
                        }}
                        formatter={(value: number) => [`$${value}`, 'Amount']}
                      />
                      <Bar 
                        dataKey="amount" 
                        fill={CHART_COLORS.tertiary}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((category, index) => (
                    <motion.div
                      key={category.category}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ 
                            backgroundColor: Object.values(CHART_COLORS)[index % Object.values(CHART_COLORS).length]
                          }}
                        />
                        <span className="font-medium">{category.category}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-xs">
                          {category.percentage}%
                        </Badge>
                        <span className="font-semibold text-lg">${category.amount}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="trends">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Spending Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Trend analysis coming soon</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}