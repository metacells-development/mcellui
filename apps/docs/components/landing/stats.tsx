'use client';

import { motion, animate } from 'motion/react';
import { useEffect, useState } from 'react';
import { Layers, LayoutGrid, Smartphone, Palette } from 'lucide-react';

const stats = [
  {
    value: 43,
    label: 'Components',
    suffix: '+',
    icon: Layers,
    description: 'UI primitives',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    value: 14,
    label: 'Blocks',
    suffix: '',
    icon: LayoutGrid,
    description: 'Pre-built sections',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    value: 10,
    label: 'Screens',
    suffix: '',
    icon: Smartphone,
    description: 'Full templates',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    value: 8,
    label: 'Themes',
    suffix: '',
    icon: Palette,
    description: 'Color presets',
    gradient: 'from-orange-500 to-amber-500',
  },
];

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;

    const controls = animate(0, value, {
      duration: 1.5,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
      onComplete: () => {
        setHasAnimated(true);
      },
    });

    return () => controls.stop();
  }, [value, hasAnimated]);

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
}

export function Stats() {
  const [isInView, setIsInView] = useState(false);

  return (
    <section className="relative overflow-hidden border-y border-border">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50" />

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

      <div className="container relative max-w-screen-2xl px-4 py-12 md:px-8 md:py-16">
        <motion.div
          className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          onAnimationComplete={() => setIsInView(true)}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="group relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="relative flex flex-col items-center rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-border hover:bg-card/80 hover:shadow-lg">
                {/* Icon with gradient background */}
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>

                {/* Number */}
                <div className="text-3xl font-bold tabular-nums tracking-tight md:text-4xl">
                  {isInView ? (
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  ) : (
                    '0'
                  )}
                </div>

                {/* Label */}
                <div className="mt-1 text-sm font-semibold">
                  {stat.label}
                </div>

                {/* Description */}
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {stat.description}
                </div>

                {/* Subtle gradient glow on hover */}
                <div className={`pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br ${stat.gradient} opacity-0 blur-xl transition-opacity group-hover:opacity-10`} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
