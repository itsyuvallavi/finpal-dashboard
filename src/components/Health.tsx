import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Activity, 
  TrendingUp, 
  Shield, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Info,
  RefreshCw
} from "lucide-react";

const healthMetrics = [
  {
    title: "Savings Rate",
    score: 85,
    status: "excellent",
    description: "You're saving 25% of your income",
    icon: Target,
    recommendation: "Keep up the excellent work!"
  },
  {
    title: "Debt-to-Income Ratio",
    score: 72,
    status: "good",
    description: "Your debt ratio is 18% of income",
    icon: Shield,
    recommendation: "Consider paying down high-interest debt"
  },
  {
    title: "Emergency Fund",
    score: 60,
    status: "fair",
    description: "3.5 months of expenses covered",
    icon: AlertTriangle,
    recommendation: "Aim for 6 months of expenses"
  },
  {
    title: "Investment Diversification",
    score: 45,
    status: "poor",
    description: "Low portfolio diversification",
    icon: TrendingUp,
    recommendation: "Diversify across asset classes"
  }
];

const overallScore = Math.round(
  healthMetrics.reduce((sum, metric) => sum + metric.score, 0) / healthMetrics.length
);

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-blue-500";
  if (score >= 40) return "text-yellow-500";
  return "text-red-500";
};



const getStatusBadge = (status: string) => {
  switch (status) {
    case 'excellent':
      return <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">Excellent</Badge>;
    case 'good':
      return <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30">Good</Badge>;
    case 'fair':
      return <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30">Fair</Badge>;
    case 'poor':
      return <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30">Needs Work</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

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

export function Health() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Financial Health</h1>
          <p className="text-muted-foreground">Monitor your overall financial wellness</p>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh Score
        </Button>
      </div>

      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Activity className="h-5 w-5" />
              Overall Health Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative inline-flex items-center justify-center">
              {/* Circular Progress */}
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={overallScore >= 80 ? '#10b981' : overallScore >= 60 ? '#3b82f6' : overallScore >= 40 ? '#eab308' : '#ef4444'} />
                      <stop offset="100%" stopColor={overallScore >= 80 ? '#059669' : overallScore >= 60 ? '#2563eb' : overallScore >= 40 ? '#ca8a04' : '#dc2626'} />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="url(#scoreGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - overallScore / 100)}`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
                      {overallScore}
                    </div>
                    <div className="text-xs text-muted-foreground">out of 100</div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              {overallScore >= 80 ? "Excellent financial health!" :
               overallScore >= 60 ? "Good financial health with room to improve" :
               overallScore >= 40 ? "Fair - focus on key areas" :
               "Needs attention - let's work on this together"}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Metrics */}
      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="metrics">Health Metrics</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-4 md:grid-cols-2"
          >
            {healthMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div key={metric.title} variants={item}>
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <CardTitle className="text-base">{metric.title}</CardTitle>
                        </div>
                        {getStatusBadge(metric.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-2xl font-bold ${getScoreColor(metric.score)}`}>
                          {metric.score}
                        </span>
                        <span className="text-sm text-muted-foreground">/ 100</span>
                      </div>
                      <Progress value={metric.score} className="h-2" />
                      <p className="text-sm text-muted-foreground">{metric.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </TabsContent>

        <TabsContent value="recommendations">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {healthMetrics.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${
                        metric.status === 'excellent' ? 'bg-green-500/20' :
                        metric.status === 'good' ? 'bg-blue-500/20' :
                        metric.status === 'fair' ? 'bg-yellow-500/20' :
                        'bg-red-500/20'
                      }`}>
                        {metric.status === 'excellent' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : metric.status === 'poor' ? (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        ) : (
                          <Info className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{metric.title}</h4>
                        <p className="text-sm text-muted-foreground">{metric.recommendation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}