'use client';

import {
  Palette,
  Smartphone,
  Zap,
  Moon,
  Code,
  Accessibility,
} from 'lucide-react';
import { motion } from 'motion/react';

const features = [
  {
    icon: Palette,
    title: '8 Theme Presets',
    description:
      'Zinc, Slate, Blue, Green, Rose, Orange, Violet, Stone - all ready to use with one command.',
  },
  {
    icon: Smartphone,
    title: 'iOS + Android',
    description:
      'Tested on both platforms with native feel. Respects platform conventions automatically.',
  },
  {
    icon: Zap,
    title: '5 Second Setup',
    description:
      'Run npx mcellui init and start building immediately. No complex configuration needed.',
  },
  {
    icon: Moon,
    title: 'Dark Mode Built-in',
    description:
      'System, light, dark - all supported out of the box with seamless transitions.',
  },
  {
    icon: Code,
    title: 'You Own the Code',
    description:
      'No runtime dependency. Copy-paste code that lives in your project. Modify freely.',
  },
  {
    icon: Accessibility,
    title: 'Accessible by Default',
    description:
      'VoiceOver & TalkBack ready. WCAG compliant where applicable. No extra work needed.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function Features() {
  return (
    <section className="container max-w-screen-2xl px-4 py-16 md:px-8 md:py-24">
      <motion.div
        className="mx-auto max-w-2xl text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Everything you need to build beautiful apps
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          A comprehensive component library designed for Expo and React Native
          with developer experience in mind.
        </p>
      </motion.div>

      <motion.div
        className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={itemVariants}
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-foreground/20 hover:shadow-lg hover:shadow-primary/5"
          >
            {/* Hover gradient */}
            <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
              <feature.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
