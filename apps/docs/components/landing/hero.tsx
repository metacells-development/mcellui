'use client';

import Link from 'next/link';
import { ArrowRight, Copy, Check, Github, Terminal } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

export function Hero() {
  const [copied, setCopied] = useState(false);

  const copyCommand = () => {
    navigator.clipboard.writeText('npx mcellui init');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[600px] w-[600px] rounded-full bg-gradient-to-r from-violet-500/20 to-indigo-500/20 blur-3xl" />
        </div>
        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4">
          <div className="h-[400px] w-[400px] rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 blur-3xl" />
        </div>
      </div>

      <div className="container flex max-w-screen-2xl flex-col items-center justify-center gap-8 px-4 pb-16 pt-24 text-center md:px-8 md:pb-24 md:pt-32">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="https://github.com/metacells/mcellui"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <span className="flex h-2 w-2 rounded-full bg-green-500" />
            <span>Now open source</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </motion.div>

        {/* Heading */}
        <motion.div
          className="flex max-w-4xl flex-col items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Beautiful UI components for{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Expo & React Native
              </span>
              <motion.span
                className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-violet-600 to-indigo-600"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </span>
          </h1>
          <p className="max-w-[42rem] text-lg text-muted-foreground sm:text-xl">
            Copy-paste components built with React Native. Customizable. Open Source.
            You own the code. <span className="font-medium text-foreground">No dependencies.</span>
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="/docs"
            className="group inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/docs/components"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-input bg-background px-6 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Browse Components
          </Link>
          <Link
            href="https://github.com/metacells/mcellui"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-input bg-background px-6 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Github className="h-4 w-4" />
            GitHub
          </Link>
        </motion.div>

        {/* Quick Install */}
        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="group relative flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm transition-all hover:border-foreground/20 hover:shadow-md">
            <Terminal className="h-4 w-4 text-muted-foreground" />
            <code className="font-mono text-sm">npx mcellui init</code>
            <button
              onClick={copyCommand}
              className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-accent"
              aria-label="Copy command"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
