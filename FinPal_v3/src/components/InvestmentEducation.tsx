import { BookOpen, TrendingUp, Award, Play, Shield, DollarSign } from "lucide-react";
import { Progress } from "./ui/progress";

interface LearningModule {
  id: string;
  title: string;
  description: string;
  progress: number;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: React.ReactNode;
}

const learningModules: LearningModule[] = [
  {
    id: "1",
    title: "Stock Market Basics",
    description: "Learn the fundamentals of stock investing and market mechanics",
    progress: 85,
    duration: "45 min",
    difficulty: "Beginner",
    icon: <TrendingUp size={20} className="text-green-400" />
  },
  {
    id: "2",
    title: "Risk Management",
    description: "Understanding risk tolerance and portfolio diversification",
    progress: 60,
    duration: "30 min", 
    difficulty: "Intermediate",
    icon: <Shield size={20} className="text-blue-400" />
  },
  {
    id: "3",
    title: "ETFs vs Mutual Funds",
    description: "Compare different investment vehicles and their benefits",
    progress: 25,
    duration: "25 min",
    difficulty: "Beginner",
    icon: <DollarSign size={20} className="text-purple-400" />
  }
];

const riskQuestions = [
  {
    question: "How would you react to a 20% drop in your portfolio?",
    options: ["Sell everything", "Hold steady", "Buy more", "Panic and check daily"]
  },
  {
    question: "What's your investment timeline?",
    options: ["< 1 year", "1-5 years", "5-10 years", "10+ years"]
  }
];

function ModuleCard({ module }: { module: LearningModule }) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400';
      case 'Intermediate': return 'text-yellow-400';
      case 'Advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-700 rounded-xl p-4 hover:bg-gray-600 transition-colors cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {module.icon}
          <div>
            <h4 className="text-white font-medium">{module.title}</h4>
            <p className="text-gray-300 text-sm">{module.description}</p>
          </div>
        </div>
        <Play size={16} className="text-purple-400" />
      </div>
      
      <div className="space-y-2">
        <Progress value={module.progress} className="h-1" />
        <div className="flex justify-between text-xs">
          <span className={getDifficultyColor(module.difficulty)}>{module.difficulty}</span>
          <span className="text-gray-400">{module.duration}</span>
        </div>
      </div>
    </div>
  );
}

export function InvestmentEducation() {
  return (
    <div className="bg-gray-800 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="text-purple-400" size={24} />
        <h3 className="text-white text-xl font-semibold">Investment Education</h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Modules */}
        <div>
          <h4 className="text-gray-300 mb-4">Learning Modules</h4>
          <div className="space-y-3">
            {learningModules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
          
          <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors">
            View All Modules
          </button>
        </div>
        
        {/* Risk Assessment & Paper Trading */}
        <div className="space-y-6">
          {/* Risk Assessment */}
          <div className="bg-gray-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="text-blue-400" size={20} />
              <h4 className="text-white font-medium">Risk Assessment</h4>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Complete our quick assessment to understand your risk tolerance
            </p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
              Take Assessment
            </button>
          </div>
          
          {/* Paper Trading */}
          <div className="bg-gray-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Award className="text-green-400" size={20} />
              <h4 className="text-white font-medium">Paper Trading</h4>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Practice investing with virtual money before using real funds
            </p>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-400">Virtual Balance</span>
              <span className="text-green-400 font-medium">$100,000</span>
            </div>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors">
              Start Trading
            </button>
          </div>
          
          {/* Investment Recommendations */}
          <div className="bg-gray-700 rounded-xl p-4">
            <h4 className="text-white font-medium mb-3">Recommended for You</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Conservative Portfolio</span>
                <span className="text-purple-400">Low Risk</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Balanced Portfolio</span>
                <span className="text-yellow-400">Medium Risk</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}