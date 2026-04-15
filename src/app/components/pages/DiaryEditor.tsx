import { useState, useEffect, useRef } from 'react';
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

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const formatDiaryContentToHtml = (value: string) => {
  const escaped = escapeHtml(value);

  return escaped
    .replace(/\*\*(.+?)\*\*/gs, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/gs, '<em>$1</em>')
    .replace(/&lt;u&gt;(.+?)&lt;\/u&gt;/gs, '<u>$1</u>')
    .replace(/\n/g, '<br />');
};

export const DiaryEditor = () => {
  const { addEntry, entries, saving, currentFont, currentPageStyle, setCurrentFont } = useDiary();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood>('neutral');
  const [tags, setTags] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [currentSpread, setCurrentSpread] = useState(0);
  const contentRef = useRef<HTMLTextAreaElement | null>(null);

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
      fontStyle: currentFont,
    };

    try {
      await addEntry(entry);
      toast.success('Entry saved successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save entry. Please try again.');
    }
  };

  const orderedEntries = [...entries].reverse();
  const totalSpreads = Math.max(1, Math.ceil(orderedEntries.length / 2));

  const previousEntry = orderedEntries[currentSpread] || null;

  const handleNextPage = () => {
    if (currentSpread < orderedEntries.length - 1) {
      setCurrentSpread((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentSpread > 0) {
      setCurrentSpread((prev) => prev - 1);
    }
  };

  const paperBackgroundImage = currentPageStyle === 'blank-canvas' ? 'none' : 'var(--page-pattern)';
  const paperBackgroundSize =
    currentPageStyle === 'blank-canvas' ? undefined : 'var(--page-pattern-size)';

  const applyTextFormat = (prefix: string, suffix: string, placeholder: string, label: string) => {
    const textarea = contentRef.current;

    if (!textarea) {
      return;
    }

    const selectionStart = textarea.selectionStart ?? 0;
    const selectionEnd = textarea.selectionEnd ?? 0;
    const selectedText = content.slice(selectionStart, selectionEnd);
    const textToWrap = selectedText || placeholder;
    const nextContent =
      content.slice(0, selectionStart) +
      `${prefix}${textToWrap}${suffix}` +
      content.slice(selectionEnd);

    setContent(nextContent);

    const nextSelectionStart = selectionStart + prefix.length;
    const nextSelectionEnd = nextSelectionStart + textToWrap.length;

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(nextSelectionStart, nextSelectionEnd);
    });

    toast.success(`${label} formatting applied`);
  };

  return (
    <div
      className="min-h-screen p-8"
      style={{
        backgroundImage:
          'linear-gradient(to bottom right, var(--cover-start), color-mix(in srgb, var(--cover-end) 82%, black), var(--cover-end))',
      }}
    >
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
          <div
            className="absolute top-0 left-1/2 z-10 h-full w-2 -translate-x-1/2 rounded-sm shadow-2xl"
            style={{
              background:
                'linear-gradient(to right, var(--cover-spine), var(--cover-end), var(--cover-spine))',
            }}
          />

          <div
            className="grid overflow-hidden rounded-2xl shadow-2xl md:grid-cols-2"
            style={{
              backgroundImage:
                'linear-gradient(to bottom right, var(--paper-start), var(--paper-end))',
            }}
          >
            {/* Left Page - Previous Entry */}
            <motion.div
              key={currentSpread}
              initial={{ rotateY: -15, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="relative min-h-[600px] p-12"
              style={{
                backgroundImage: paperBackgroundImage,
                backgroundSize: paperBackgroundSize,
                backgroundColor: 'var(--paper-start)',
              }}
            >
              {/* Page number */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-amber-400 text-sm">
                {currentSpread + 1}
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
                    <div
                      className="text-amber-900 leading-relaxed opacity-60"
                      dangerouslySetInnerHTML={{
                        __html: formatDiaryContentToHtml(
                          `${previousEntry.content.slice(0, 400)}${
                            previousEntry.content.length > 400 ? '...' : ''
                          }`
                        ),
                      }}
                    />
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
              className="relative min-h-[600px] p-12"
              style={{
                backgroundImage: paperBackgroundImage,
                backgroundSize: paperBackgroundSize,
                backgroundColor: 'var(--paper-end)',
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
                      <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg p-2 grid grid-cols-1 gap-2 z-20">
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-amber-700 hover:bg-amber-100"
                    onClick={() => applyTextFormat('**', '**', 'bold text', 'Bold')}
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-amber-700 hover:bg-amber-100"
                    onClick={() => applyTextFormat('*', '*', 'italic text', 'Italic')}
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-amber-700 hover:bg-amber-100"
                    onClick={() => applyTextFormat('<u>', '</u>', 'underlined text', 'Underline')}
                  >
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
                              setCurrentFont(f.value);
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
                  ref={contentRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Dear Diary, today I..."
                  className="flex-1 resize-none border-none bg-transparent px-0 leading-relaxed text-amber-900 placeholder:text-amber-400 focus-visible:ring-0"
                  style={{ minHeight: '300px', fontFamily: 'var(--editor-font-family)' }}
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
        <div className="mt-6 flex items-center justify-center gap-4">
          <Button
            onClick={handlePrevPage}
            disabled={currentSpread === 0}
            variant="outline"
            className="border-border bg-card/80 text-foreground backdrop-blur-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-40"
          >
            ← Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {currentSpread + 1} of {Math.max(orderedEntries.length, 1)}
          </span>

          <Button
            onClick={handleNextPage}
            disabled={currentSpread >= orderedEntries.length - 1}
            variant="outline"
            className="border-border bg-card/80 text-foreground backdrop-blur-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-40"
          >
            Next →
          </Button>
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
