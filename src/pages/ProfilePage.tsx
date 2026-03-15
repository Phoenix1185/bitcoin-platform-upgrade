import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store';
import { useSearchParams } from 'react-router-dom';
import Header from '@/sections/Header';
import Footer from '@/sections/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { SUPPORTED_CURRENCIES } from '@/lib/cryptoPrices';
import { supabase } from '@/lib/supabase';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Shield, 
  Bell, 
  Lock,
  Globe,
  CheckCircle,
  XCircle,
  Upload,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';

export default function ProfilePage() {
  const { state, dispatch } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: state.user?.name || '',
    email: state.user?.email || '',
    phoneNumber: state.user?.phoneNumber || '',
    country: state.user?.country || '',
    dateOfBirth: state.user?.dateOfBirth || '',
  });
  
  const [settings, setSettings] = useState({
    emailNotifications: state.user?.emailNotifications ?? true,
    smsNotifications: state.user?.smsNotifications ?? false,
    twoFactorEnabled: state.user?.twoFactorEnabled ?? false,
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Update active tab when URL changes
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const user = state.user;
  if (!user) {
    return (
      <div className="min-h-screen bg-crypto-dark flex items-center justify-center">
        <p className="text-gray-400">Please log in to view your profile</p>
      </div>
    );
  }

  const handleSaveProfile = () => {
    dispatch({
      type: 'UPDATE_USER',
      payload: {
        ...formData,
      },
    });
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleSaveSettings = () => {
    dispatch({
      type: 'UPDATE_USER',
      payload: settings,
    });
    toast.success('Settings saved successfully');
  };

  const handleCurrencyChange = (code: string) => {
    dispatch({
      type: 'UPDATE_USER',
      payload: { preferredCurrency: code },
    });
    toast.success(`Currency changed to ${code}`);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In production, upload to storage
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch({
          type: 'UPDATE_USER',
          payload: { avatar: reader.result as string },
        });
        toast.success('Profile picture updated');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePassword = async () => {
    // Validate passwords
    if (!passwordData.currentPassword) {
      toast.error('Please enter your current password');
      return;
    }
    if (!passwordData.newPassword) {
      toast.error('Please enter a new password');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsChangingPassword(true);

    try {
      // Update password using Supabase
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) {
        toast.error(error.message);
        setIsChangingPassword(false);
        return;
      }

      toast.success('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      toast.error(error?.message || 'Failed to change password');
    }

    setIsChangingPassword(false);
  };

  const getKycStatusBadge = () => {
    switch (user.kycStatus) {
      case 'approved':
        return <Badge className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" /> Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white"><AlertTriangle className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Not Submitted</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-crypto-dark">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              My <span className="text-gradient">Profile</span>
            </h1>
            <p className="text-gray-400">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-crypto-card border-crypto-border sticky top-24">
                <CardContent className="p-6 text-center">
                  <div className="relative inline-block mb-4">
                    <div 
                      onClick={handleAvatarClick}
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-crypto-yellow to-crypto-yellow-dark flex items-center justify-center text-3xl font-bold text-crypto-dark cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <button 
                      onClick={handleAvatarClick}
                      className="absolute bottom-0 right-0 w-8 h-8 bg-crypto-dark border border-crypto-border rounded-full flex items-center justify-center hover:bg-crypto-card transition-colors"
                    >
                      <Camera className="w-4 h-4 text-gray-400" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  
                  <h3 className="text-white font-semibold text-lg">{user.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">{user.email}</p>
                  
                  <div className="flex justify-center gap-2 mb-4">
                    {getKycStatusBadge()}
                    {user.isAdmin && (
                      <Badge className="bg-crypto-yellow text-crypto-dark">Admin</Badge>
                    )}
                  </div>

                  <div className="text-left space-y-3 pt-4 border-t border-crypto-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Balance</span>
                      <span className="text-white font-medium">${user.balance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Invested</span>
                      <span className="text-crypto-yellow font-medium">${user.totalInvested.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Returns</span>
                      <span className="text-green-500 font-medium">${user.totalReturns.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-crypto-card border border-crypto-border w-full justify-start flex-wrap">
                  <TabsTrigger value="profile" className="data-[state=active]:bg-crypto-yellow data-[state=active]:text-crypto-dark">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="account" className="data-[state=active]:bg-crypto-yellow data-[state=active]:text-crypto-dark">
                    <Shield className="w-4 h-4 mr-2" />
                    Account
                  </TabsTrigger>
                  <TabsTrigger value="preferences" className="data-[state=active]:bg-crypto-yellow data-[state=active]:text-crypto-dark">
                    <Globe className="w-4 h-4 mr-2" />
                    Preferences
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="data-[state=active]:bg-crypto-yellow data-[state=active]:text-crypto-dark">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="security" className="data-[state=active]:bg-crypto-yellow data-[state=active]:text-crypto-dark">
                    <Lock className="w-4 h-4 mr-2" />
                    Security
                  </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile">
                  <Card className="bg-crypto-card border-crypto-border">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-white">Personal Information</CardTitle>
                        <CardDescription className="text-gray-400">Update your personal details</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                        className="border-crypto-border text-white hover:bg-crypto-dark"
                      >
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-gray-400">Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              disabled={!isEditing}
                              className="pl-10 bg-crypto-dark border-crypto-border text-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-400">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              disabled={!isEditing}
                              className="pl-10 bg-crypto-dark border-crypto-border text-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-400">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                              type="tel"
                              value={formData.phoneNumber}
                              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                              disabled={!isEditing}
                              placeholder="+1 (555) 000-0000"
                              className="pl-10 bg-crypto-dark border-crypto-border text-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-400">Country</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <select
                              value={formData.country}
                              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                              disabled={!isEditing}
                              className="w-full pl-10 pr-4 py-2 bg-crypto-dark border border-crypto-border text-white rounded-md"
                            >
                              <option value="">Select Country</option>
                              <option value="US">United States</option>
                              <option value="UK">United Kingdom</option>
                              <option value="CA">Canada</option>
                              <option value="AU">Australia</option>
                              <option value="DE">Germany</option>
                              <option value="FR">France</option>
                              <option value="JP">Japan</option>
                              <option value="NG">Nigeria</option>
                              <option value="ZA">South Africa</option>
                              <option value="BR">Brazil</option>
                              <option value="IN">India</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-400">Date of Birth</Label>
                          <Input
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            disabled={!isEditing}
                            className="bg-crypto-dark border-crypto-border text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-400">Member Since</Label>
                          <Input
                            value={new Date(user.createdAt).toLocaleDateString()}
                            disabled
                            className="bg-crypto-dark border-crypto-border text-gray-500"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* KYC Section */}
                  <Card className="bg-crypto-card border-crypto-border mt-6">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Shield className="w-5 h-5 text-crypto-yellow" />
                        KYC Verification
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Complete verification to unlock all features
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between p-4 bg-crypto-dark rounded-lg">
                        <div>
                          <p className="text-white font-medium">Verification Status</p>
                          <p className="text-gray-400 text-sm">
                            {user.kycStatus === 'approved' 
                              ? 'Your account is fully verified' 
                              : user.kycStatus === 'pending'
                              ? 'Your documents are under review'
                              : 'Complete verification to withdraw funds'}
                          </p>
                        </div>
                        {getKycStatusBadge()}
                      </div>
                      
                      {user.kycStatus !== 'approved' && (
                        <Button 
                          className="w-full mt-4 bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light"
                          onClick={() => toast.info('KYC verification coming soon')}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {user.kycStatus === 'pending' ? 'View Status' : 'Start Verification'}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Account Tab */}
                <TabsContent value="account">
                  <Card className="bg-crypto-card border-crypto-border">
                    <CardHeader>
                      <CardTitle className="text-white">Account Information</CardTitle>
                      <CardDescription className="text-gray-400">View your account details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-crypto-dark rounded-lg">
                          <p className="text-gray-400 text-sm mb-1">Account ID</p>
                          <p className="text-white font-mono text-sm">{user.id}</p>
                        </div>
                        <div className="p-4 bg-crypto-dark rounded-lg">
                          <p className="text-gray-400 text-sm mb-1">Account Status</p>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${user.isFrozen ? 'bg-red-500' : 'bg-green-500'}`} />
                            <span className="text-white">{user.isFrozen ? 'Frozen' : 'Active'}</span>
                          </div>
                        </div>
                        <div className="p-4 bg-crypto-dark rounded-lg">
                          <p className="text-gray-400 text-sm mb-1">Total Balance</p>
                          <p className="text-white font-bold text-lg">${user.balance.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-crypto-dark rounded-lg">
                          <p className="text-gray-400 text-sm mb-1">Total Invested</p>
                          <p className="text-crypto-yellow font-bold text-lg">${user.totalInvested.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Preferences Tab */}
                <TabsContent value="preferences">
                  <Card className="bg-crypto-card border-crypto-border">
                    <CardHeader>
                      <CardTitle className="text-white">Preferences</CardTitle>
                      <CardDescription className="text-gray-400">Customize your experience</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Currency Selection */}
                      <div>
                        <Label className="text-gray-400 mb-3 block">Preferred Currency</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {SUPPORTED_CURRENCIES.map((currency) => (
                            <button
                              key={currency.code}
                              onClick={() => handleCurrencyChange(currency.code)}
                              className={`p-3 rounded-lg border text-left transition-all ${
                                user.preferredCurrency === currency.code
                                  ? 'border-crypto-yellow bg-crypto-yellow/10'
                                  : 'border-crypto-border hover:border-crypto-yellow/50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{currency.flag}</span>
                                <div>
                                  <p className={`text-sm font-medium ${
                                    user.preferredCurrency === currency.code ? 'text-crypto-yellow' : 'text-white'
                                  }`}>
                                    {currency.code}
                                  </p>
                                  <p className="text-xs text-gray-500">{currency.name}</p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <Separator className="bg-crypto-border" />

                      {/* Language Selection */}
                      <div>
                        <Label className="text-gray-400 mb-3 block">Language</Label>
                        <select
                          value={user.preferredLanguage || 'en'}
                          onChange={(e) => {
                            dispatch({
                              type: 'UPDATE_USER',
                              payload: { preferredLanguage: e.target.value },
                            });
                            toast.success('Language updated');
                          }}
                          className="w-full p-3 bg-crypto-dark border border-crypto-border text-white rounded-lg"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="zh">Chinese</option>
                          <option value="ja">Japanese</option>
                          <option value="ar">Arabic</option>
                          <option value="pt">Portuguese</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications">
                  <Card className="bg-crypto-card border-crypto-border">
                    <CardHeader>
                      <CardTitle className="text-white">Notification Settings</CardTitle>
                      <CardDescription className="text-gray-400">Choose how you want to be notified</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-crypto-dark rounded-lg">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-crypto-yellow" />
                          <div>
                            <p className="text-white font-medium">Email Notifications</p>
                            <p className="text-gray-400 text-sm">Receive updates via email</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.emailNotifications}
                          onCheckedChange={(checked) => {
                            setSettings({ ...settings, emailNotifications: checked });
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-crypto-dark rounded-lg">
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-crypto-yellow" />
                          <div>
                            <p className="text-white font-medium">SMS Notifications</p>
                            <p className="text-gray-400 text-sm">Receive updates via text message</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.smsNotifications}
                          onCheckedChange={(checked) => {
                            setSettings({ ...settings, smsNotifications: checked });
                          }}
                        />
                      </div>

                      <Button 
                        onClick={handleSaveSettings}
                        className="w-full bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light"
                      >
                        Save Notification Settings
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security">
                  <Card className="bg-crypto-card border-crypto-border">
                    <CardHeader>
                      <CardTitle className="text-white">Security Settings</CardTitle>
                      <CardDescription className="text-gray-400">Protect your account</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-crypto-dark rounded-lg">
                        <div className="flex items-center gap-3">
                          <Lock className="w-5 h-5 text-crypto-yellow" />
                          <div>
                            <p className="text-white font-medium">Two-Factor Authentication</p>
                            <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.twoFactorEnabled}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              toast.info('2FA setup coming soon');
                            } else {
                              setSettings({ ...settings, twoFactorEnabled: checked });
                            }
                          }}
                        />
                      </div>

                      <div className="p-4 bg-crypto-dark rounded-lg space-y-4">
                        <div>
                          <p className="text-white font-medium mb-1">Change Password</p>
                          <p className="text-gray-400 text-sm">Update your password regularly for security</p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                              type={showPasswords.current ? 'text' : 'password'}
                              placeholder="Current Password"
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                              className="pl-10 pr-10 bg-crypto-card border-crypto-border text-white"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                            >
                              {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                              type={showPasswords.new ? 'text' : 'password'}
                              placeholder="New Password (min 6 characters)"
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                              className="pl-10 pr-10 bg-crypto-card border-crypto-border text-white"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                            >
                              {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input
                              type={showPasswords.confirm ? 'text' : 'password'}
                              placeholder="Confirm New Password"
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                              className="pl-10 pr-10 bg-crypto-card border-crypto-border text-white"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                            >
                              {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          
                          <Button 
                            onClick={handleChangePassword}
                            disabled={isChangingPassword}
                            className="w-full bg-crypto-yellow text-crypto-dark hover:bg-crypto-yellow-light"
                          >
                            {isChangingPassword ? 'Changing...' : 'Change Password'}
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 bg-crypto-dark rounded-lg border border-red-500/30">
                        <p className="text-red-400 font-medium mb-2">Danger Zone</p>
                        <p className="text-gray-400 text-sm mb-4">These actions cannot be undone</p>
                        <Button 
                          variant="outline"
                          onClick={() => toast.info('Account deletion coming soon')}
                          className="border-red-500 text-red-400 hover:bg-red-500/10"
                        >
                          Delete Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
