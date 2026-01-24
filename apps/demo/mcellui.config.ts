/**
 * McellUI Configuration
 *
 * This file defines your app's design system.
 * All components will automatically use these values.
 *
 * Available presets:
 * - theme: 'zinc' | 'slate' | 'stone' | 'blue' | 'green' | 'rose' | 'orange' | 'violet'
 * - radius: 'none' | 'sm' | 'md' | 'lg' | 'full'
 */

import { defineConfig } from '@metacells/mcellui-core';

export default defineConfig({
  // ============================================
  // Theme Configuration (runtime)
  // ============================================

  // Color theme preset
  theme: 'blue',

  // Border radius preset
  radius: 'md',

  // Default color scheme
  colorScheme: 'system',

  // Custom color overrides (applied to both light and dark)
  // colors: {
  //   primary: '#6366F1',
  // },

  // Light mode specific overrides
  // lightColors: {
  //   background: '#FFFFFF',
  //   foreground: '#0A0A0A',
  // },

  // Dark mode specific overrides
  // darkColors: {
  //   background: '#0A0A0A',
  //   foreground: '#FAFAFA',
  // },

  // Custom fonts
  // fonts: {
  //   sans: 'Inter_400Regular',
  //   heading: 'PlayfairDisplay_700Bold',
  //   mono: 'JetBrainsMono_400Regular',
  // },

  // Component defaults
  components: {
    button: {
      defaultVariant: 'default',
      defaultSize: 'md',
    },
    badge: {
      defaultVariant: 'default',
      defaultSize: 'md',
    },
    avatar: {
      defaultSize: 'md',
    },
  },

  // ============================================
  // CLI Configuration (used by npx mcellui add)
  // ============================================

  // Path where components will be installed
  componentsPath: './components/ui',

  // Path where utilities (cn, etc.) will be installed
  utilsPath: './lib/utils',

  // Style preset
  style: 'default',

  // Path aliases for imports
  aliases: {
    components: '@/components',
    utils: '@/lib/utils',
  },
});
