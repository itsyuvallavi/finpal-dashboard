import { TrendingUp, TrendingDown, MoreHorizontal } from "lucide-react";

interface MetricCardProps {
  title: string;
  amount: string;
  change: string;
  isPositive: boolean;
  chartPath: string;
}

function MetricCard({ title, amount, change, isPositive, chartPath }: MetricCardProps) {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 text-sm">{title}</h3>
        <button className="text-gray-500 hover:text-gray-300">
          <MoreHorizontal size={16} />
        </button>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className="text-white text-2xl font-semibold mb-2">{amount}</div>
          <div className="flex items-center space-x-1">
            {isPositive ? (
              <TrendingUp size={14} className="text-green-500" />
            ) : (
              <TrendingDown size={14} className="text-red-500" />
            )}
            <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {change}
            </span>
            <span className="text-gray-500 text-sm">vs last month</span>
          </div>
        </div>
        
        {/* Mini chart */}
        <div className="w-16 h-8">
          <svg width="64" height="32" viewBox="0 0 64 32">
            <path
              d={chartPath}
              stroke={isPositive ? "#10b981" : "#ef4444"}
              strokeWidth="2"
              fill="none"
              className="drop-shadow-sm"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function MetricCards() {
  const metrics = [
    {
      title: "Revenue",
      amount: "$8,250",
      change: "60%",
      isPositive: true,
      chartPath: "M0 20 L16 18 L32 12 L48 8 L64 6"
    },
    {
      title: "Expenses", 
      amount: "$4,290",
      change: "10%",
      isPositive: false,
      chartPath: "M0 12 L16 8 L32 14 L48 18 L64 16"
    },
    {
      title: "Net profit",
      amount: "$3,960", 
      change: "20%",
      isPositive: true,
      chartPath: "M0 16 L16 14 L32 10 L48 8 L64 6"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}