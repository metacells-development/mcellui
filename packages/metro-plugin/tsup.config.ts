import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/emptyConfig.ts'],
  format: ['cjs'],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: true,
});
