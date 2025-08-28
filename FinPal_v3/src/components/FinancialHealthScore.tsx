import { Heart, TrendingUp, Shield, Target, AlertCircle } from "lucide-react";
import { Progress } from "./ui/progress";

interface HealthMetric {
  label: string;
  score: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  icon: React.ReactNode;
  description: string;
}

const healthMetrics: HealthMetric[] = [
  {
    label: "Savings Rate",
    score: 85,
    status: "excellent",
    icon: <Target size={16} className="text-green-400" />,
    description: "You're saving 25% of your income - excellent!"
  },
  {
    label: "Debt-to-Income",
    score: 72,
    status: "good", 
    icon: <Shield size={16} className="text-blue-400" />,
    description: "Your debt ratio is healthy at 18%"
  },
  {
    label: "Emergency Fund",
    score: 60,
    status: "fair",
    icon: <AlertCircle size={16} className="text-yellow-400" />,
    description: "Build up to 6 months of expenses"
  },
  {
    label: "Investment Diversification",
    score: 45,
    status: "poor",
    icon: <TrendingUp size={16} className="text-red-400" />,
    description: "Consider diversifying your portfolio"
  }
];

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-blue-400"; 
  if (score >= 40) return "text-yellow-400";
  return "text-red-400";
}

function getStatusColor(status: string) {
  switch (status) {
    case 'excellent': return "bg-green-500/20 text-green-400";
    case 'good': return "bg-blue-500/20 text-blue-400";
    case 'fair': return "bg-yellow-500/20 text-yellow-400";
    case 'poor': return "bg-red-500/20 text-red-400";
    default: return "bg-gray-500/20 text-gray-400";
  }
}

export function FinancialHealthScore() {
  const overallScore = Math.round(healthMetrics.reduce((sum, metric) => sum + metric.score, 0) / healthMetrics.length);
  
  return (
    <div className="bg-gray-800 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="text-purple-400" size={24} />
        <h3 className="text-white text-xl font-semibold">Financial Health Score</h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Score */}
        <div className="bg-gray-700 rounded-xl p-6 text-center">
          <div className="mb-4">
            <div className={`text-4xl font-bold mb-2 ${getScoreColor(overallScore)}`}>
              {overallScore}
            </div>
            <div className="text-gray-300">Overall Health Score</div>
          </div>
          
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-600"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                className={getScoreColor(overallScore)}
                style={{
                  strokeDasharray: `${2 * Math.PI * 56}`,
                  strokeDashoffset: `${2 * Math.PI * 56 * (1 - overallScore / 100)}`
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}%
              </span>
            </div>
          </div>
          
          <div className="text-sm text-gray-400">
            {overallScore >= 80 ? "Excellent financial health!" :
             overallScore >= 60 ? "Good financial health" :
             overallScore >= 40 ? "Fair - room for improvement" :
             "Needs attention"}
          </div>
        </div>
        
        {/* Detailed Metrics */}
        <div className="space-y-4">
          {healthMetrics.map((metric, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {metric.icon}
                  <span className="text-white font-medium">{metric.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${getScoreColor(metric.score)}`}>
                    {metric.score}%
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(metric.status)}`}>
                    {metric.status}
                  </span>
                </div>
              </div>
              
              <Progress value={metric.score} className="h-2 mb-2" />
              
              <p className="text-gray-300 text-xs">{metric.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <h4 className="text-white font-medium mb-3">Recommended Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
            Increase Emergency Fund
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
            Diversify Investments
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
            Schedule Review
          </button>
        </div>
      </div>
    </div>
  );
}