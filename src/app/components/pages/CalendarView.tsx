import { useState } from 'react';
import { useDiary } from '../../context/DiaryContext';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Tag } from 'lucide-react';
import { sanitizeDiaryHtml } from '../../utils/diary-content';

export const CalendarView = () => {
  const { entries } = useDiary();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const hasEntryOnDate = (day: number) => {
    const dateStr = new Date(year, month, day).toDateString();
    return entries.find((e) => new Date(e.date).toDateString() === dateStr);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const selectedEntryData = selectedEntry ? entries.find((e) => e.id === selectedEntry) : null;

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <CalendarIcon className="w-8 h-8 text-amber-600" />
          <h1 className="text-4xl font-serif text-amber-900">Calendar & Timeline</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-amber-200">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif text-amber-900">
                  {monthNames[month]} {year}
                </h2>
                <div className="flex gap-2">
                  <Button
                    onClick={previousMonth}
                    variant="outline"
                    size="sm"
                    className="border-amber-300"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={nextMonth}
                    variant="outline"
                    size="sm"
                    className="border-amber-300"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-sm text-amber-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Empty cells for days before month starts */}
                {[...Array(startingDayOfWeek)].map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Days of month */}
                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1;
                  const entry = hasEntryOnDate(day);
                  const isToday =
                    new Date().toDateString() === new Date(year, month, day).toDateString();

                  return (
                    <motion.button
                      key={day}
                      onClick={() => entry && setSelectedEntry(entry.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`aspect-square rounded-xl flex items-center justify-center text-sm relative transition-all ${
                        entry
                          ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md hover:shadow-lg'
                          : isToday
                            ? 'bg-amber-100 text-amber-900 border-2 border-amber-400'
                            : 'hover:bg-amber-50 text-amber-700'
                      }`}
                    >
                      {day}
                      {entry && (
                        <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-6 text-sm text-amber-700">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded" />
                  <span>Has Entry</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-100 border-2 border-amber-400 rounded" />
                  <span>Today</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Entry Preview / Timeline */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-amber-200 sticky top-8">
              {selectedEntryData ? (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h3 className="text-xl font-serif text-amber-900 mb-3">
                    {selectedEntryData.title}
                  </h3>
                  <p className="text-sm text-amber-600 mb-4">
                    {new Date(selectedEntryData.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <div className="mb-4">
                    <Badge className="bg-amber-100 text-amber-800 capitalize">
                      {selectedEntryData.mood}
                    </Badge>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <div
                      className="text-amber-900 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: sanitizeDiaryHtml(selectedEntryData.content) }}
                    />
                  </div>
                  {selectedEntryData.tags && selectedEntryData.tags.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-amber-200">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Tag className="w-4 h-4 text-amber-600" />
                        {selectedEntryData.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="text-center py-12 text-amber-600">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a date with an entry to view details</p>
                </div>
              )}
            </Card>

            {/* Recent Entries Timeline */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-amber-200 mt-6">
              <h3 className="text-lg font-serif text-amber-900 mb-4">Recent Timeline</h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {entries.slice(0, 10).map((entry, index) => (
                  <motion.button
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedEntry(entry.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedEntry === entry.id
                        ? 'bg-amber-100 border-2 border-amber-400'
                        : 'hover:bg-amber-50 border-2 border-transparent'
                    }`}
                  >
                    <h4 className="font-serif text-amber-900 text-sm mb-1">{entry.title}</h4>
                    <p className="text-xs text-amber-600">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </motion.button>
                ))}
                {entries.length === 0 && (
                  <p className="text-center text-amber-600 py-8">No entries yet</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
