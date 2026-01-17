'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const blocks = [
  {
    name: 'Login Block',
    description: 'Complete login screen with form validation',
    href: '/docs/blocks/login-block',
  },
  {
    name: 'Signup Block',
    description: 'Registration screen with password confirmation',
    href: '/docs/blocks/signup-block',
  },
  {
    name: 'Settings List Block',
    description: 'Settings screen with grouped options',
    href: '/docs/blocks/settings-list-block',
  },
  {
    name: 'Profile Block',
    description: 'User profile display with avatar and stats',
    href: '/docs/blocks/profile-block',
  },
  {
    name: 'Empty State Block',
    description: 'Placeholder for empty content areas',
    href: '/docs/blocks/empty-state-block',
  },
  {
    name: 'Error State Block',
    description: 'Error display with retry action',
    href: '/docs/blocks/error-state-block',
  },
];

export default function BlocksPage() {
  return (
    <>
      <div className="container max-w-screen-2xl px-4 py-16 md:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Screen Blocks
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Pre-built screen templates for common mobile app patterns. Copy, paste, and customize.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {blocks.map((block) => (
            <Link
              key={block.name}
              href={block.href}
              className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-all hover:border-foreground/20 hover:shadow-md"
            >
              <div>
                <h3 className="font-semibold">{block.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {block.description}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </motion.div>
      </div>
    </>
  );
}
