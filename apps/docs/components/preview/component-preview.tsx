'use client';

import { ReactNode, useState, createContext, useContext, Children, cloneElement, isValidElement } from 'react';
import { PhoneFrame } from './phone-frame';
import { Sun, Moon, Monitor, Smartphone } from 'lucide-react';

// Context for dark mode
const PreviewDarkContext = createContext(false);
export const usePreviewDark = () => useContext(PreviewDarkContext);

interface ComponentPreviewProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export function ComponentPreview({ children, className = '', title }: ComponentPreviewProps) {
  const [dark, setDark] = useState(false);

  // Clone children and pass dark prop
  const childrenWithProps = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child as React.ReactElement<any>, { dark });
    }
    return child;
  });

  return (
    <PreviewDarkContext.Provider value={dark}>
      <div className={`relative my-6 overflow-hidden rounded-xl border border-border/50 bg-gradient-to-b from-muted/30 to-muted/10 ${className}`}>
        {/* Header with controls */}
        <div className="flex items-center justify-between border-b border-border/50 bg-muted/30 px-4 py-3">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-muted-foreground" />
            {title && (
              <span className="text-sm font-medium text-foreground">{title}</span>
            )}
            {!title && (
              <span className="text-sm text-muted-foreground">Preview</span>
            )}
          </div>

          {/* Theme toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-border/50 bg-background/50 p-1">
            <button
              onClick={() => setDark(false)}
              className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-all ${
                !dark
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
              aria-label="Light mode"
            >
              <Sun className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setDark(true)}
              className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-all ${
                dark
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
              aria-label="Dark mode"
            >
              <Moon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Preview area */}
        <div className="relative">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 dot-pattern opacity-30" />

          <PhoneFrame dark={dark}>
            {childrenWithProps}
          </PhoneFrame>
        </div>
      </div>
    </PreviewDarkContext.Provider>
  );
}
