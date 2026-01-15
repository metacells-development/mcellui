/**
 * NativeUI Configuration
 *
 * Configure your entire design system in one place.
 *
 * @example
 * ```ts
 * // nativeui.config.ts
 * import { defineConfig } from '@nativeui/core';
 *
 * export default defineConfig({
 *   theme: 'blue',
 *   radius: 'lg',
 *   colors: {
 *     primary: '#6366F1',
 *   },
 * });
 * ```
 *
 * @example
 * ```tsx
 * // App.tsx
 * import { ConfigProvider } from '@nativeui/core';
 * import config from './nativeui.config';
 *
 * export default function App() {
 *   return (
 *     <ConfigProvider config={config}>
 *       <YourApp />
 *     </ConfigProvider>
 *   );
 * }
 * ```
 */

export { defineConfig, resolveConfig } from './defineConfig';
export { ConfigProvider, useConfig } from './ConfigProvider';
export type {
  NativeUIConfig,
  ResolvedNativeUIConfig,
} from './types';
export { defaultConfig } from './types';
