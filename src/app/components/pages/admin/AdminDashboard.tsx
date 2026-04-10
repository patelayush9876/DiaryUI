import { Users, UserPlus, Activity, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data
const statsData = {
  totalUsers: 1247,
  activeUsers: 892,
  newSignups: 156,
  growthRate: 12.5,
};

const signupTrendData = [
  { date: "Jan", signups: 45 },
  { date: "Feb", signups: 62 },
  { date: "Mar", signups: 78 },
  { date: "Apr", signups: 95 },
  { date: "May", signups: 112 },
  { date: "Jun", signups: 134 },
  { date: "Jul", signups: 156 },
];

const activityData = [
  { day: "Mon", active: 680 },
  { day: "Tue", active: 720 },
  { day: "Wed", active: 760 },
  { day: "Thu", active: 810 },
  { day: "Fri", active: 850 },
  { day: "Sat", active: 920 },
  { day: "Sun", active: 892 },
];

export function AdminDashboard() {
  const statCards = [
    {
      title: "Total Users",
      value: statsData.totalUsers.toLocaleString(),
      icon: Users,
      change: "+12.5%",
      changeType: "positive" as const,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Users",
      value: statsData.activeUsers.toLocaleString(),
      icon: Activity,
      change: "+8.3%",
      changeType: "positive" as const,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "New Signups",
      value: statsData.newSignups.toLocaleString(),
      subtitle: "This month",
      icon: UserPlus,
      change: "+18.2%",
      changeType: "positive" as const,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Growth Rate",
      value: `${statsData.growthRate}%`,
      subtitle: "Monthly average",
      icon: TrendingUp,
      change: "+2.1%",
      changeType: "positive" as const,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-800 mb-2">Dashboard</h1>
        <p className="text-slate-600">
          Platform overview and key metrics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-semibold text-slate-800 mb-1">
                    {stat.value}
                  </p>
                  {stat.subtitle && (
                    <p className="text-xs text-slate-500">{stat.subtitle}</p>
                  )}
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs font-medium text-green-600">
                      {stat.change}
                    </span>
                    <span className="text-xs text-slate-500">vs last period</span>
                  </div>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signup Trend */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">
              Monthly Signup Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={signupTrendData}>
                <defs>
                  <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b" 
                  fontSize={12}
                />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="signups"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSignups)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">
              Active Users (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="day" 
                  stroke="#64748b" 
                  fontSize={12}
                />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="active"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <p className="text-sm text-slate-600 mb-2">Average Session Duration</p>
            <p className="text-2xl font-semibold text-slate-800">12m 34s</p>
            <p className="text-xs text-slate-500 mt-1">Per user per session</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-6">
            <p className="text-sm text-slate-600 mb-2">User Retention</p>
            <p className="text-2xl font-semibold text-slate-800">78.5%</p>
            <p className="text-xs text-slate-500 mt-1">30-day retention rate</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-6">
            <p className="text-sm text-slate-600 mb-2">Platform Uptime</p>
            <p className="text-2xl font-semibold text-slate-800">99.98%</p>
            <p className="text-xs text-slate-500 mt-1">Last 30 days</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
