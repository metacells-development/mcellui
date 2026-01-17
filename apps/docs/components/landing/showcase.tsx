'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, Layers, ToggleLeft, SlidersHorizontal, MessageSquare, Bell, List } from 'lucide-react';

const showcaseComponents = [
  {
    name: 'Button',
    description: 'Interactive button with multiple variants and states',
    href: '/docs/components/button',
    icon: Layers,
    color: 'from-violet-500 to-purple-600',
  },
  {
    name: 'Switch',
    description: 'Toggle switch with smooth animations',
    href: '/docs/components/switch',
    icon: ToggleLeft,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Slider',
    description: 'Range slider with gesture support',
    href: '/docs/components/slider',
    icon: SlidersHorizontal,
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'Dialog',
    description: 'Modal dialogs with backdrop blur',
    href: '/docs/components/dialog',
    icon: MessageSquare,
    color: 'from-orange-500 to-amber-500',
  },
  {
    name: 'Toast',
    description: 'Non-intrusive notification toasts',
    href: '/docs/components/toast',
    icon: Bell,
    color: 'from-rose-500 to-pink-500',
  },
  {
    name: 'Accordion',
    description: 'Collapsible content sections',
    href: '/docs/components/accordion',
    icon: List,
    color: 'from-indigo-500 to-blue-500',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
    },
  },
};

export function Showcase() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-muted/30">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] rounded-full bg-gradient-to-r from-violet-500/10 to-transparent blur-3xl" />
        <div className="absolute right-1/4 top-0 h-[300px] w-[300px] rounded-full bg-gradient-to-r from-blue-500/10 to-transparent blur-3xl" />
      </div>

      <div className="container max-w-screen-2xl px-4 py-16 md:px-8 md:py-24">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built for mobile
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every component is designed with mobile-first principles. Native
            gestures, haptic feedback, and platform-specific styling.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {showcaseComponents.map((component) => (
            <motion.div key={component.name} variants={itemVariants}>
              <Link
                href={component.href}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-foreground/20 hover:shadow-lg"
              >
                {/* Gradient icon background */}
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${component.color}`}>
                  <component.icon className="h-5 w-5 text-white" />
                </div>

                <h3 className="text-lg font-semibold">{component.name}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">
                  {component.description}
                </p>

                <div className="mt-4 flex items-center text-sm font-medium text-primary">
                  View component
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>

                {/* Hover gradient overlay */}
                <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            href="/docs/components"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            View all 43 components
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
