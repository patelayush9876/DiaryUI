import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Filter, MoreVertical, Lock, Unlock, Trash2, Eye, AlertCircle } from 'lucide-react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Alert, AlertDescription } from '../../ui/alert';

// Mock user data
const mockUsers = [
  {
    id: '1',
    name: 'Emma Johnson',
    email: 'emma.j@example.com',
    status: 'active',
    joinDate: '2025-01-15',
    lastActive: '2026-04-09',
    entriesCount: 124,
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'm.chen@example.com',
    status: 'active',
    joinDate: '2024-11-20',
    lastActive: '2026-04-10',
    entriesCount: 89,
  },
  {
    id: '3',
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    status: 'blocked',
    joinDate: '2025-03-08',
    lastActive: '2026-03-25',
    entriesCount: 45,
  },
  {
    id: '4',
    name: 'David Martinez',
    email: 'david.m@example.com',
    status: 'active',
    joinDate: '2024-09-12',
    lastActive: '2026-04-08',
    entriesCount: 203,
  },
  {
    id: '5',
    name: 'Jessica Lee',
    email: 'jessica.lee@example.com',
    status: 'active',
    joinDate: '2025-02-01',
    lastActive: '2026-04-10',
    entriesCount: 67,
  },
  {
    id: '6',
    name: 'Robert Brown',
    email: 'r.brown@example.com',
    status: 'active',
    joinDate: '2024-12-15',
    lastActive: '2026-04-07',
    entriesCount: 156,
  },
  {
    id: '7',
    name: 'Amanda Taylor',
    email: 'amanda.t@example.com',
    status: 'blocked',
    joinDate: '2025-01-28',
    lastActive: '2026-03-20',
    entriesCount: 34,
  },
  {
    id: '8',
    name: 'James Wilson',
    email: 'james.w@example.com',
    status: 'active',
    joinDate: '2024-10-05',
    lastActive: '2026-04-09',
    entriesCount: 178,
  },
];

type User = (typeof mockUsers)[0];

export function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'block' | 'unblock' | 'delete' | null>(null);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = (user: User, action: 'block' | 'unblock' | 'delete') => {
    setSelectedUser(user);
    setActionType(action);
  };

  const confirmAction = () => {
    if (!selectedUser || !actionType) return;

    if (actionType === 'delete') {
      setUsers(users.filter((u) => u.id !== selectedUser.id));
    } else if (actionType === 'block') {
      setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, status: 'blocked' } : u)));
    } else if (actionType === 'unblock') {
      setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, status: 'active' } : u)));
    }

    setSelectedUser(null);
    setActionType(null);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-800 mb-2">User Management</h1>
        <p className="text-slate-600">Manage user accounts and platform access</p>
      </div>

      {/* Privacy Notice */}
      <Alert className="mb-6 bg-green-50 border-green-200">
        <Lock className="h-4 w-4 text-green-700" />
        <AlertDescription className="text-green-800">
          <strong>Privacy Protected:</strong> User diary content is end-to-end encrypted.
          Administrators can only access profile information and activity statistics, not personal
          diary entries.
        </AlertDescription>
      </Alert>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-50 border-slate-200"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-slate-50 border-slate-200">
              <Filter className="w-4 h-4 mr-2 text-slate-500" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-slate-600">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-slate-700">User</TableHead>
              <TableHead className="font-semibold text-slate-700">Status</TableHead>
              <TableHead className="font-semibold text-slate-700">Join Date</TableHead>
              <TableHead className="font-semibold text-slate-700">Last Active</TableHead>
              <TableHead className="font-semibold text-slate-700">Entries</TableHead>
              <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                  No users found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-slate-800">{user.name}</div>
                      <div className="text-sm text-slate-500">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === 'active' ? 'default' : 'destructive'}
                      className={
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800 hover:bg-green-100'
                          : 'bg-red-100 text-red-800 hover:bg-red-100'
                      }
                    >
                      {user.status === 'active' ? 'Active' : 'Blocked'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {new Date(user.joinDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {new Date(user.lastActive).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-slate-600">{user.entriesCount}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => navigate(`/admin/users/${user.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === 'active' ? (
                          <DropdownMenuItem
                            onClick={() => handleAction(user, 'block')}
                            className="text-orange-600"
                          >
                            <Lock className="mr-2 h-4 w-4" />
                            Block User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleAction(user, 'unblock')}
                            className="text-green-600"
                          >
                            <Unlock className="mr-2 h-4 w-4" />
                            Unblock User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleAction(user, 'delete')}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!actionType} onOpenChange={() => setActionType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'delete' && 'Delete User Account'}
              {actionType === 'block' && 'Block User'}
              {actionType === 'unblock' && 'Unblock User'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'delete' && (
                <>
                  Are you sure you want to delete <strong>{selectedUser?.name}</strong>'s account?
                  This action cannot be undone and will permanently remove all user data.
                </>
              )}
              {actionType === 'block' && (
                <>
                  Block <strong>{selectedUser?.name}</strong> from accessing the platform? They will
                  not be able to log in until unblocked.
                </>
              )}
              {actionType === 'unblock' && (
                <>
                  Restore access for <strong>{selectedUser?.name}</strong>? They will be able to log
                  in and use the platform again.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={
                actionType === 'delete'
                  ? 'bg-red-600 hover:bg-red-700'
                  : actionType === 'block'
                    ? 'bg-orange-600 hover:bg-orange-700'
                    : 'bg-green-600 hover:bg-green-700'
              }
            >
              {actionType === 'delete' && 'Delete Account'}
              {actionType === 'block' && 'Block User'}
              {actionType === 'unblock' && 'Unblock User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
