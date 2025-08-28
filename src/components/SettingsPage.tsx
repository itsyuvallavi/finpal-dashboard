import React, { useState, useEffect } from 'react';
import { 
  Settings,
  User,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

export default function SettingsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    age: '',
    maritalStatus: '',
    children: '',
    location: '',
    occupation: '',
    annualIncome: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/auth/profile');
      const userData = response.data.user;
      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
        age: userData.age?.toString() || '',
        maritalStatus: userData.maritalStatus || '',
        children: userData.children?.toString() || '',
        location: userData.location || '',
        occupation: userData.occupation || '',
        annualIncome: userData.annualIncome || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile data' });
    } finally {
      setIsLoading(false);
    }
  };

  const validateProfileForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!profileData.name.trim()) {
      errors.name = 'Name is required';
    } else if (profileData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!profileData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      errors.email = 'Invalid email format';
    }

    if (profileData.age && (parseInt(profileData.age) < 18 || parseInt(profileData.age) > 120)) {
      errors.age = 'Age must be between 18 and 120';
    }

    if (profileData.children && parseInt(profileData.children) < 0) {
      errors.children = 'Number of children cannot be negative';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const updateData = {
        name: profileData.name,
        email: profileData.email,
        age: profileData.age ? parseInt(profileData.age) : null,
        maritalStatus: profileData.maritalStatus || null,
        children: profileData.children ? parseInt(profileData.children) : null,
        location: profileData.location || null,
        occupation: profileData.occupation || null,
        annualIncome: profileData.annualIncome || null,
      };

      await api.put('/auth/profile', updateData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      console.error('Profile update error:', error);
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Account Settings</h1>
        <p className="text-gray-600">Manage your profile and account preferences</p>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`flex items-center gap-2 p-4 mb-6 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
          ) : (
            <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          )}
          <p className={`text-sm ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
            {message.text}
          </p>
        </div>
      )}

      {/* Profile Information */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <User size={20} className="text-gray-600" />
          <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <Input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="hover:border-gray-400 focus:border-blue-500 transition-colors cursor-text"
                disabled={isSaving}
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="hover:border-gray-400 focus:border-blue-500 transition-colors cursor-text"
                disabled={isSaving}
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="border-t pt-6">
            <h3 className="text-md font-medium text-gray-900 mb-4">Personal Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <Input
                  type="number"
                  name="age"
                  value={profileData.age}
                  onChange={handleInputChange}
                  placeholder="Your age"
                  min="18"
                  max="120"
                  className="hover:border-gray-400 focus:border-blue-500 transition-colors cursor-text"
                  disabled={isSaving}
                />
                {validationErrors.age && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.age}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marital Status
                </label>
                <select
                  name="maritalStatus"
                  value={profileData.maritalStatus}
                  onChange={handleSelectChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md hover:border-gray-400 focus:border-blue-500 transition-colors cursor-pointer bg-white"
                  disabled={isSaving}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Children
                </label>
                <Input
                  type="number"
                  name="children"
                  value={profileData.children}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  max="20"
                  className="hover:border-gray-400 focus:border-blue-500 transition-colors cursor-text"
                  disabled={isSaving}
                />
                {validationErrors.children && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.children}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <Input
                  type="text"
                  name="location"
                  value={profileData.location}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                  className="hover:border-gray-400 focus:border-blue-500 transition-colors cursor-text"
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Occupation
              </label>
              <Input
                type="text"
                name="occupation"
                value={profileData.occupation}
                onChange={handleInputChange}
                placeholder="Your profession or job title"
                className="hover:border-gray-400 focus:border-blue-500 transition-colors cursor-text"
                disabled={isSaving}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Income
              </label>
              <select
                name="annualIncome"
                value={profileData.annualIncome}
                onChange={handleSelectChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md hover:border-gray-400 focus:border-blue-500 transition-colors cursor-pointer bg-white"
                disabled={isSaving}
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

          <div className="flex justify-end pt-6 border-t">
            <Button 
              type="submit"
              disabled={isSaving}
              className="gap-2 hover:bg-gray-800 transition-colors cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}