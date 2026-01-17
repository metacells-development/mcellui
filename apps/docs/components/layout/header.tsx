'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

const navigation = [
  { name: 'Docs', href: '/docs' },
  { name: 'Components', href: '/docs/components' },
  { name: 'Blocks', href: '/docs/blocks' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="group mr-8 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/25 transition-shadow group-hover:shadow-violet-500/40">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            mcell<span className="text-gradient">ui</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex flex-1 items-center justify-end gap-2">
          {/* Search button */}
          <button
            type="button"
            className="group inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-input bg-background/50 px-3 text-sm text-muted-foreground shadow-sm transition-all hover:border-primary/50 hover:bg-accent hover:text-accent-foreground md:w-44 md:justify-start"
          >
            <Search className="h-4 w-4" />
            <span className="hidden md:inline-flex">Search...</span>
            <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded-md border bg-muted/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground transition-colors group-hover:border-primary/30 md:inline-flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>

          {/* GitHub link */}
          <Link
            href="https://github.com/metacells/mcellui"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-input bg-background/50 text-muted-foreground shadow-sm transition-all hover:border-primary/50 hover:bg-accent hover:text-accent-foreground md:inline-flex"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="currentColor"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span className="sr-only">GitHub</span>
          </Link>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-input bg-background/50 text-muted-foreground shadow-sm transition-all hover:bg-accent hover:text-accent-foreground md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-lg md:hidden">
          <nav className="container flex flex-col gap-1 px-4 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
