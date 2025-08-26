import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  Target, 
  AlertTriangle, 
  Info, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  Eye, 
  EyeOff, 
  Calendar, 
  Globe, 
  Zap,
  Shield,
  Award,
  Activity,
  MoreHorizontal,
  RefreshCw,
  Download,
  Settings
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export default function InvestmentsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1Y');
  const [showBalance, setShowBalance] = useState(true);

  const portfolioSummary = {
    totalValue: 87650.42,
    dayChange: 1234.56,
    dayChangePercent: 1.43,
    totalGain: 12450.42,
    totalGainPercent: 16.57,
    cashBalance: 2340.15
  };

  const investments = [
    {
      id: 1,
      symbol: 'AAPL',
      name: 'Apple Inc.',
      type: 'Stock',
      shares: 45,
      avgPrice: 150.25,
      currentPrice: 175.30,
      value: 7888.50,
      gain: 1127.25,
      gainPercent: 16.68,
      allocation: 9.0
    },
    {
      id: 2,
      symbol: 'VTSAX',
      name: 'Vanguard Total Stock Market',
      type: 'Mutual Fund',
      shares: 180.5,
      avgPrice: 95.40,
      currentPrice: 108.75,
      value: 19629.38,
      gain: 2411.88,
      gainPercent: 14.02,
      allocation: 22.4
    },
    {
      id: 3,
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      type: 'Stock',
      shares: 25,
      avgPrice: 280.00,
      currentPrice: 320.45,
      value: 8011.25,
      gain: 1011.25,
      gainPercent: 14.45,
      allocation: 9.1
    },
    {
      id: 4,
      symbol: 'BTC',
      name: 'Bitcoin',
      type: 'Crypto',
      shares: 0.5,
      avgPrice: 35000,
      currentPrice: 42000,
      value: 21000,
      gain: 3500,
      gainPercent: 20.00,
      allocation: 24.0
    },
    {
      id: 5,
      symbol: 'VTIAX',
      name: 'Vanguard International Fund',
      type: 'Mutual Fund',
      shares: 320,
      avgPrice: 28.50,
      currentPrice: 31.20,
      value: 9984.00,
      gain: 864.00,
      gainPercent: 9.47,
      allocation: 11.4
    },
    {
      id: 6,
      symbol: 'VTI',
      name: 'Vanguard Total Stock Market ETF',
      type: 'ETF',
      shares: 85,
      avgPrice: 210.00,
      currentPrice: 235.60,
      value: 20026.00,
      gain: 2176.00,
      gainPercent: 12.15,
      allocation: 22.8
    }
  ];

  const assetAllocation = [
    { category: 'US Stocks', percentage: 54.3, value: 47600.15, color: 'bg-blue-500' },
    { category: 'International', percentage: 18.7, value: 16393.82, color: 'bg-green-500' },
    { category: 'Cryptocurrency', percentage: 24.0, value: 21000.00, color: 'bg-orange-500' },
    { category: 'Cash', percentage: 2.7, value: 2367.45, color: 'bg-gray-500' },
    { category: 'Bonds', percentage: 0.3, value: 289.00, color: 'bg-purple-500' }
  ];

  const insights = [
    {
      type: 'success',
      title: 'Portfolio Performing Well',
      description: 'Your portfolio is up 16.57% this year, outperforming the S&P 500 by 3.2%.',
      action: 'View Performance'
    },
    {
      type: 'warning',
      title: 'High Crypto Allocation',
      description: 'Your crypto allocation (24%) is above the recommended 5-10% for most portfolios.',
      action: 'Rebalance Portfolio'
    },
    {
      type: 'info',
      title: 'Rebalancing Opportunity',
      description: 'Consider rebalancing your portfolio to maintain your target allocation.',
      action: 'Start Rebalancing'
    },
    {
      type: 'tip',
      title: 'Tax Loss Harvesting',
      description: 'You may have opportunities for tax loss harvesting to reduce your tax burden.',
      action: 'Learn More'
    }
  ];

  const marketNews = [
    {
      title: 'Fed Announces Interest Rate Decision',
      source: 'MarketWatch',
      time: '2 hours ago',
      impact: 'high'
    },
    {
      title: 'Tech Stocks Rally on AI Developments',
      source: 'CNBC',
      time: '4 hours ago',
      impact: 'medium'
    },
    {
      title: 'Crypto Market Shows Volatility',
      source: 'CoinDesk',
      time: '6 hours ago',
      impact: 'medium'
    }
  ];

  const riskMetrics = {
    riskScore: 7.2,
    volatility: '18.5%',
    sharpeRatio: 1.34,
    beta: 1.08,
    maxDrawdown: '-8.7%'
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  return (
    <div className="p-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="p-6 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Portfolio Value</p>
              <div className="flex items-center gap-3">
                <h3 className="text-3xl font-semibold text-gray-900">
                  {showBalance ? formatCurrency(portfolioSummary.totalValue) : '••••••'}
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowBalance(!showBalance)}
                >
                  {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className={`flex items-center gap-1 ${
                  portfolioSummary.dayChange >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {portfolioSummary.dayChange >= 0 ? 
                    <ArrowUpRight size={14} /> : 
                    <ArrowDownRight size={14} />
                  }
                  <span className="text-sm font-medium">
                    {formatCurrency(Math.abs(portfolioSummary.dayChange))} 
                    ({formatPercent(portfolioSummary.dayChangePercent)}) today
                  </span>
                </div>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp size={24} className="text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Gain/Loss</p>
              <h3 className={`text-2xl font-semibold ${
                portfolioSummary.totalGain >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {showBalance ? formatCurrency(portfolioSummary.totalGain) : '••••••'}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <span className={`text-xs ${
                  portfolioSummary.totalGainPercent >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatPercent(portfolioSummary.totalGainPercent)} all time
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign size={20} className="text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Cash Balance</p>
              <h3 className="text-2xl font-semibold text-gray-900">
                {showBalance ? formatCurrency(portfolioSummary.cashBalance) : '••••••'}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-500">Available to invest</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <PieChart size={20} className="text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Holdings & Portfolio */}
        <div className="col-span-2">
          <Tabs defaultValue="holdings" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="holdings">Holdings</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="allocation">Allocation</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1D">1D</SelectItem>
                    <SelectItem value="1W">1W</SelectItem>
                    <SelectItem value="1M">1M</SelectItem>
                    <SelectItem value="3M">3M</SelectItem>
                    <SelectItem value="1Y">1Y</SelectItem>
                    <SelectItem value="ALL">ALL</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="gap-2">
                  <RefreshCw size={16} />
                  Sync
                </Button>
                <Button size="sm" className="gap-2">
                  <Plus size={16} />
                  Buy/Sell
                </Button>
              </div>
            </div>

            <TabsContent value="holdings" className="space-y-4">
              {investments.map((investment) => (
                <Card key={investment.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${
                        investment.type === 'Stock' ? 'bg-blue-100' :
                        investment.type === 'ETF' ? 'bg-green-100' :
                        investment.type === 'Mutual Fund' ? 'bg-purple-100' :
                        'bg-orange-100'
                      }`}>
                        {investment.type === 'Crypto' ? (
                          <Zap size={16} className="text-orange-600" />
                        ) : (
                          <BarChart3 size={16} className={`${
                            investment.type === 'Stock' ? 'text-blue-600' :
                            investment.type === 'ETF' ? 'text-green-600' :
                            'text-purple-600'
                          }`} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{investment.symbol}</h4>
                          <Badge variant="outline" className="text-xs">
                            {investment.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{investment.name}</p>
                        <p className="text-xs text-gray-500">
                          {investment.shares} shares @ {formatCurrency(investment.avgPrice)} avg
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">
                          {showBalance ? formatCurrency(investment.value) : '••••••'}
                        </p>
                        <span className="text-sm text-gray-500">
                          {investment.allocation}%
                        </span>
                      </div>
                      <div className={`flex items-center gap-1 justify-end ${
                        investment.gain >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {investment.gain >= 0 ? 
                          <ArrowUpRight size={12} /> : 
                          <ArrowDownRight size={12} />
                        }
                        <span className="text-sm font-medium">
                          {showBalance ? formatCurrency(Math.abs(investment.gain)) : '••••••'}
                        </span>
                        <span className="text-xs">({formatPercent(investment.gainPercent)})</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Current: {formatCurrency(investment.currentPrice)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}

              <Card className="p-4 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                <div className="text-center">
                  <Plus size={24} className="mx-auto text-gray-400 mb-2" />
                  <h3 className="font-medium text-gray-700 mb-1">Add Investment</h3>
                  <p className="text-sm text-gray-500">Buy stocks, ETFs, or other securities</p>
                  <Button variant="ghost" className="mt-3">
                    Start Investing
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Portfolio Performance</h3>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">+16.57% YTD</Badge>
                  </div>
                </div>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <Activity size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Performance chart visualization would go here</p>
                    <p className="text-sm text-gray-500 mt-1">Interactive chart showing portfolio value over time</p>
                  </div>
                </div>
              </Card>

              {/* Risk Metrics */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Risk Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield size={16} className="text-blue-600" />
                      <span className="text-sm font-medium">Risk Score</span>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">{riskMetrics.riskScore}/10</p>
                    <p className="text-xs text-gray-500">Moderate Risk</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity size={16} className="text-orange-600" />
                      <span className="text-sm font-medium">Volatility</span>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">{riskMetrics.volatility}</p>
                    <p className="text-xs text-gray-500">Annualized</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Award size={16} className="text-green-600" />
                      <span className="text-sm font-medium">Sharpe Ratio</span>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">{riskMetrics.sharpeRatio}</p>
                    <p className="text-xs text-gray-500">Risk-adjusted return</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown size={16} className="text-red-600" />
                      <span className="text-sm font-medium">Max Drawdown</span>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">{riskMetrics.maxDrawdown}</p>
                    <p className="text-xs text-gray-500">Largest loss</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="allocation" className="space-y-4">
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Asset Allocation</h3>
                <div className="space-y-4">
                  {assetAllocation.map((asset, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${asset.color}`}></div>
                          <span className="font-medium text-gray-900">{asset.category}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">{asset.percentage}%</span>
                          <p className="text-sm text-gray-600">
                            {showBalance ? formatCurrency(asset.value) : '••••••'}
                          </p>
                        </div>
                      </div>
                      <Progress value={asset.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Rebalancing Recommendations</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={16} className="text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900">Overweight in Crypto</h4>
                        <p className="text-sm text-gray-600">Consider reducing crypto allocation by 14% to reach target 10%</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Info size={16} className="text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900">Underweight in Bonds</h4>
                        <p className="text-sm text-gray-600">Consider increasing bond allocation to 15% for better diversification</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-4">
                  Auto-Rebalance Portfolio
                </Button>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Insights */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Investment Insights</h3>
              <Button variant="ghost" size="sm">
                <MoreHorizontal size={16} />
              </Button>
            </div>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      insight.type === 'warning' ? 'bg-yellow-100' :
                      insight.type === 'success' ? 'bg-green-100' :
                      insight.type === 'info' ? 'bg-blue-100' : 'bg-purple-100'
                    }`}>
                      {insight.type === 'warning' && <AlertTriangle size={14} className="text-yellow-600" />}
                      {insight.type === 'success' && <TrendingUp size={14} className="text-green-600" />}
                      {insight.type === 'info' && <Info size={14} className="text-blue-600" />}
                      {insight.type === 'tip' && <Target size={14} className="text-purple-600" />}
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

          {/* Market News */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Market News</h3>
              <Button variant="ghost" size="sm">
                <Globe size={16} />
              </Button>
            </div>
            <div className="space-y-3">
              {marketNews.map((news, index) => (
                <Card key={index} className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                        {news.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{news.source}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{news.time}</span>
                      </div>
                    </div>
                    <Badge className={`text-xs ${
                      news.impact === 'high' ? 'bg-red-100 text-red-800' :
                      news.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {news.impact}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Plus size={16} />
                Add Money
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Target size={16} />
                Rebalance
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Download size={16} />
                Tax Documents
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Settings size={16} />
                Investment Goals
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}