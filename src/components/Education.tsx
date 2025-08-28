import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  BookOpen, 
  Play, 
  Clock, 
  Star, 
  Award, 
  TrendingUp,
  Shield,
  DollarSign,
  Brain,
  Target,
  CheckCircle
} from "lucide-react";

const learningModules = [
  {
    id: 1,
    title: "Investment Basics",
    description: "Learn the fundamentals of investing and market mechanics",
    duration: "45 min",
    difficulty: "Beginner",
    progress: 85,
    completed: false,
    icon: TrendingUp,
    lessons: 8
  },
  {
    id: 2,
    title: "Risk Management",
    description: "Understanding risk tolerance and portfolio diversification",
    duration: "30 min",
    difficulty: "Intermediate",
    progress: 60,
    completed: false,
    icon: Shield,
    lessons: 6
  },
  {
    id: 3,
    title: "ETFs vs Mutual Funds",
    description: "Compare different investment vehicles and their benefits",
    duration: "25 min",
    difficulty: "Beginner",
    progress: 100,
    completed: true,
    icon: DollarSign,
    lessons: 5
  },
  {
    id: 4,
    title: "Tax-Efficient Investing",
    description: "Strategies to minimize taxes on your investments",
    duration: "35 min",
    difficulty: "Advanced",
    progress: 0,
    completed: false,
    icon: Brain,
    lessons: 7
  }
];

const achievements = [
  { title: "First Investment", description: "Completed your first module", icon: Award, earned: true },
  { title: "Risk Master", description: "Mastered risk management", icon: Shield, earned: true },
  { title: "Diversification Pro", description: "Learned portfolio diversification", icon: Target, earned: false },
  { title: "Tax Ninja", description: "Mastered tax strategies", icon: Brain, earned: false },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner': return 'bg-green-500/20 text-green-500';
    case 'Intermediate': return 'bg-yellow-500/20 text-yellow-500';
    case 'Advanced': return 'bg-red-500/20 text-red-500';
    default: return 'bg-gray-500/20 text-gray-500';
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

export function Education() {
  const completedModules = learningModules.filter(m => m.completed).length;
  const totalProgress = Math.round(
    learningModules.reduce((sum, module) => sum + module.progress, 0) / learningModules.length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Investment Education</h1>
          <p className="text-muted-foreground">Learn to invest with confidence</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Award className="h-3 w-3" />
            {achievements.filter(a => a.earned).length} achievements
          </Badge>
        </div>
      </div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center space-y-2">
                <div className="text-2xl font-semibold">{completedModules}</div>
                <div className="text-sm text-muted-foreground">Modules Completed</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-semibold">{totalProgress}%</div>
                <div className="text-sm text-muted-foreground">Overall Progress</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-semibold">
                  {learningModules.reduce((sum, m) => sum + m.lessons, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Lessons</div>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={totalProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="modules" className="space-y-6">
        <TabsList>
          <TabsTrigger value="modules">Learning Modules</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="simulator">Paper Trading</TabsTrigger>
        </TabsList>

        <TabsContent value="modules">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-4 md:grid-cols-2"
          >
            {learningModules.map((module, index) => {
              const Icon = module.icon;
              return (
                <motion.div key={module.id} variants={item}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{module.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">{module.description}</p>
                          </div>
                        </div>
                        {module.completed && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{module.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            <span>{module.lessons} lessons</span>
                          </div>
                        </div>
                        <Badge className={getDifficultyColor(module.difficulty)}>
                          {module.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-1" />
                      </div>
                      
                      <Button 
                        className="w-full gap-2" 
                        variant={module.completed ? "outline" : "default"}
                      >
                        <Play className="h-4 w-4" />
                        {module.completed ? "Review" : module.progress > 0 ? "Continue" : "Start"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </TabsContent>

        <TabsContent value="achievements">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-4 md:grid-cols-2"
          >
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`${achievement.earned ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20' : 'opacity-60'}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${
                          achievement.earned 
                            ? 'bg-yellow-500/20 text-yellow-500' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          {achievement.earned && (
                            <Badge className="mt-2 bg-yellow-500/20 text-yellow-500">
                              Earned
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </TabsContent>

        <TabsContent value="simulator">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Paper Trading Simulator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-green-500">$100,000</div>
                    <div className="text-sm text-muted-foreground">Virtual Balance</div>
                  </div>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Practice investing with virtual money. Make trades, learn from mistakes, 
                    and build confidence before investing real money.
                  </p>
                  <Button size="lg" className="gap-2">
                    <Play className="h-4 w-4" />
                    Start Paper Trading
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}