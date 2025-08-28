import React, { useState } from 'react';
import { 
  X,
  DollarSign,
  Calendar,
  Target,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { goalsAPI } from '../services/api';

interface GoalCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function GoalCreationModal({ isOpen, onClose, onSuccess }: GoalCreationModalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    targetDate: '',
    category: '',
    priority: 'medium',
    monthlyContribution: ''
  });

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Goal title is required';
    } else if (formData.title.length < 3) {
      errors.title = 'Goal title must be at least 3 characters';
    }

    if (!formData.targetAmount || isNaN(Number(formData.targetAmount)) || Number(formData.targetAmount) <= 0) {
      errors.targetAmount = 'Please enter a valid target amount';
    }

    if (!formData.targetDate) {
      errors.targetDate = 'Target date is required';
    } else {
      const targetDate = new Date(formData.targetDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (targetDate <= today) {
        errors.targetDate = 'Target date must be in the future';
      }
    }

    if (!formData.category.trim()) {
      errors.category = 'Goal category is required';
    }

    if (formData.monthlyContribution && (isNaN(Number(formData.monthlyContribution)) || Number(formData.monthlyContribution) < 0)) {
      errors.monthlyContribution = 'Please enter a valid monthly contribution amount';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      await goalsAPI.create({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        targetAmount: Number(formData.targetAmount),
        targetDate: formData.targetDate,
        category: formData.category.trim(),
        priority: formData.priority as 'high' | 'medium' | 'low',
        monthlyContribution: formData.monthlyContribution ? Number(formData.monthlyContribution) : undefined
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        targetAmount: '',
        targetDate: '',
        category: '',
        priority: 'medium',
        monthlyContribution: ''
      });

      onSuccess();
      onClose();

    } catch (error: any) {
      console.error('Goal creation error:', error);
      setError(error.response?.data?.error || 'Failed to create goal. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) {
      setError(null);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setFormData({
        title: '',
        description: '',
        targetAmount: '',
        targetDate: '',
        category: '',
        priority: 'medium',
        monthlyContribution: ''
      });
      setValidationErrors({});
      setError(null);
      onClose();
    }
  };

  // Calculate monthly contribution suggestion
  const calculateMonthlySuggestion = () => {
    if (formData.targetAmount && formData.targetDate) {
      const targetAmount = Number(formData.targetAmount);
      const targetDate = new Date(formData.targetDate);
      const today = new Date();
      const monthsToTarget = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
      
      if (monthsToTarget > 0) {
        return (targetAmount / monthsToTarget).toFixed(2);
      }
    }
    return null;
  };

  const suggestedMonthly = calculateMonthlySuggestion();

  const goalCategories = [
    'Emergency Fund',
    'Vacation',
    'House Down Payment',
    'Car Purchase',
    'Education',
    'Retirement',
    'Investment',
    'Debt Payoff',
    'Wedding',
    'Home Improvement',
    'Other'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Create Financial Goal</h2>
            <p className="text-sm text-gray-600 mt-1">Set a target and track your progress</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose} disabled={isCreating}>
            <X size={20} />
          </Button>
        </div>

        <div className="p-6">
          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Goal Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goal Title *
              </label>
              <Input
                type="text"
                name="title"
                placeholder="e.g., Emergency Fund, Vacation to Europe"
                className="w-full"
                value={formData.title}
                onChange={handleInputChange}
                disabled={isCreating}
              />
              {validationErrors.title && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                placeholder="Add more details about your goal..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                disabled={isCreating}
              />
            </div>

            {/* Target Amount and Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Amount *
                </label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="number"
                    name="targetAmount"
                    placeholder="5000"
                    className="pl-8"
                    min="1"
                    step="0.01"
                    value={formData.targetAmount}
                    onChange={handleInputChange}
                    disabled={isCreating}
                  />
                </div>
                {validationErrors.targetAmount && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.targetAmount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Date *
                </label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="date"
                    name="targetDate"
                    className="pl-8"
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.targetDate}
                    onChange={handleInputChange}
                    disabled={isCreating}
                  />
                </div>
                {validationErrors.targetDate && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.targetDate}</p>
                )}
              </div>
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  value={formData.category}
                  onChange={handleInputChange}
                  disabled={isCreating}
                >
                  <option value="">Select a category</option>
                  {goalCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {validationErrors.category && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  value={formData.priority}
                  onChange={handleInputChange}
                  disabled={isCreating}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Monthly Contribution */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Contribution (Optional)
              </label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="number"
                  name="monthlyContribution"
                  placeholder={suggestedMonthly ? `Suggested: ${suggestedMonthly}` : '250'}
                  className="pl-8"
                  min="0"
                  step="0.01"
                  value={formData.monthlyContribution}
                  onChange={handleInputChange}
                  disabled={isCreating}
                />
              </div>
              {suggestedMonthly && (
                <p className="mt-1 text-sm text-gray-600">
                  💡 Suggestion: Save ${suggestedMonthly}/month to reach your goal
                </p>
              )}
              {validationErrors.monthlyContribution && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.monthlyContribution}</p>
              )}
            </div>

            {/* Goal Preview */}
            {formData.title && formData.targetAmount && (
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <Target size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900 mb-1">Goal Preview</h4>
                    <p className="text-sm text-blue-800">
                      <strong>{formData.title}</strong> - Target: ${Number(formData.targetAmount).toLocaleString()}
                      {formData.targetDate && (
                        <span> by {new Date(formData.targetDate).toLocaleDateString()}</span>
                      )}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4">
              <Button 
                type="button"
                variant="outline" 
                onClick={handleClose}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isCreating}
                className="gap-2"
              >
                {isCreating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Target size={16} />
                    Create Goal
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}