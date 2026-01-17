import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { RootProvider } from 'fumadocs-ui/provider';
import { Providers } from '@/components/providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'mcellui - Beautiful UI components for Expo & React Native',
    template: '%s | mcellui',
  },
  description:
    'Copy-paste UI components for Expo and React Native. You own the code. No dependencies.',
  keywords: [
    'react native',
    'expo',
    'ui components',
    'react native components',
    'mobile ui',
    'shadcn',
    'copy paste',
    'mcellui',
    'metacells',
  ],
  authors: [{ name: 'metacells' }],
  creator: 'metacells',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mcellui.dev',
    title: 'mcellui - Beautiful UI components for Expo & React Native',
    description:
      'Copy-paste UI components for Expo and React Native. You own the code. No dependencies.',
    siteName: 'mcellui',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'mcellui - Beautiful UI components for Expo & React Native',
    description:
      'Copy-paste UI components for Expo and React Native. You own the code. No dependencies.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <RootProvider>
          <Providers>
            {children}
          </Providers>
        </RootProvider>
      </body>
    </html>
  );
}
