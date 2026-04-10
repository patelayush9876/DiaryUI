import { useMemo } from 'react';
import { useDiary, Mood } from '../../context/DiaryContext';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { BarChart3, TrendingUp, Calendar, Smile, Activity, Lightbulb } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Analytics = () => {
  const { entries } = useDiary();

  // Mood distribution
  const moodData = useMemo(() => {
    const moodCount: Record<Mood, number> = {
      happy: 0,
      calm: 0,
      sad: 0,
      anxious: 0,
      excited: 0,
      neutral: 0,
    };

    entries.forEach(entry => {
      moodCount[entry.mood]++;
    });

    return Object.entries(moodCount).map(([mood, count]) => ({
      mood,
      count,
    }));
  }, [entries]);

  // Writing frequency by month
  const monthlyData = useMemo(() => {
    const months: Record<string, number> = {};
    
    entries.forEach(entry => {
      const date = new Date(entry.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months[monthKey] = (months[monthKey] || 0) + 1;
    });

    return Object.entries(months)
      .sort()
      .slice(-6)
      .map(([month, count]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
        entries: count,
      }));
  }, [entries]);

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = entries.filter(e => {
      const entryDate = new Date(e.date);
      return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
    }).length;

    const lastMonth = entries.filter(e => {
      const entryDate = new Date(e.date);
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
      return entryDate.getMonth() === lastMonthDate.getMonth() && 
             entryDate.getFullYear() === lastMonthDate.getFullYear();
    }).length;

    const avgPerMonth = entries.length > 0 
      ? Math.round(entries.length / (Object.keys(monthlyData).length || 1))
      : 0;

    // Most common mood
    const moodCounts = moodData.reduce((acc, curr) => {
      if (curr.count > (acc.count || 0)) return curr;
      return acc;
    }, { mood: 'neutral', count: 0 });

    return {
      thisMonth,
      lastMonth,
      avgPerMonth,
      mostCommonMood: moodCounts.mood,
      totalWords: entries.reduce((sum, e) => sum + e.content.split(' ').length, 0),
    };
  }, [entries, moodData, monthlyData]);

  const COLORS = {
    happy: '#fbbf24',
    calm: '#60a5fa',
    sad: '#9ca3af',
    anxious: '#a78bfa',
    excited: '#fb923c',
    neutral: '#f472b6',
  };

  const insights = [
    {
      icon: TrendingUp,
      title: 'Writing Trend',
      description: stats.thisMonth > stats.lastMonth
        ? 'You\'re writing more this month! Keep it up!'
        : 'Try to write more this month to maintain your habit.',
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      icon: Smile,
      title: 'Mood Pattern',
      description: `You've been feeling mostly ${stats.mostCommonMood} lately.`,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      icon: Activity,
      title: 'Consistency',
      description: stats.avgPerMonth > 5
        ? 'Great consistency! You\'re building a strong journaling habit.'
        : 'Try to write more regularly to build a better habit.',
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
  ];

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="w-8 h-8 text-amber-600" />
          <h1 className="text-4xl font-serif text-amber-900">Analytics & Insights</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-amber-400 to-orange-500 text-white">
            <p className="text-amber-100 text-sm mb-1">Total Entries</p>
            <p className="text-4xl font-serif">{entries.length}</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-400 to-cyan-500 text-white">
            <p className="text-blue-100 text-sm mb-1">This Month</p>
            <p className="text-4xl font-serif">{stats.thisMonth}</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-400 to-pink-500 text-white">
            <p className="text-purple-100 text-sm mb-1">Avg per Month</p>
            <p className="text-4xl font-serif">{stats.avgPerMonth}</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-400 to-emerald-500 text-white">
            <p className="text-green-100 text-sm mb-1">Total Words</p>
            <p className="text-4xl font-serif">{stats.totalWords.toLocaleString()}</p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Mood Distribution */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-amber-200">
            <h3 className="text-xl font-serif text-amber-900 mb-6">Mood Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={moodData.filter(d => d.count > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.mood} (${entry.count})`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {moodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.mood as Mood]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Monthly Activity */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-amber-200">
            <h3 className="text-xl font-serif text-amber-900 mb-6">Writing Frequency</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
                <XAxis dataKey="month" stroke="#92400e" />
                <YAxis stroke="#92400e" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fed7aa',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="entries" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 border-purple-200">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-serif text-purple-900">AI Insights</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6"
              >
                <div className={`w-12 h-12 ${insight.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <insight.icon className={`w-6 h-6 ${insight.color}`} />
                </div>
                <h4 className="font-serif text-amber-900 mb-2">{insight.title}</h4>
                <p className="text-sm text-amber-700">{insight.description}</p>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Suggested Prompts */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-amber-200 mt-6">
          <h3 className="text-xl font-serif text-amber-900 mb-4">Suggested Journaling Prompts</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'What made you smile today?',
              'Describe a challenge you overcame recently',
              'What are you grateful for right now?',
              'Write about a goal you want to achieve',
              'Reflect on a meaningful conversation',
              'What would you tell your past self?',
            ].map((prompt, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-all cursor-pointer border border-amber-200"
              >
                <p className="text-amber-900">💭 {prompt}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
