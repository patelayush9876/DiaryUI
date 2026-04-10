import { useState } from 'react';
import { useDiary } from '../../context/DiaryContext';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Palette, Check, Book } from 'lucide-react';
import { toast } from 'sonner';

const themes = [
  {
    id: 'vintage',
    name: 'Vintage Diary',
    description: 'Classic leather-bound journal aesthetic',
    preview: 'from-amber-50 via-orange-50 to-yellow-50',
    accent: 'from-amber-400 to-orange-500',
    image: 'https://images.unsplash.com/photo-1762113246719-1a6adc837209?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZGlhcnklMjBsZWF0aGVyJTIwYm9va3xlbnwxfHx8fDE3NzU4NDAyMjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'dark',
    name: 'Dark Journal',
    description: 'Midnight writing with deep navy and charcoal',
    preview: 'from-slate-900 via-purple-900 to-indigo-900',
    accent: 'from-purple-500 to-pink-500',
    image: 'https://images.unsplash.com/photo-1559235239-1090187395b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwcmVhZGluZyUyMG5vb2slMjBib29rc3xlbnwxfHx8fDE3NzU4NDAyMjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Pure and simple, distraction-free writing',
    preview: 'from-white via-gray-50 to-slate-50',
    accent: 'from-gray-600 to-gray-800',
    image: 'https://images.unsplash.com/photo-1765648496288-e1760f547711?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxtJTIwd3JpdGluZyUyMHdvcmtzcGFjZSUyMHBsYW50c3xlbnwxfHx8fDE3NzU4NDAyMjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'nature',
    name: 'Nature Inspired',
    description: 'Earthy greens and calming natural tones',
    preview: 'from-green-50 via-emerald-50 to-teal-50',
    accent: 'from-green-500 to-emerald-600',
    image: 'https://images.unsplash.com/photo-1580567814278-64f290c71bf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb3VybmFsJTIwbm90ZWJvb2slMjBkZXNrJTIwYWVzdGhldGljfGVufDF8fHx8MTc3NTg0MDIyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'sunset',
    name: 'Sunset Dreams',
    description: 'Warm pinks and oranges for evening reflections',
    preview: 'from-rose-100 via-pink-100 to-orange-100',
    accent: 'from-rose-400 to-orange-500',
    image: 'https://images.unsplash.com/photo-1580567814278-64f290c71bf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb3VybmFsJTIwbm90ZWJvb2slMjBkZXNrJTIwYWVzdGhldGljfGVufDF8fHx8MTc3NTg0MDIyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    description: 'Cool blues and aqua for peaceful writing',
    preview: 'from-cyan-50 via-blue-50 to-sky-50',
    accent: 'from-cyan-500 to-blue-600',
    image: 'https://images.unsplash.com/photo-1559235239-1090187395b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwcmVhZGluZyUyMG5vb2slMjBib29rc3xlbnwxfHx8fDE3NzU4NDAyMjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

const diaryCovers = [
  {
    id: 'leather-brown',
    name: 'Classic Leather',
    color: 'bg-gradient-to-br from-amber-800 to-orange-900',
  },
  {
    id: 'red-velvet',
    name: 'Red Velvet',
    color: 'bg-gradient-to-br from-red-600 to-rose-800',
  },
  {
    id: 'navy-blue',
    name: 'Navy Blue',
    color: 'bg-gradient-to-br from-blue-800 to-indigo-900',
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    color: 'bg-gradient-to-br from-green-700 to-emerald-900',
  },
  {
    id: 'purple-night',
    name: 'Purple Night',
    color: 'bg-gradient-to-br from-purple-700 to-pink-800',
  },
  {
    id: 'black-elegant',
    name: 'Black Elegant',
    color: 'bg-gradient-to-br from-gray-900 to-slate-900',
  },
];

export const Themes = () => {
  const { currentTheme, setCurrentTheme } = useDiary();
  const [selectedCover, setSelectedCover] = useState('leather-brown');

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    toast.success('Theme updated successfully!');
  };

  const handleCoverChange = (coverId: string) => {
    setSelectedCover(coverId);
    toast.success('Diary cover updated!');
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <Palette className="w-8 h-8 text-amber-600" />
          <h1 className="text-4xl font-serif text-amber-900">Themes & Personalization</h1>
        </div>

        {/* App Themes */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-amber-200 mb-8">
          <h3 className="text-2xl font-serif text-amber-900 mb-6">App Themes</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.map((theme) => (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all ${
                  currentTheme === theme.id ? 'ring-4 ring-amber-400 ring-offset-2' : ''
                }`}
                onClick={() => handleThemeChange(theme.id)}
              >
                {/* Preview image */}
                <div className="relative h-48 overflow-hidden">
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br ${theme.preview}`}
                  />
                  <img
                    src={theme.image}
                    alt={theme.name}
                    className="w-full h-full object-cover opacity-40 mix-blend-multiply"
                  />
                  {currentTheme === theme.id && (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className={`p-4 bg-gradient-to-br ${theme.accent}`}>
                  <h4 className="font-serif text-white mb-1">{theme.name}</h4>
                  <p className="text-white/90 text-sm">{theme.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Diary Cover Selection */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-amber-200 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Book className="w-6 h-6 text-amber-600" />
            <h3 className="text-2xl font-serif text-amber-900">Diary Cover</h3>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {diaryCovers.map((cover) => (
              <motion.button
                key={cover.id}
                onClick={() => handleCoverChange(cover.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative aspect-[3/4] rounded-xl ${cover.color} shadow-lg transition-all ${
                  selectedCover === cover.id ? 'ring-4 ring-amber-400 ring-offset-2' : ''
                }`}
              >
                {/* Book spine effect */}
                <div className="absolute left-2 top-4 bottom-4 w-1 bg-black/20 rounded-full" />
                
                {/* Check mark */}
                {selectedCover === cover.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                )}
                
                {/* Cover name */}
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white/90 text-xs text-center drop-shadow-lg">
                    {cover.name}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </Card>

        {/* Font & Writing Style */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-amber-200">
          <h3 className="text-2xl font-serif text-amber-900 mb-6">Font & Writing Style</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-serif text-amber-800 mb-4">Font Styles</h4>
              <div className="space-y-3">
                {[
                  { name: 'Modern Sans', class: 'font-sans', sample: 'The quick brown fox jumps over the lazy dog.' },
                  { name: 'Classic Serif', class: 'font-serif', sample: 'The quick brown fox jumps over the lazy dog.' },
                  { name: 'Handwriting', class: 'font-handwriting', sample: 'The quick brown fox jumps over the lazy dog.' },
                  { name: 'Typewriter', class: 'font-mono', sample: 'The quick brown fox jumps over the lazy dog.' },
                ].map((font) => (
                  <div
                    key={font.name}
                    className="p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-all cursor-pointer border border-amber-200"
                  >
                    <p className="text-sm text-amber-700 mb-2">{font.name}</p>
                    <p className={`${font.class} text-amber-900`}>{font.sample}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-serif text-amber-800 mb-4">Page Styles</h4>
              <div className="space-y-3">
                {[
                  { name: 'Lined Paper', icon: '📝' },
                  { name: 'Dotted Grid', icon: '⋮' },
                  { name: 'Blank Canvas', icon: '□' },
                  { name: 'Graph Paper', icon: '⊞' },
                ].map((style) => (
                  <div
                    key={style.name}
                    className="p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-all cursor-pointer border border-amber-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{style.icon}</span>
                      <span className="text-amber-900">{style.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
