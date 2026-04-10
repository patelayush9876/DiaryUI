import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft,
  Mail,
  Calendar,
  Activity,
  BookOpen,
  Lock,
  Shield,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Alert, AlertDescription } from '../../ui/alert';
import { Separator } from '../../ui/separator';

// Mock user data (same as UserManagement)
const mockUsers = [
  {
    id: '1',
    name: 'Emma Johnson',
    email: 'emma.j@example.com',
    status: 'active',
    joinDate: '2025-01-15',
    lastActive: '2026-04-09',
    entriesCount: 124,
    avatar: 'EJ',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'm.chen@example.com',
    status: 'active',
    joinDate: '2024-11-20',
    lastActive: '2026-04-10',
    entriesCount: 89,
    avatar: 'MC',
  },
  {
    id: '3',
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    status: 'blocked',
    joinDate: '2025-03-08',
    lastActive: '2026-03-25',
    entriesCount: 45,
    avatar: 'SW',
  },
  {
    id: '4',
    name: 'David Martinez',
    email: 'david.m@example.com',
    status: 'active',
    joinDate: '2024-09-12',
    lastActive: '2026-04-08',
    entriesCount: 203,
    avatar: 'DM',
  },
];

const mockActivityStats = {
  totalEntries: 124,
  currentStreak: 12,
  longestStreak: 45,
  avgEntriesPerWeek: 8,
  lastEntryDate: '2026-04-09',
  accountAge: 450, // days
};

export function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const user = mockUsers.find((u) => u.id === userId);

  if (!user) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>User not found</AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/admin/users')} className="mt-4">
            Back to User Management
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/users')}
            className="mb-4 text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to User Management
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-semibold text-white">{user.avatar}</span>
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-slate-800">{user.name}</h1>
                <p className="text-slate-600 flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
              </div>
            </div>
            <Badge
              variant={user.status === 'active' ? 'default' : 'destructive'}
              className={
                user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }
            >
              {user.status === 'active' ? 'Active' : 'Blocked'}
            </Badge>
          </div>
        </div>

        {/* Privacy Warning */}
        <Alert className="mb-6 bg-green-50 border-green-200">
          <Shield className="h-4 w-4 text-green-700" />
          <AlertDescription className="text-green-800">
            <strong>Privacy Notice:</strong> User diary entries are end-to-end encrypted and cannot
            be accessed by administrators. Only metadata and activity statistics are visible below.
          </AlertDescription>
        </Alert>

        {/* Profile Information */}
        <Card className="mb-6 border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  Join Date
                </div>
                <p className="text-slate-800 font-medium">
                  {new Date(user.joinDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {mockActivityStats.accountAge} days ago
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                  <Activity className="w-4 h-4" />
                  Last Active
                </div>
                <p className="text-slate-800 font-medium">
                  {new Date(user.lastActive).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {Math.floor(
                    (new Date().getTime() - new Date(user.lastActive).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{' '}
                  days ago
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Statistics */}
        <Card className="mb-6 border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Activity Statistics</CardTitle>
            <p className="text-sm text-slate-600">
              Aggregated activity data (content is encrypted and private)
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-semibold text-slate-800">
                  {mockActivityStats.totalEntries}
                </p>
                <p className="text-xs text-slate-600 mt-1">Total Entries</p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Activity className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-semibold text-slate-800">
                  {mockActivityStats.currentStreak}
                </p>
                <p className="text-xs text-slate-600 mt-1">Current Streak</p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-semibold text-slate-800">
                  {mockActivityStats.longestStreak}
                </p>
                <p className="text-xs text-slate-600 mt-1">Longest Streak</p>
              </div>

              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-semibold text-slate-800">
                  {mockActivityStats.avgEntriesPerWeek}
                </p>
                <p className="text-xs text-slate-600 mt-1">Avg per Week</p>
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <p className="text-sm text-slate-600 mb-2">Last Entry Created</p>
              <p className="text-slate-800 font-medium">
                {new Date(mockActivityStats.lastEntryDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Encrypted Content Notice */}
        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-200 rounded-full mb-4">
              <Lock className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              User Content is Private & Encrypted
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              All diary entries, personal notes, and user content are end-to-end encrypted. As an
              administrator, you can only view profile information and activity statistics to ensure
              user privacy and data security.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
