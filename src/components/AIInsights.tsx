import { Brain, TrendingUp, AlertTriangle, Target } from "lucide-react";

interface InsightCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'neutral';
}

function InsightCard({ icon, title, description, type }: InsightCardProps) {
  const getCardStyles = () => {
    switch (type) {
      case 'positive':
        return 'border-green-500/30 bg-green-500/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      default:
        return 'border-purple-500/30 bg-purple-500/10';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'positive':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      default:
        return 'text-purple-400';
    }
  };

  return (
    <div className={`border rounded-xl p-4 ${getCardStyles()}`}>
      <div className="flex items-start gap-3">
        <div className={`${getIconColor()} mt-1`}>
          {icon}
        </div>
        <div>
          <h4 className="text-white font-medium mb-1">{title}</h4>
          <p className="text-gray-300 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function AIInsights() {
  const insights = [
    {
      icon: <TrendingUp size={20} />,
      title: "Spending Trend Improvement",
      description: "Your software expenses have decreased by 15% this month. Great job managing subscriptions!",
      type: 'positive' as const
    },
    {
      icon: <AlertTriangle size={20} />,
      title: "Upcoming Budget Alert",
      description: "You're approaching your monthly office expense limit. Consider reviewing upcoming payments.",
      type: 'warning' as const
    },
    {
      icon: <Target size={20} />,
      title: "Investment Opportunity",
      description: "Based on your savings pattern, you could invest $500 monthly in a diversified portfolio.",
      type: 'neutral' as const
    },
    {
      icon: <Brain size={20} />,
      title: "Smart Saving Tip",
      description: "Consider consolidating your software subscriptions. You could save $120/month with bundled plans.",
      type: 'positive' as const
    }
  ];

  return (
    <div className="bg-gray-800 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="text-purple-400" size={24} />
        <h3 className="text-white text-xl font-semibold">AI Financial Insights</h3>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <InsightCard key={index} {...insight} />
        ))}
      </div>
    </div>
  );
}