import React, { useState } from 'react';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Star, 
  Award, 
  Users, 
  TrendingUp, 
  Shield, 
  Target, 
  Lightbulb, 
  Brain, 
  FileText, 
  Video, 
  Headphones, 
  Download, 
  Search, 
  Filter, 
  ArrowRight, 
  BarChart3, 
  PieChart, 
  DollarSign, 
  Calculator,
  Bookmark,
  Share,
  ThumbsUp
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export default function LearnPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const learningStats = {
    coursesCompleted: 5,
    totalCourses: 24,
    hoursLearned: 18.5,
    certificates: 2,
    currentStreak: 7
  };

  const courses = [
    {
      id: 1,
      title: 'Personal Budgeting Fundamentals',
      description: 'Master the basics of creating and maintaining a personal budget that works for your lifestyle.',
      category: 'Budgeting',
      level: 'Beginner',
      duration: '2.5 hours',
      modules: 8,
      progress: 100,
      rating: 4.8,
      students: 12450,
      instructor: 'Sarah Chen, CFP',
      completed: true,
      type: 'video',
      thumbnail: '💰'
    },
    {
      id: 2,
      title: 'Emergency Fund Strategy',
      description: 'Learn how to build and maintain an emergency fund that provides true financial security.',
      category: 'Savings',
      level: 'Beginner',
      duration: '1.5 hours',
      modules: 5,
      progress: 75,
      rating: 4.9,
      students: 8920,
      instructor: 'Mike Rodriguez, CPA',
      completed: false,
      type: 'video',
      thumbnail: '🚪'
    },
    {
      id: 3,
      title: 'Introduction to Stock Market Investing',
      description: 'Understand the fundamentals of stock market investing and how to build your first portfolio.',
      category: 'Investing',
      level: 'Intermediate',
      duration: '4 hours',
      modules: 12,
      progress: 30,
      rating: 4.7,
      students: 15680,
      instructor: 'Jennifer Walsh, CFA',
      completed: false,
      type: 'video',
      thumbnail: '📊'
    },
    {
      id: 4,
      title: 'Understanding Credit Scores and Reports',
      description: 'Learn how credit scores work and strategies to improve and maintain excellent credit.',
      category: 'Credit',
      level: 'Beginner',
      duration: '2 hours',
      modules: 6,
      progress: 0,
      rating: 4.6,
      students: 9340,
      instructor: 'David Kim, Credit Expert',
      completed: false,
      type: 'interactive',
      thumbnail: '🏆'
    },
    {
      id: 5,
      title: 'Retirement Planning Essentials',
      description: 'Master the fundamentals of retirement planning including 401(k)s, IRAs, and investment strategies.',
      category: 'Retirement',
      level: 'Intermediate',
      duration: '3.5 hours',
      modules: 10,
      progress: 0,
      rating: 4.8,
      students: 7850,
      instructor: 'Lisa Thompson, CFP',
      completed: false,
      type: 'video',
      thumbnail: '🌅'
    },
    {
      id: 6,
      title: 'Tax Optimization Strategies',
      description: 'Learn legal strategies to minimize your tax burden and maximize your wealth building.',
      category: 'Taxes',
      level: 'Advanced',
      duration: '5 hours',
      modules: 15,
      progress: 0,
      rating: 4.9,
      students: 5620,
      instructor: 'Robert Chen, EA',
      completed: false,
      type: 'video',
      thumbnail: '📈'
    }
  ];

  const achievements = [
    {
      id: 1,
      title: 'Budget Master',
      description: 'Completed all budgeting courses',
      earned: true,
      icon: '🏆',
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'Learning Streak',
      description: '7 days of continuous learning',
      earned: true,
      icon: '🔥',
      date: '2024-01-20'
    },
    {
      id: 3,
      title: 'Investor Initiate',
      description: 'Started first investing course',
      earned: true,
      icon: '💹',
      date: '2024-01-22'
    },
    {
      id: 4,
      title: 'Credit Champion',
      description: 'Master credit and debt management',
      earned: false,
      icon: '🚪',
      date: null
    }
  ];

  const quickLessons = [
    {
      id: 1,
      title: '5-Minute Money Tip: Compound Interest',
      description: 'Understand the power of compound interest with this quick lesson.',
      duration: '5 min',
      type: 'tip',
      completed: false
    },
    {
      id: 2,
      title: 'How to Read a Stock Chart',
      description: 'Basic guide to understanding stock price movements.',
      duration: '8 min',
      type: 'guide',
      completed: true
    },
    {
      id: 3,
      title: 'Debt Avalanche vs Snowball Method',
      description: 'Compare two popular debt repayment strategies.',
      duration: '6 min',
      type: 'comparison',
      completed: false
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category.toLowerCase() === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['all', 'budgeting', 'investing', 'savings', 'credit', 'retirement', 'taxes'];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={16} />;
      case 'interactive': return <Brain size={16} />;
      case 'audio': return <Headphones size={16} />;
      default: return <FileText size={16} />;
    }
  };

  return (
    <div className="p-6">
      {/* Learning Stats Overview */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Courses Completed</p>
              <h3 className="text-2xl font-semibold text-gray-900">
                {learningStats.coursesCompleted}/{learningStats.totalCourses}
              </h3>
            </div>
            <CheckCircle size={20} className="text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Hours Learned</p>
              <h3 className="text-2xl font-semibold text-gray-900">{learningStats.hoursLearned}</h3>
            </div>
            <Clock size={20} className="text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Certificates</p>
              <h3 className="text-2xl font-semibold text-gray-900">{learningStats.certificates}</h3>
            </div>
            <Award size={20} className="text-yellow-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Learning Streak</p>
              <h3 className="text-2xl font-semibold text-gray-900">{learningStats.currentStreak} days</h3>
            </div>
            <TrendingUp size={20} className="text-orange-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Progress</p>
              <h3 className="text-2xl font-semibold text-gray-900">
                {Math.round((learningStats.coursesCompleted / learningStats.totalCourses) * 100)}%
              </h3>
            </div>
            <Target size={20} className="text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-4 gap-6">
        {/* Course Catalog */}
        <div className="col-span-3">
          <Tabs defaultValue="courses" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList>
                <TabsTrigger value="courses">All Courses</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="quick-lessons">Quick Lessons</TabsTrigger>
              </TabsList>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search courses, topics, or instructors..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Filter size={16} />
                Filter
              </Button>
            </div>

            <TabsContent value="courses" className="space-y-4">
              {filteredCourses.map((course) => (
                <Card key={course.id} className={`p-6 hover:shadow-md transition-shadow ${
                  course.completed ? 'bg-green-50 border-green-200' : ''
                }`}>
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-2xl">
                      {course.thumbnail}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{course.title}</h3>
                            {course.completed && <CheckCircle size={16} className="text-green-600" />}
                          </div>
                          <p className="text-gray-600 mb-3">{course.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              {getTypeIcon(course.type)}
                              <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen size={16} />
                              <span>{course.modules} modules</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users size={16} />
                              <span>{course.students.toLocaleString()} students</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star size={16} className="text-yellow-500" />
                              <span>{course.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">by {course.instructor}</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Badge className={getLevelColor(course.level)}>
                            {course.level}
                          </Badge>
                          <Badge variant="outline">
                            {course.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Bookmark size={16} />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share size={16} />
                          </Button>
                          <Button className="gap-2">
                            {course.completed ? 'Review' : course.progress > 0 ? 'Continue' : 'Start Course'}
                            <ArrowRight size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="in-progress" className="space-y-4">
              {courses.filter(course => course.progress > 0 && !course.completed).map((course) => (
                <Card key={course.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-xl">
                        {course.thumbnail}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={14} />
                          <span>{course.duration}</span>
                          <span>•</span>
                          <span>{course.progress}% complete</span>
                        </div>
                      </div>
                    </div>
                    <Button className="gap-2">
                      <Play size={16} />
                      Continue Learning
                    </Button>
                  </div>
                  <Progress value={course.progress} className="mt-3 h-2" />
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {courses.filter(course => course.completed).map((course) => (
                <Card key={course.id} className="p-6 bg-green-50 border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle size={24} className="text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Award size={14} />
                          <span>Completed</span>
                          <span>•</span>
                          <span>{course.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" className="gap-2">
                        <Download size={16} />
                        Certificate
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Play size={16} />
                        Review
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="quick-lessons" className="space-y-4">
              {quickLessons.map((lesson) => (
                <Card key={lesson.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Lightbulb size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">{lesson.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock size={12} />
                          <span>{lesson.duration}</span>
                          <Badge variant="outline" className="text-xs">{lesson.type}</Badge>
                          {lesson.completed && <CheckCircle size={12} className="text-green-600" />}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant={lesson.completed ? 'outline' : 'default'}>
                      {lesson.completed ? 'Review' : 'Start'}
                    </Button>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Progress */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Current Focus</h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-sm">
                    📊
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Stock Market Investing</h4>
                    <p className="text-xs text-gray-600">Module 4 of 12</p>
                  </div>
                </div>
                <Progress value={30} className="h-1.5 mb-2" />
                <Button size="sm" className="w-full">
                  Continue Learning
                </Button>
              </div>
            </div>
          </Card>

          {/* Achievements */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              {achievements.filter(a => a.earned).map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-lg">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900">{achievement.title}</h4>
                    <p className="text-xs text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Learning Tools */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Financial Tools</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Calculator size={16} />
                Compound Interest Calculator
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <PieChart size={16} />
                Portfolio Analyzer
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <BarChart3 size={16} />
                Risk Assessment
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <DollarSign size={16} />
                Retirement Calculator
              </Button>
            </div>
          </Card>

          {/* Community */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Learning Community</h3>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users size={12} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Study Groups</span>
                </div>
                <p className="text-xs text-gray-600">Join others learning investing</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <ThumbsUp size={12} className="text-green-600" />
                  </div>
                  <span className="text-sm font-medium">Q&A Forum</span>
                </div>
                <p className="text-xs text-gray-600">Ask questions, get answers</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}