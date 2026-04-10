# Admin Portal Documentation

## Overview
The Admin Portal is a privacy-first administrative interface for the personal diary/journaling platform. It provides secure user management and platform monitoring capabilities while maintaining strict user privacy standards.

## Key Features

### 1. **Admin Authentication** (`/admin/login`)
- Secure login with email and password
- Two-factor authentication (2FA) with OTP verification
- Demo credentials for testing:
  - Email: `admin@diary.com`
  - Password: `admin123`
  - 2FA Code: `123456`

### 2. **Admin Dashboard** (`/admin`)
- Overview statistics:
  - Total Users
  - Active Users
  - New Signups
  - Growth Rate
- Interactive charts:
  - Monthly signup trends
  - Active users over last 7 days
- Quick stats:
  - Average session duration
  - User retention rate
  - Platform uptime

### 3. **User Management** (`/admin/users`)
- Comprehensive user table with:
  - Name and email
  - Account status (Active/Blocked)
  - Join date and last active date
  - Number of diary entries
- Search functionality by name or email
- Filter by user status
- User actions:
  - View detailed profile
  - Block/Unblock user
  - Delete user account
- Confirmation dialogs for critical actions

### 4. **User Detail View** (`/admin/users/:userId`)
- Restricted profile information:
  - Basic profile data
  - Account creation and activity dates
  - Activity statistics (entries count, streaks, averages)
- **Privacy Protection**: Explicit UI indicators that diary content is encrypted and inaccessible
- No access to actual diary entries or personal content

## Privacy & Security Features

### End-to-End Encryption Notice
Throughout the admin portal, prominent notices remind administrators that:
- User diary content is end-to-end encrypted
- Administrators cannot access personal diary entries
- Only metadata and activity statistics are visible

### Visual Privacy Indicators
- Green privacy badges on every page
- Lock icons emphasizing data protection
- Explicit messaging in user detail views
- Privacy notice in sidebar

### Secure Authentication
- Protected routes requiring authentication
- Session management via localStorage
- Auto-redirect to login for unauthenticated access
- Secure logout functionality

## Design Philosophy

### Minimal & Professional
- Clean, neutral color scheme (slate grays and blues)
- Card-based layouts for easy scanning
- Purposeful spacing and typography
- Focus on functionality over decoration

### Contrast from User UI
- Cooler, more systematic color palette vs warm user interface
- Professional dashboard aesthetic
- Clear differentiation between admin and user experiences

### Responsive Design
- Desktop-first approach
- Optimized for administrative workflows
- Responsive tables and charts
- Mobile-friendly when needed

## Navigation Structure

```
/admin/login (public)
└── /admin (protected)
    ├── Dashboard
    ├── User Management
    │   └── User Detail View
    └── (Future: Reports/Flags)
```

## Component Architecture

```
src/app/components/
├── layouts/
│   └── AdminLayout.tsx          # Sidebar layout with navigation
├── admin/
│   └── ProtectedAdminRoute.tsx  # Route guard for authentication
└── pages/admin/
    ├── AdminLogin.tsx           # Login with 2FA
    ├── AdminDashboard.tsx       # Overview and metrics
    ├── UserManagement.tsx       # User list and actions
    └── UserDetail.tsx           # Individual user profile
```

## Usage

### Accessing the Admin Portal
1. Navigate to `/admin/login`
2. Enter credentials (use demo credentials for testing)
3. Complete 2FA verification
4. Access admin dashboard

### From User Portal
- A subtle link is provided at the bottom of the user login page
- Link text: "Access Admin Portal"

### Returning to User Portal
- Click "Back to User Portal" link on admin login page
- Or navigate directly to `/auth/login`

## Mock Data
All user data, statistics, and charts use mock data for demonstration purposes. In a production environment, this would connect to a real backend API.

## Future Enhancements
Potential additions to the admin portal:
- Reports and flagging system
- More detailed analytics and insights
- Admin user roles and permissions
- Audit logs
- System settings and configuration
- Email notification management

## Technical Stack
- **React** with TypeScript
- **React Router** for navigation
- **Recharts** for data visualization
- **Radix UI** components for accessibility
- **Tailwind CSS** for styling
- **Lucide Icons** for iconography

## Best Practices Implemented
1. **Privacy First**: No access to user content, only metadata
2. **Secure by Default**: Protected routes and authentication required
3. **Clear Communication**: Explicit privacy notices throughout
4. **User Safety**: Confirmation dialogs for destructive actions
5. **Professional UI**: Clean, trustworthy design language
6. **Responsive**: Works across device sizes
7. **Accessible**: Using Radix UI primitives for accessibility
