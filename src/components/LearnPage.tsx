import React from 'react';
import { 
  BookOpen,
  Play,
  Award,
  Brain,
  Target,
  Users
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

export default function LearnPage() {
  const comingSoonFeatures = [
    {
      icon: <BookOpen size={24} />,
      title: 'Interactive Courses',
      description: 'Comprehensive financial education with video lessons and quizzes'
    },
    {
      icon: <Play size={24} />,
      title: 'Progress Tracking',
      description: 'Track your learning journey and see your knowledge grow'
    },
    {
      icon: <Award size={24} />,
      title: 'Achievements',
      description: 'Earn badges and certificates as you master financial concepts'
    },
    {
      icon: <Brain size={24} />,
      title: 'Personalized Learning',
      description: 'AI-powered recommendations based on your goals and interests'
    },
    {
      icon: <Target size={24} />,
      title: 'Skill Assessments',
      description: 'Test your knowledge with interactive quizzes and simulations'
    },
    {
      icon: <Users size={24} />,
      title: 'Community Learning',
      description: 'Connect with other learners and share your financial journey'
    }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto opacity-50 pointer-events-none">
      {/* Coming Soon Header */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold text-gray-500 mb-2">Financial Education</h1>
          <p className="text-lg text-gray-400">Feature coming soon</p>
        </div>
        <Button size="lg" className="bg-gray-400 hover:bg-gray-400 cursor-not-allowed" disabled>
          Coming Soon
        </Button>
      </div>

      {/* Planned Features */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-500 mb-8 text-center">Planned Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comingSoonFeatures.map((feature, index) => (
            <Card key={index} className="p-6 text-center bg-gray-50 border-gray-200">
              <div className="mb-4 flex justify-center text-gray-400">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-500 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Current Status */}
      <Card className="p-8 bg-gray-100 border-gray-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-500 mb-4">Development Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <span className="text-sm text-gray-400">Course Structure</span>
              <span className="text-sm font-medium text-gray-400">📅 Planned</span>
            </div>
            <div className="flex items-center justify-between max-w-md mx-auto">
              <span className="text-sm text-gray-400">Content Creation</span>
              <span className="text-sm font-medium text-gray-400">📅 Planned</span>
            </div>
            <div className="flex items-center justify-between max-w-md mx-auto">
              <span className="text-sm text-gray-400">Interactive Features</span>
              <span className="text-sm font-medium text-gray-400">📅 Planned</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}