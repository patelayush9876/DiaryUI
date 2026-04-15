import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useDiary, Mood } from '../../context/DiaryContext';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Save,
  X,
  Bold,
  Italic,
  Underline,
  Type,
  Image,
  Smile,
  Music,
  Check,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

const fonts = [
  { name: 'Modern', value: 'font-sans' },
  { name: 'Serif', value: 'font-serif' },
  { name: 'Handwriting', value: 'font-handwriting' },
  { name: 'Typewriter', value: 'font-mono' },
];

const moods: Mood[] = ['happy', 'calm', 'sad', 'anxious', 'excited', 'neutral'];

export const DiaryEditor = () => {
  const { addEntry, entries, saving } = useDiary();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood>('neutral');
  const [selectedFont, setSelectedFont] = useState('font-serif');
  const [tags, setTags] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);

  // Auto-save effect
  useEffect(() => {
    if (content.length > 10) {
      const timer = setTimeout(() => {
        setAutoSaved(true);
        setTimeout(() => setAutoSaved(false), 2000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [content]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please add a title and content');
      return;
    }

    const entry = {
      mood,
      content,
      title,
      date: new Date().toISOString(),
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      fontStyle: selectedFont,
    };

    try {
      await addEntry(entry);
      toast.success('Entry saved successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save entry. Please try again.');
    }
  };

  const getPreviousEntry = () => {
    return entries[0];
  };

  const previousEntry = getPreviousEntry();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-yellow-800 to-orange-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="text-amber-100 hover:text-white hover:bg-amber-800"
            >
              <X className="w-5 h-5 mr-2" />
              Close
            </Button>
            {autoSaved && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-green-300 text-sm"
              >
                <Check className="w-4 h-4" />
                Auto-saved
              </motion.div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              variant="ghost"
              className={`${isPlaying ? 'bg-amber-800' : ''} text-amber-100 hover:text-white hover:bg-amber-800`}
            >
              <Music className="w-5 h-5 mr-2" />
              {isPlaying ? 'Playing...' : 'Music'}
            </Button>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              <Save className="w-5 h-5 mr-2" />
              {saving ? 'Saving...' : 'Save Entry'}
            </Button>
          </div>
        </div>

        {/* Book Interface */}
        <div className="relative">
          {/* Book shadow and binding */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-full bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 shadow-2xl z-10 rounded-sm" />

          <div className="grid md:grid-cols-2 gap-0 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl overflow-hidden shadow-2xl">
            {/* Left Page - Previous Entry */}
            <motion.div
              initial={{ rotateY: -5 }}
              animate={{ rotateY: 0 }}
              className="relative p-12 bg-gradient-to-br from-amber-50 to-yellow-50 min-h-[600px]"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    transparent,
                    transparent 30px,
                    rgba(217, 119, 6, 0.05) 30px,
                    rgba(217, 119, 6, 0.05) 31px
                  )
                `,
              }}
            >
              {/* Page number */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-amber-400 text-sm">
                {entries.length * 2}
              </div>

              {/* Bookmark ribbon */}
              <div className="absolute top-0 right-12 w-8 h-32 bg-gradient-to-b from-red-500 to-red-700 shadow-lg" />

              <div className="h-full flex flex-col">
                <h3 className="text-xl font-serif text-amber-900 mb-4 border-b border-amber-300 pb-2">
                  Previous Entry
                </h3>
                {previousEntry ? (
                  <div className="flex-1 overflow-auto">
                    <h4 className="font-serif text-lg text-amber-800 mb-2">
                      {previousEntry.title}
                    </h4>
                    <p className="text-sm text-amber-600 mb-4">
                      {new Date(previousEntry.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-amber-900 leading-relaxed whitespace-pre-wrap opacity-60">
                      {previousEntry.content.slice(0, 400)}...
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-amber-400">
                    <div className="text-center">
                      <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Your journey begins here</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Right Page - Current Entry */}
            <motion.div
              initial={{ rotateY: 5 }}
              animate={{ rotateY: 0 }}
              className="relative p-12 bg-gradient-to-br from-yellow-50 to-amber-50 min-h-[600px]"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    transparent,
                    transparent 30px,
                    rgba(217, 119, 6, 0.05) 30px,
                    rgba(217, 119, 6, 0.05) 31px
                  )
                `,
              }}
            >
              {/* Page number */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-amber-400 text-sm">
                {entries.length * 2 + 1}
              </div>

              <div className="h-full flex flex-col gap-4">
                {/* Date and Mood */}
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-amber-600">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <div className="relative">
                    <Button
                      onClick={() => setShowMoodPicker(!showMoodPicker)}
                      variant="ghost"
                      className="text-amber-700 hover:bg-amber-100"
                      size="sm"
                    >
                      <Smile className="w-4 h-4 mr-2" />
                      {mood}
                    </Button>
                    {showMoodPicker && (
                      <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg p-2 grid grid-cols-3 gap-2 z-20">
                        {moods.map((m) => (
                          <button
                            key={m}
                            onClick={() => {
                              setMood(m);
                              setShowMoodPicker(false);
                            }}
                            className="px-3 py-2 rounded-lg hover:bg-amber-100 text-sm capitalize"
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-2 pb-3 border-b border-amber-200">
                  <Button variant="ghost" size="sm" className="text-amber-700 hover:bg-amber-100">
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-amber-700 hover:bg-amber-100">
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-amber-700 hover:bg-amber-100">
                    <Underline className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-6 bg-amber-200 mx-1" />
                  <div className="relative">
                    <Button
                      onClick={() => setShowFontPicker(!showFontPicker)}
                      variant="ghost"
                      size="sm"
                      className="text-amber-700 hover:bg-amber-100"
                    >
                      <Type className="w-4 h-4" />
                    </Button>
                    {showFontPicker && (
                      <div className="absolute left-0 top-full mt-2 bg-white rounded-lg shadow-lg p-2 z-20 min-w-[150px]">
                        {fonts.map((f) => (
                          <button
                            key={f.value}
                            onClick={() => {
                              setSelectedFont(f.value);
                              setShowFontPicker(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg hover:bg-amber-100 ${f.value}`}
                          >
                            {f.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="text-amber-700 hover:bg-amber-100">
                    <Image className="w-4 h-4" />
                  </Button>
                </div>

                {/* Title Input */}
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Entry Title..."
                  className="bg-transparent border-none text-2xl font-serif text-amber-900 placeholder:text-amber-400 focus-visible:ring-0 px-0"
                />

                {/* Content Textarea */}
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Dear Diary, today I..."
                  className={`flex-1 bg-transparent border-none resize-none text-amber-900 placeholder:text-amber-400 focus-visible:ring-0 leading-relaxed ${selectedFont} px-0`}
                  style={{ minHeight: '300px' }}
                />

                {/* Tags Input */}
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Tags (comma separated)..."
                  className="bg-transparent border-t border-amber-200 rounded-none text-sm text-amber-700 placeholder:text-amber-400 focus-visible:ring-0 px-0 pt-3"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-amber-200 text-sm"
        >
          <p>💡 Tip: Your entries are automatically saved as you type</p>
        </motion.div>
      </motion.div>
    </div>
  );
};
