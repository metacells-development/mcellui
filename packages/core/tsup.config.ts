import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/tokens/index.ts', 'src/utils/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: false,
  target: 'es2020',
  outExtension({ format }) {
    return {
      js: '.js',
    };
  },
  esbuildOptions(options) {
    options.platform = 'neutral';
  },
});
