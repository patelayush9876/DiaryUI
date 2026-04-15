'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast border border-border bg-card/90 text-card-foreground shadow-lg backdrop-blur-md',
          title: 'text-foreground font-medium',
          description: 'text-muted-foreground',
          actionButton: 'bg-primary text-primary-foreground hover:opacity-90',
          cancelButton: 'bg-secondary text-secondary-foreground hover:bg-accent',
        },
      }}
      style={
        {
          '--normal-bg': 'var(--card)',
          '--normal-text': 'var(--card-foreground)',
          '--normal-border': 'var(--border)',
          '--success-bg': 'var(--card)',
          '--success-text': 'var(--foreground)',
          '--error-bg': 'var(--card)',
          '--error-text': 'var(--destructive)',
          '--warning-bg': 'var(--card)',
          '--warning-text': 'var(--primary)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
