import { useState } from 'react';
import { useDiary } from '../../context/DiaryContext';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { 
  Settings as SettingsIcon, 
  User, 
  Lock, 
  Bell, 
  Download,
  Shield,
  Moon,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

export const Settings = () => {
  const { user, entries } = useDiary();
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [enableDarkMode, setEnableDarkMode] = useState(false);
  const [enablePrivateMode, setEnablePrivateMode] = useState(false);
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);

  const handleExportPDF = () => {
    toast.success('Exporting diary as PDF...');
    // Mock export functionality
  };

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully!');
  };

  const totalWords = entries.reduce((sum, e) => sum + e.content.split(' ').length, 0);
  const streak = entries.length;
  const joinDate = user?.joinDate || new Date().toISOString().split('T')[0];
  const daysSinceJoined = Math.floor(
    (new Date().getTime() - new Date(joinDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon className="w-8 h-8 text-amber-600" />
          <h1 className="text-4xl font-serif text-amber-900">Settings</h1>
        </div>

        {/* Profile */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-amber-200 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-amber-600" />
            <h3 className="text-2xl font-serif text-amber-900">Profile</h3>
          </div>

          <div className="flex items-center gap-6 mb-6">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-24 h-24 rounded-full border-4 border-amber-200 shadow-lg"
            />
            <div className="flex-1">
              <h4 className="text-xl font-serif text-amber-900">{user?.name}</h4>
              <p className="text-amber-700 mb-2">{user?.email}</p>
              <Button variant="outline" className="border-amber-300 text-amber-700">
                Change Avatar
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-amber-200">
            <div className="text-center">
              <p className="text-3xl font-serif text-amber-900">{entries.length}</p>
              <p className="text-sm text-amber-600">Total Entries</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-serif text-amber-900">{streak}</p>
              <p className="text-sm text-amber-600">Day Streak</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-serif text-amber-900">{totalWords}</p>
              <p className="text-sm text-amber-600">Words Written</p>
            </div>
          </div>
        </Card>

        {/* Privacy & Security */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-amber-200 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-amber-600" />
            <h3 className="text-2xl font-serif text-amber-900">Privacy & Security</h3>
          </div>

          <div className="space-y-6">
            {/* PIN Lock */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-amber-900 mb-1">PIN Lock</h4>
                <p className="text-sm text-amber-600">Protect your diary with a PIN</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Input
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Set PIN"
                    maxLength={6}
                    className="w-32 bg-amber-50 border-amber-200"
                  />
                  <button
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-600"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Private Mode */}
            <div className="flex items-center justify-between pt-4 border-t border-amber-200">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <h4 className="text-amber-900">Private Mode</h4>
                </div>
                <p className="text-sm text-amber-600">Hide diary with fake cover when enabled</p>
              </div>
              <Switch
                checked={enablePrivateMode}
                onCheckedChange={setEnablePrivateMode}
              />
            </div>

            {/* Mark Entries Private */}
            <div className="flex items-center justify-between pt-4 border-t border-amber-200">
              <div className="flex-1">
                <h4 className="text-amber-900 mb-1">Lock Sensitive Entries</h4>
                <p className="text-sm text-amber-600">Require PIN for specific entries</p>
              </div>
              <Button variant="outline" className="border-amber-300 text-amber-700">
                Manage
              </Button>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-amber-200 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-amber-600" />
            <h3 className="text-2xl font-serif text-amber-900">Notifications</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-amber-900 mb-1">Daily Reminder</h4>
                <p className="text-sm text-amber-600">Get reminded to write every day</p>
              </div>
              <Switch
                checked={enableNotifications}
                onCheckedChange={setEnableNotifications}
              />
            </div>

            {enableNotifications && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pl-4 space-y-3"
              >
                <div>
                  <Label className="text-amber-900">Reminder Time</Label>
                  <Input
                    type="time"
                    defaultValue="20:00"
                    className="mt-1 bg-amber-50 border-amber-200"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </Card>

        {/* Appearance */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-amber-200 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Moon className="w-6 h-6 text-amber-600" />
            <h3 className="text-2xl font-serif text-amber-900">Appearance</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-amber-900 mb-1">Dark Mode</h4>
                <p className="text-sm text-amber-600">Switch to dark theme for night writing</p>
              </div>
              <Switch
                checked={enableDarkMode}
                onCheckedChange={setEnableDarkMode}
              />
            </div>
          </div>
        </Card>

        {/* Export & Backup */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-amber-200 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Download className="w-6 h-6 text-amber-600" />
            <h3 className="text-2xl font-serif text-amber-900">Export & Backup</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
              <div className="flex-1">
                <h4 className="text-amber-900 mb-1">Export as PDF</h4>
                <p className="text-sm text-amber-600">Download all your entries as a PDF</p>
              </div>
              <Button 
                onClick={handleExportPDF}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div className="flex-1">
                <h4 className="text-blue-900 mb-1">Backup to Cloud</h4>
                <p className="text-sm text-blue-600">Sync your diary across devices</p>
              </div>
              <Button variant="outline" className="border-blue-300 text-blue-700">
                Setup
              </Button>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" className="border-amber-300 text-amber-700">
            Reset to Defaults
          </Button>
          <Button 
            onClick={handleSaveSettings}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white"
          >
            Save Settings
          </Button>
        </div>

        {/* Account Info */}
        <div className="mt-8 text-center text-sm text-amber-600">
          <p>Member since {new Date(joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          <p>{daysSinceJoined} days of journaling</p>
        </div>
      </motion.div>
    </div>
  );
};
