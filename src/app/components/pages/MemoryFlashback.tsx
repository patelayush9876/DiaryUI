import { useState, useEffect } from 'react';
import { useDiary } from '../../context/DiaryContext';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Sparkles, Heart, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export const MemoryFlashback = () => {
  const { entries } = useDiary();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [memories, setMemories] = useState<any[]>([]);

  useEffect(() => {
    // Get entries from past years or months
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const oldEntries = entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate < oneMonthAgo;
    });

    setMemories(oldEntries);
  }, [entries]);

  const currentMemory = memories[currentIndex];

  const nextMemory = () => {
    setCurrentIndex((prev) => (prev + 1) % memories.length);
  };

  const previousMemory = () => {
    setCurrentIndex((prev) => (prev - 1 + memories.length) % memories.length);
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const years = now.getFullYear() - then.getFullYear();
    const months = now.getMonth() - then.getMonth();
    const days = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));

    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''} ago`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    return 'Today';
  };

  if (memories.length === 0) {
    return (
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-8 h-8 text-amber-600" />
            <h1 className="text-4xl font-serif text-amber-900">Memory Flashback</h1>
          </div>

          <Card className="p-12 text-center bg-white/80 backdrop-blur-sm border-amber-200">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-amber-400 opacity-50" />
            <h3 className="text-2xl font-serif text-amber-900 mb-2">No memories yet</h3>
            <p className="text-amber-700 mb-6">
              Keep writing! Your memories will appear here as time goes by.
            </p>
            <div className="text-sm text-amber-600">
              💡 Memories are entries from at least a month ago
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-purple-100 via-pink-100 to-amber-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="w-8 h-8 text-purple-600" />
          <h1 className="text-4xl font-serif text-purple-900">Memory Flashback</h1>
        </div>

        <div className="text-center mb-6">
          <p className="text-purple-700">
            {memories.length} {memories.length === 1 ? 'memory' : 'memories'} found
          </p>
        </div>

        <AnimatePresence mode="wait">
          {currentMemory && (
            <motion.div
              key={currentMemory.id}
              initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotateY: -10 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-2xl">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-amber-200 to-orange-200 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2" />

                <div className="relative p-12">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                      className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mb-4 shadow-lg"
                    >
                      <Sparkles className="w-8 h-8 text-white" />
                    </motion.div>
                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-serif text-purple-900 mb-2"
                    >
                      You wrote this {getTimeAgo(currentMemory.date)}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-purple-600"
                    >
                      {new Date(currentMemory.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </motion.p>
                  </div>

                  {/* Memory content */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg mb-6"
                  >
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-purple-200">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <h3 className="text-2xl font-serif text-purple-900">{currentMemory.title}</h3>
                    </div>
                    <div className="prose prose-lg max-w-none">
                      <p className="text-purple-900 leading-relaxed whitespace-pre-wrap">
                        {currentMemory.content}
                      </p>
                    </div>
                    {currentMemory.tags && currentMemory.tags.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-purple-200">
                        <div className="flex flex-wrap gap-2">
                          {currentMemory.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Actions */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center justify-center gap-4"
                  >
                    <Button
                      variant="outline"
                      className="border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      React
                    </Button>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Reflect on This
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            onClick={previousMemory}
            disabled={memories.length <= 1}
            variant="outline"
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <div className="text-purple-700">
            {currentIndex + 1} / {memories.length}
          </div>
          <Button
            onClick={nextMemory}
            disabled={memories.length <= 1}
            variant="outline"
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
