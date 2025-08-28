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
    <div className="p-8 max-w-6xl mx-auto opacity-50 pointer-events-none" style={{ background: 'var(--background-primary)', minHeight: '100vh' }}>
      {/* Coming Soon Header */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>Financial Education</h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Feature coming soon</p>
        </div>
        <Button 
          size="lg" 
          className="cursor-not-allowed" 
          disabled
          style={{ background: 'var(--text-secondary)', opacity: 0.5 }}
        >
          Coming Soon
        </Button>
      </div>

      {/* Planned Features */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-8 text-center" style={{ color: 'var(--text-secondary)' }}>Planned Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comingSoonFeatures.map((feature, index) => (
            <div key={index} className="finora-card p-6 text-center" style={{ opacity: 0.7 }}>
              <div className="mb-4 flex justify-center text-gray-400">
                {feature.icon}
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Current Status */}
      <div className="finora-card p-8" style={{ opacity: 0.7 }}>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>Development Status</h3>
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
      </div>
    </div>
  );
}