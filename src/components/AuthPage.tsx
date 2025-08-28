import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from "motion/react";
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
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function AuthPage() {
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
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Features */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-12 flex-col justify-between"
      >
        <div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-3 mb-12"
          >
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">FinPal</h1>
              <p className="text-white/80 text-sm">Your Personal Finance AI</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-8"
          >
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
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  className="flex items-start gap-4"
                >
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                    <feature.icon size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">{feature.title}</h3>
                    <p className="text-white/70 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-white/60 text-sm"
        >
          <p>&copy; 2025 FinPal. Trusted by 50,000+ users worldwide.</p>
        </motion.div>
      </motion.div>

      {/* Right Panel - Auth Forms */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center mb-4"
            >
              <div className="p-2 bg-primary rounded-lg mb-3">
                <TrendingUp size={24} className="text-primary-foreground" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-semibold">FinPal</h1>
                <p className="text-sm text-muted-foreground">Your Personal Finance AI</p>
              </div>
            </motion.div>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </CardTitle>
              <p className="text-muted-foreground">
                {isSignUp 
                  ? 'Enter your details to create your account'
                  : 'Enter your email and password to access your account'
                }
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Error Display */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-4 border border-destructive/50 bg-destructive/10 rounded-lg"
                >
                  <AlertCircle size={16} className="text-destructive flex-shrink-0" />
                  <p className="text-sm text-destructive">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full"
                    />
                    {validationErrors.name && (
                      <p className="mt-1 text-sm text-destructive">{validationErrors.name}</p>
                    )}
                  </motion.div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full"
                  />
                  {validationErrors.email && (
                    <p className="mt-1 text-sm text-destructive">{validationErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder={isSignUp ? 'Create a password' : 'Enter your password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="mt-1 text-sm text-destructive">{validationErrors.password}</p>
                  )}
                </div>

                {isSignUp && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-medium mb-2">
                      Confirm Password
                    </label>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full"
                    />
                    {validationErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-destructive">{validationErrors.confirmPassword}</p>
                    )}
                  </motion.div>
                )}

                {!isSignUp && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4"
                        disabled={isLoading}
                      />
                      <label htmlFor="remember-me" className="text-sm">
                        Remember me
                      </label>
                    </div>
                    <button
                      type="button"
                      className="text-sm hover:underline text-primary"
                      disabled={isLoading}
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {isSignUp && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start space-x-2"
                  >
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 mt-0.5"
                      disabled={isLoading}
                    />
                    <label htmlFor="terms" className="text-sm">
                      I agree to the{' '}
                      <button type="button" className="hover:underline font-medium text-primary">
                        Terms of Service
                      </button>
                      {' '}and{' '}
                      <button type="button" className="hover:underline font-medium text-primary">
                        Privacy Policy
                      </button>
                    </label>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
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

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
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
                    className="font-semibold hover:underline text-primary"
                    disabled={isLoading}
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Bank-level security. Your data is protected.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}