'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export function CTA() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[400px] w-[600px] rounded-full bg-gradient-to-r from-violet-500/10 to-indigo-500/10 blur-3xl" />
        </div>
      </div>

      <div className="container max-w-screen-2xl px-4 py-16 md:px-8 md:py-24">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Ready to get started?
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Build beautiful mobile apps{' '}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              faster
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start building with mcellui components today. Copy, paste, and customize
            to match your brand.
          </p>

          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/docs"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25"
            >
              Read the Docs
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/docs/components"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-md"
            >
              Explore Components
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
