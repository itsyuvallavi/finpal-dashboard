import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  Brain, 
  TrendingUp, 
  Shield, 
  Target,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function AuthPage() {
  const { login, register, error, isLoading, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    age: '',
    maritalStatus: '',
    children: '',
    location: '',
    occupation: '',
    annualIncome: ''
  });
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp) {
      if (!formData.name) {
        errors.name = 'Name is required';
      } else if (formData.name.length < 2) {
        errors.name = 'Name must be at least 2 characters';
      }

      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }

      if (formData.age && (parseInt(formData.age) < 18 || parseInt(formData.age) > 120)) {
        errors.age = 'Age must be between 18 and 120';
      }

      if (formData.children && parseInt(formData.children) < 0) {
        errors.children = 'Number of children cannot be negative';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    clearError();

    try {
      if (isSignUp) {
        await register(formData.name, formData.email, formData.password);
      } else {
        await login(formData.email, formData.password);
      }
    } catch (err) {
      // Error is handled by the useAuth hook
      console.error('Authentication error:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) {
      clearError();
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user changes selection
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) {
      clearError();
    }
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Get personalized financial advice based on your spending patterns and goals.'
    },
    {
      icon: TrendingUp,
      title: 'Investment Education',
      description: 'Learn to invest confidently with our progressive education system.'
    },
    {
      icon: Target,
      title: 'Smart Goal Tracking',
      description: 'Set and achieve financial goals with AI-powered progress tracking.'
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Your financial data is protected with enterprise-grade encryption.'
    }
  ];

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--background-primary)' }}>
      {/* Left Panel - Features */}
      <div className="hidden lg:flex lg:w-1/2 finora-sidebar p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <Brain size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">FinPal</h1>
              <p className="text-white/80 text-sm">Your Personal Finance Dashboard</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-semibold text-white mb-4">
                Transform Your Financial Future
              </h2>
              <p className="text-white/80 text-lg leading-relaxed">
                Join thousands of users who've mastered their finances with AI-powered insights, 
                personalized education, and smart goal tracking.
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                    <feature.icon size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">{feature.title}</h3>
                    <p className="text-white/70 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-white/60 text-sm">
          <p>&copy; 2025 FinPal. Trusted by 50,000+ users worldwide.</p>
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <div className="flex flex-col items-center justify-center mb-4">
              <div className="p-2 bg-purple-600 rounded-lg mb-3">
                <Brain size={24} className="text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>FinPal</h1>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Your Personal Finance Dashboard</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                {isSignUp 
                  ? 'Enter your details to create your account'
                  : 'Enter your email and password to access your account'
                }
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-2 p-4 border rounded-lg" style={{ 
                background: 'rgba(239, 68, 68, 0.1)', 
                borderColor: 'rgba(239, 68, 68, 0.3)' 
              }}>
                <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Full Name
                  </label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    style={{ 
                      background: 'var(--background-card)', 
                      color: 'var(--text-primary)',
                      borderColor: 'var(--border-primary)'
                    }}
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  {validationErrors.name && (
                    <p className="mt-1 text-sm text-red-400">{validationErrors.name}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  style={{ 
                    background: 'var(--background-card)', 
                    color: 'var(--text-primary)',
                    borderColor: 'var(--border-primary)'
                  }}
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-400">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder={isSignUp ? 'Create a password' : 'Enter your password'}
                    className="w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    style={{ 
                      background: 'var(--background-card)', 
                      color: 'var(--text-primary)',
                      borderColor: 'var(--border-primary)'
                    }}
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-gray-300"
                    style={{ color: 'var(--text-secondary)' }}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-400">{validationErrors.password}</p>
                )}
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Confirm Password
                  </label>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    style={{ 
                      background: 'var(--background-card)', 
                      color: 'var(--text-primary)',
                      borderColor: 'var(--border-primary)'
                    }}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  {validationErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-400">{validationErrors.confirmPassword}</p>
                  )}
                </div>
              )}

              {isSignUp && (
                <div className="border-t pt-6" style={{ borderColor: 'var(--border-primary)' }}>
                  <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>Personal Information</h3>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                    This information helps us provide personalized financial insights and recommendations.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                        Age
                      </label>
                      <Input
                        type="number"
                        name="age"
                        placeholder="Your age"
                        min="18"
                        max="120"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        style={{ 
                          background: 'var(--background-card)', 
                          color: 'var(--text-primary)',
                          borderColor: 'var(--border-primary)'
                        }}
                        value={formData.age}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      {validationErrors.age && (
                        <p className="mt-1 text-sm text-red-400">{validationErrors.age}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                        Marital Status
                      </label>
                      <select
                        name="maritalStatus"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        style={{ 
                          background: 'var(--background-card)', 
                          color: 'var(--text-primary)',
                          borderColor: 'var(--border-primary)'
                        }}
                        value={formData.maritalStatus}
                        onChange={handleSelectChange}
                        disabled={isLoading}
                      >
                        <option value="">Select status</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                        <option value="partnership">Partnership</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                        Number of Children
                      </label>
                      <Input
                        type="number"
                        name="children"
                        placeholder="0"
                        min="0"
                        max="20"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        style={{ 
                          background: 'var(--background-card)', 
                          color: 'var(--text-primary)',
                          borderColor: 'var(--border-primary)'
                        }}
                        value={formData.children}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      {validationErrors.children && (
                        <p className="mt-1 text-sm text-red-400">{validationErrors.children}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                        Location
                      </label>
                      <Input
                        type="text"
                        name="location"
                        placeholder="City, Country"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        style={{ 
                          background: 'var(--background-card)', 
                          color: 'var(--text-primary)',
                          borderColor: 'var(--border-primary)'
                        }}
                        value={formData.location}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      Occupation
                    </label>
                    <Input
                      type="text"
                      name="occupation"
                      placeholder="Your profession or job title"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      style={{ 
                        background: 'var(--background-card)', 
                        color: 'var(--text-primary)',
                        borderColor: 'var(--border-primary)'
                      }}
                      value={formData.occupation}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      Annual Income (Optional)
                    </label>
                    <select
                      name="annualIncome"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      style={{ 
                        background: 'var(--background-card)', 
                        color: 'var(--text-primary)',
                        borderColor: 'var(--border-primary)'
                      }}
                      value={formData.annualIncome}
                      onChange={handleSelectChange}
                      disabled={isLoading}
                    >
                      <option value="">Prefer not to say</option>
                      <option value="under-25k">Under $25,000</option>
                      <option value="25k-50k">$25,000 - $50,000</option>
                      <option value="50k-75k">$50,000 - $75,000</option>
                      <option value="75k-100k">$75,000 - $100,000</option>
                      <option value="100k-150k">$100,000 - $150,000</option>
                      <option value="150k-250k">$150,000 - $250,000</option>
                      <option value="over-250k">Over $250,000</option>
                    </select>
                  </div>
                </div>
              )}

              {!isSignUp && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      disabled={isLoading}
                    />
                    <label htmlFor="remember-me" className="text-sm" style={{ color: 'var(--text-primary)' }}>
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm hover:underline"
                    style={{ color: 'var(--text-secondary)' }}
                    disabled={isLoading}
                  >
                    Forgot Password
                  </button>
                </div>
              )}

              {isSignUp && (
                <div className="flex items-start gap-3">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
                    disabled={isLoading}
                  />
                  <label htmlFor="terms" className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    I agree to the{' '}
                    <button type="button" className="hover:underline font-medium" style={{ color: 'var(--text-primary)' }}>
                      Terms of Service
                    </button>
                    {' '}and{' '}
                    <button type="button" className="hover:underline font-medium" style={{ color: 'var(--text-primary)' }}>
                      Privacy Policy
                    </button>
                  </label>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 mt-6 font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'var(--sidebar-primary)', color: 'white' }}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    {isSignUp ? 'Creating account...' : 'Signing in...'}
                  </div>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </Button>
            </form>

            <div className="text-center mt-8">
              <p style={{ color: 'var(--text-secondary)' }}>
                {isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}{' '}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setFormData({ 
                      email: '', 
                      password: '', 
                      confirmPassword: '', 
                      name: '',
                      age: '',
                      maritalStatus: '',
                      children: '',
                      location: '',
                      occupation: '',
                      annualIncome: ''
                    });
                    setValidationErrors({});
                    clearError();
                  }}
                  className="font-semibold hover:underline"
                  style={{ color: 'var(--text-primary)' }}
                  disabled={isLoading}
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>

          <p className="text-center text-sm mt-8" style={{ color: 'var(--text-secondary)' }}>
            Bank-level security. Your data is protected.
          </p>
        </div>
      </div>
    </div>
  );
}