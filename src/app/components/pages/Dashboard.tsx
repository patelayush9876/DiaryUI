import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDiary, Mood } from '../../context/DiaryContext';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import {
  PenLine,
  Clock,
  Sparkles,
  TrendingUp,
  Smile,
  Meh,
  Frown,
  Heart,
  Zap,
  Cloud,
} from 'lucide-react';

const moodIcons: Record<Mood, { icon: any; color: string; bg: string }> = {
  happy: { icon: Smile, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  calm: { icon: Cloud, color: 'text-blue-600', bg: 'bg-blue-100' },
  sad: { icon: Frown, color: 'text-gray-600', bg: 'bg-gray-100' },
  anxious: { icon: Meh, color: 'text-purple-600', bg: 'bg-purple-100' },
  excited: { icon: Zap, color: 'text-orange-600', bg: 'bg-orange-100' },
  neutral: { icon: Heart, color: 'text-pink-600', bg: 'bg-pink-100' },
};

export const Dashboard = () => {
  const { user, entries } = useDiary();
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getStreak = () => {
    // Calculate writing streak
    const today = new Date().toDateString();
    const hasWrittenToday = entries.some((e) => new Date(e.date).toDateString() === today);
    return hasWrittenToday ? entries.length : entries.length > 0 ? entries.length - 1 : 0;
  };

  const recentEntries = entries.slice(0, 3);

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-serif text-foreground">
            {getGreeting()}, {user?.name}
          </h1>
          <p className="text-muted-foreground">How are you feeling today?</p>
        </div>

        {/* Mood Selector */}
        <Card className="mb-6 border-border bg-card/80 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-lg font-serif text-foreground">Today's Mood</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {(Object.keys(moodIcons) as Mood[]).map((mood) => {
              const { icon: Icon, color, bg } = moodIcons[mood];
              const isSelected = selectedMood === mood;

              return (
                <motion.button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : `${bg} hover:shadow-md`
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : color}`} />
                  <span
                    className={`text-xs capitalize ${isSelected ? 'text-white' : 'text-gray-700'}`}
                  >
                    {mood}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card
              className="p-6 bg-gradient-to-br from-amber-400 to-orange-500 text-white cursor-pointer hover:shadow-xl transition-all"
              onClick={() => navigate('/write')}
            >
              <PenLine className="w-8 h-8 mb-3" />
              <h3 className="text-xl font-serif mb-1">Write Entry</h3>
              <p className="text-amber-100 text-sm">Capture your thoughts</p>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card
              className="p-6 bg-gradient-to-br from-blue-400 to-purple-500 text-white cursor-pointer hover:shadow-xl transition-all"
              onClick={() => navigate('/memories')}
            >
              <Sparkles className="w-8 h-8 mb-3" />
              <h3 className="text-xl font-serif mb-1">View Memories</h3>
              <p className="text-blue-100 text-sm">Relive past moments</p>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card
              className="p-6 bg-gradient-to-br from-pink-400 to-rose-500 text-white cursor-pointer hover:shadow-xl transition-all"
              onClick={() => navigate('/analytics')}
            >
              <TrendingUp className="w-8 h-8 mb-3" />
              <h3 className="text-xl font-serif mb-1">Analytics</h3>
              <p className="text-pink-100 text-sm">Track your journey</p>
            </Card>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="border-border bg-card/80 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Entries</p>
                <p className="text-3xl font-serif text-foreground">{entries.length}</p>
              </div>
              <PenLine className="h-10 w-10 text-primary" />
            </div>
          </Card>

          <Card className="border-border bg-card/80 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Writing Streak</p>
                <p className="text-3xl font-serif text-foreground">{getStreak()} days</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-400" />
            </div>
          </Card>

          <Card className="border-border bg-card/80 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-3xl font-serif text-foreground">
                  {
                    entries.filter((e) => {
                      const entryMonth = new Date(e.date).getMonth();
                      return entryMonth === new Date().getMonth();
                    }).length
                  }
                </p>
              </div>
              <Clock className="w-10 h-10 text-blue-400" />
            </div>
          </Card>
        </div>

        {/* Recent Entries */}
        {recentEntries.length > 0 && (
          <Card className="border-border bg-card/80 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-xl font-serif text-foreground">Recent Entries</h3>
            <div className="space-y-3">
              {recentEntries.map((entry) => {
                const { icon: MoodIcon, color, bg } = moodIcons[entry.mood];

                return (
                  <motion.div
                    key={entry.id}
                    whileHover={{ x: 5 }}
                    className="flex cursor-pointer items-center gap-4 rounded-xl p-4 transition-all hover:bg-accent/50"
                    onClick={() => navigate('/calendar')}
                  >
                    <div
                      className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center`}
                    >
                      <MoodIcon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif text-foreground">{entry.title || 'Untitled'}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            {entries.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                <p className="mb-4">No entries yet. Start writing!</p>
                <Button onClick={() => navigate('/write')} className="bg-primary text-primary-foreground">
                  Create Your First Entry
                </Button>
              </div>
            )}
          </Card>
        )}
      </motion.div>
    </div>
  );
};
