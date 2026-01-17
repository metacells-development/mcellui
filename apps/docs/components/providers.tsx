'use client';

import { ThemeProvider } from 'next-themes';
import { type ReactNode } from 'react';
import { Toaster } from 'sonner';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster richColors position="bottom-right" />
    </ThemeProvider>
  );
}
