import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Smartphone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Edit, 
  Save, 
  X, 
  Check, 
  AlertTriangle, 
  Settings, 
  Moon, 
  Sun, 
  Globe, 
  Download, 
  Trash2,
  Link,
  Unlink,
  Key,
  Camera
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';

export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1992-03-15',
    location: 'Seattle, WA'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    budgetAlerts: true,
    goalReminders: true,
    weeklyReports: true,
    investmentUpdates: false,
    marketNews: true,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    biometricAuth: true,
    sessionTimeout: '30min',
    loginAlerts: true
  });

  const connectedAccounts = [
    {
      id: 1,
      name: 'Chase Checking',
      type: 'bank',
      lastSync: '2 hours ago',
      status: 'connected',
      balance: '$2,450.00'
    },
    {
      id: 2,
      name: 'Capital One Credit Card',
      type: 'credit',
      lastSync: '1 day ago',
      status: 'connected',
      balance: '-$1,234.56'
    },
    {
      id: 3,
      name: 'Vanguard 401k',
      type: 'investment',
      lastSync: '3 days ago',
      status: 'warning',
      balance: '$45,678.90'
    }
  ];

  const handleProfileSave = () => {
    setIsEditingProfile(false);
    // Here you would typically save to API
  };

  const handleNotificationToggle = (key: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleSecurityToggle = (key: string) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  return (
    <div className="p-6 max-w-4xl">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
              <Button 
                variant="outline" 
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="gap-2"
              >
                {isEditingProfile ? <X size={16} /> : <Edit size={16} />}
                {isEditingProfile ? 'Cancel' : 'Edit'}
              </Button>
            </div>

            <div className="flex items-start gap-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center gap-3">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="" alt="Profile" />
                  <AvatarFallback className="text-xl bg-blue-100 text-blue-600">
                    {profileData.firstName[0]}{profileData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                {isEditingProfile && (
                  <Button variant="outline" size="sm" className="gap-2">
                    <Camera size={14} />
                    Change Photo
                  </Button>
                )}
              </div>

              {/* Profile Form */}
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData(prev => ({...prev, firstName: e.target.value}))}
                    disabled={!isEditingProfile}
                    className={!isEditingProfile ? 'bg-gray-50' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData(prev => ({...prev, lastName: e.target.value}))}
                    disabled={!isEditingProfile}
                    className={!isEditingProfile ? 'bg-gray-50' : ''}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({...prev, email: e.target.value}))}
                    disabled={!isEditingProfile}
                    className={!isEditingProfile ? 'bg-gray-50' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({...prev, phone: e.target.value}))}
                    disabled={!isEditingProfile}
                    className={!isEditingProfile ? 'bg-gray-50' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({...prev, location: e.target.value}))}
                    disabled={!isEditingProfile}
                    className={!isEditingProfile ? 'bg-gray-50' : ''}
                  />
                </div>
              </div>
            </div>

            {isEditingProfile && (
              <div className="flex items-center gap-3 mt-6 pt-6 border-t">
                <Button onClick={handleProfileSave} className="gap-2">
                  <Save size={16} />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </Card>

          {/* Change Password */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
            <div className="space-y-4 max-w-md">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Enter current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>
              <Button className="gap-2">
                <Lock size={16} />
                Update Password
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
            
            <div className="space-y-6">
              {/* Budget & Goals */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Budget & Goals</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Budget Alerts</Label>
                      <p className="text-sm text-gray-600">Get notified when you're approaching budget limits</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.budgetAlerts}
                      onCheckedChange={() => handleNotificationToggle('budgetAlerts')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Goal Reminders</Label>
                      <p className="text-sm text-gray-600">Periodic reminders about your financial goals</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.goalReminders}
                      onCheckedChange={() => handleNotificationToggle('goalReminders')}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Reports & Insights */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Reports & Insights</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Weekly Reports</Label>
                      <p className="text-sm text-gray-600">Summary of your weekly spending and progress</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.weeklyReports}
                      onCheckedChange={() => handleNotificationToggle('weeklyReports')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Investment Updates</Label>
                      <p className="text-sm text-gray-600">Portfolio performance and market updates</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.investmentUpdates}
                      onCheckedChange={() => handleNotificationToggle('investmentUpdates')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Market News</Label>
                      <p className="text-sm text-gray-600">Important financial news and market updates</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.marketNews}
                      onCheckedChange={() => handleNotificationToggle('marketNews')}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Delivery Methods */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Delivery Methods</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail size={20} className="text-gray-600" />
                      <div>
                        <Label className="font-medium">Email Notifications</Label>
                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell size={20} className="text-gray-600" />
                      <div>
                        <Label className="font-medium">Push Notifications</Label>
                        <p className="text-sm text-gray-600">Receive push notifications on your device</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={() => handleNotificationToggle('pushNotifications')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone size={20} className="text-gray-600" />
                      <div>
                        <Label className="font-medium">SMS Notifications</Label>
                        <p className="text-sm text-gray-600">Receive notifications via text message</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={() => handleNotificationToggle('smsNotifications')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
            
            <div className="space-y-6">
              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-blue-600" />
                  <div>
                    <Label className="font-medium">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {securitySettings.twoFactorAuth && (
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  )}
                  <Switch 
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={() => handleSecurityToggle('twoFactorAuth')}
                  />
                </div>
              </div>

              {/* Biometric Authentication */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Key size={20} className="text-green-600" />
                  <div>
                    <Label className="font-medium">Biometric Authentication</Label>
                    <p className="text-sm text-gray-600">Use fingerprint or face recognition to sign in</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {securitySettings.biometricAuth && (
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  )}
                  <Switch 
                    checked={securitySettings.biometricAuth}
                    onCheckedChange={() => handleSecurityToggle('biometricAuth')}
                  />
                </div>
              </div>

              {/* Session Timeout */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Lock size={20} className="text-orange-600" />
                    <div>
                      <Label className="font-medium">Session Timeout</Label>
                      <p className="text-sm text-gray-600">Automatically sign out after period of inactivity</p>
                    </div>
                  </div>
                </div>
                <Select value={securitySettings.sessionTimeout}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15min">15 minutes</SelectItem>
                    <SelectItem value="30min">30 minutes</SelectItem>
                    <SelectItem value="1hour">1 hour</SelectItem>
                    <SelectItem value="4hours">4 hours</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Login Alerts */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-red-600" />
                  <div>
                    <Label className="font-medium">Login Alerts</Label>
                    <p className="text-sm text-gray-600">Get notified of new sign-ins to your account</p>
                  </div>
                </div>
                <Switch 
                  checked={securitySettings.loginAlerts}
                  onCheckedChange={() => handleSecurityToggle('loginAlerts')}
                />
              </div>
            </div>
          </Card>

          {/* Active Sessions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Smartphone size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Current Session</p>
                    <p className="text-sm text-gray-600">Chrome on Mac • Seattle, WA</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <Smartphone size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">iPhone App</p>
                    <p className="text-sm text-gray-600">Last active 2 hours ago • Seattle, WA</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">End Session</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Accounts Tab */}
        <TabsContent value="accounts" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Connected Accounts</h3>
              <Button className="gap-2">
                <Link size={16} />
                Link New Account
              </Button>
            </div>

            <div className="space-y-4">
              {connectedAccounts.map((account) => (
                <Card key={account.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${
                        account.type === 'bank' ? 'bg-blue-100' :
                        account.type === 'credit' ? 'bg-red-100' : 'bg-green-100'
                      }`}>
                        <CreditCard size={20} className={`${
                          account.type === 'bank' ? 'text-blue-600' :
                          account.type === 'credit' ? 'text-red-600' : 'text-green-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{account.name}</h4>
                        <p className="text-sm text-gray-600">Last synced: {account.lastSync}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{account.balance}</p>
                        <div className="flex items-center gap-2">
                          {account.status === 'connected' ? (
                            <Badge className="bg-green-100 text-green-800">Connected</Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800">Needs Attention</Badge>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Unlink size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  {account.status === 'warning' && (
                    <Alert className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        This account needs to be re-authenticated. Please reconnect to continue syncing data.
                      </AlertDescription>
                    </Alert>
                  )}
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">App Preferences</h3>
            
            <div className="space-y-6">
              {/* Theme */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isDarkMode ? <Moon size={20} className="text-gray-600" /> : <Sun size={20} className="text-yellow-600" />}
                  <div>
                    <Label className="font-medium">Dark Mode</Label>
                    <p className="text-sm text-gray-600">Toggle between light and dark themes</p>
                  </div>
                </div>
                <Switch 
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                />
              </div>

              <Separator />

              {/* Language */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Globe size={20} className="text-gray-600" />
                  <div>
                    <Label className="font-medium">Language</Label>
                    <p className="text-sm text-gray-600">Choose your preferred language</p>
                  </div>
                </div>
                <Select defaultValue="en">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Currency */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign size={20} className="text-gray-600" />
                  <div>
                    <Label className="font-medium">Default Currency</Label>
                    <p className="text-sm text-gray-600">Primary currency for your accounts</p>
                  </div>
                </div>
                <Select defaultValue="usd">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD - US Dollar</SelectItem>
                    <SelectItem value="eur">EUR - Euro</SelectItem>
                    <SelectItem value="gbp">GBP - British Pound</SelectItem>
                    <SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Data & Privacy */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Data & Privacy</h3>
            
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Download size={16} />
                Export My Data
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 text-red-600 hover:text-red-700">
                <Trash2 size={16} />
                Delete Account
              </Button>
            </div>

            <Alert className="mt-4">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your privacy is important to us. We use bank-level encryption and never share your personal data with third parties.
              </AlertDescription>
            </Alert>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}