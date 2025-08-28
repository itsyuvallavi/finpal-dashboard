import { Target, TrendingUp, Home, GraduationCap } from "lucide-react";
import { Progress } from "./ui/progress";

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  icon: React.ReactNode;
  category: string;
  deadline: string;
}

const goals: Goal[] = [
  {
    id: "1",
    title: "Emergency Fund",
    target: 10000,
    current: 7500,
    icon: <Target size={20} className="text-blue-400" />,
    category: "Savings",
    deadline: "Dec 2024"
  },
  {
    id: "2", 
    title: "House Down Payment",
    target: 50000,
    current: 32000,
    icon: <Home size={20} className="text-green-400" />,
    category: "Investment",
    deadline: "Jun 2025"
  },
  {
    id: "3",
    title: "Retirement Savings",
    target: 25000,
    current: 18500,
    icon: <TrendingUp size={20} className="text-purple-400" />,
    category: "Long-term",
    deadline: "Dec 2024"
  },
  {
    id: "4",
    title: "Education Fund",
    target: 15000,
    current: 4200,
    icon: <GraduationCap size={20} className="text-yellow-400" />,
    category: "Education",
    deadline: "Sep 2025"
  }
];

function GoalCard({ goal }: { goal: Goal }) {
  const progressPercentage = (goal.current / goal.target) * 100;
  
  return (
    <div className="bg-gray-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {goal.icon}
          <span className="text-white font-medium">{goal.title}</span>
        </div>
        <span className="text-gray-400 text-sm">{goal.deadline}</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">${goal.current.toLocaleString()}</span>
          <span className="text-gray-400">${goal.target.toLocaleString()}</span>
        </div>
        
        <Progress value={progressPercentage} className="h-2" />
        
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">{goal.category}</span>
          <span className="text-purple-400">{progressPercentage.toFixed(0)}% complete</span>
        </div>
      </div>
    </div>
  );
}

export function GoalsTracker() {
  return (
    <div className="bg-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-xl font-semibold">Financial Goals</h3>
        <button className="text-purple-400 hover:text-purple-300 text-sm">View All</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
}