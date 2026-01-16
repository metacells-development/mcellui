import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isWatch = process.argv.includes('--watch');

// Build main.ts (Figma sandbox)
// WICHTIG: target: 'es2017' - Figma's Sandbox unterstützt kein Optional Chaining (?.)
const mainConfig = {
  entryPoints: ['src/main.ts'],
  bundle: true,
  outfile: 'dist/main.js',
  format: 'iife',
  target: 'es2017',
  platform: 'browser',
  sourcemap: false,
  minify: !isWatch,
  define: {
    'process.env.NODE_ENV': isWatch ? '"development"' : '"production"',
  },
};

// Build ui.tsx (React UI)
const uiConfig = {
  entryPoints: ['src/ui.tsx'],
  bundle: true,
  outfile: 'dist/ui.js',
  format: 'iife',
  target: 'es2020',
  platform: 'browser',
  sourcemap: false,
  minify: !isWatch,
  define: {
    'process.env.NODE_ENV': isWatch ? '"development"' : '"production"',
  },
  loader: {
    '.svg': 'dataurl',
    '.png': 'dataurl',
  },
};

// Generate HTML file with inlined JS
async function buildHTML() {
  const uiJs = fs.readFileSync(path.join(__dirname, 'dist/ui.js'), 'utf8');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      line-height: 1.5;
      color: var(--figma-color-text);
      background: var(--figma-color-bg);
    }

    :root {
      --spacing-xs: 4px;
      --spacing-sm: 8px;
      --spacing-md: 12px;
      --spacing-lg: 16px;
      --radius-sm: 4px;
      --radius-md: 6px;
    }

    /* Figma-like button styles */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-md);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
      border: none;
    }

    .btn-primary {
      background: var(--figma-color-bg-brand);
      color: var(--figma-color-text-onbrand);
    }

    .btn-primary:hover {
      background: var(--figma-color-bg-brand-hover);
    }

    .btn-secondary {
      background: var(--figma-color-bg-secondary);
      color: var(--figma-color-text);
    }

    .btn-secondary:hover {
      background: var(--figma-color-bg-tertiary);
    }

    /* Section styles */
    .section {
      padding: var(--spacing-lg);
      border-bottom: 1px solid var(--figma-color-border);
    }

    .section-title {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--figma-color-text-secondary);
      margin-bottom: var(--spacing-sm);
    }

    /* Checkbox styles */
    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-xs) 0;
    }

    .checkbox-item input {
      width: 14px;
      height: 14px;
      accent-color: var(--figma-color-bg-brand);
    }

    /* Select styles */
    .select {
      width: 100%;
      padding: var(--spacing-sm);
      border-radius: var(--radius-sm);
      border: 1px solid var(--figma-color-border);
      background: var(--figma-color-bg);
      color: var(--figma-color-text);
      font-size: 12px;
    }

    /* Code preview */
    .code-preview {
      background: var(--figma-color-bg-secondary);
      border-radius: var(--radius-md);
      padding: var(--spacing-md);
      font-family: 'SF Mono', Monaco, monospace;
      font-size: 11px;
      line-height: 1.6;
      overflow-x: auto;
      white-space: pre;
    }

    /* Status bar */
    .status-bar {
      padding: var(--spacing-sm) var(--spacing-lg);
      background: var(--figma-color-bg-secondary);
      font-size: 11px;
      color: var(--figma-color-text-secondary);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .status-success {
      color: var(--figma-color-text-success);
    }

    /* Loading spinner */
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid var(--figma-color-border);
      border-top-color: var(--figma-color-bg-brand);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Tabs */
    .tabs {
      display: flex;
      border-bottom: 1px solid var(--figma-color-border);
    }

    .tab {
      flex: 1;
      padding: var(--spacing-sm) var(--spacing-md);
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      font-size: 11px;
      font-weight: 500;
      color: var(--figma-color-text-secondary);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .tab:hover {
      color: var(--figma-color-text);
      background: var(--figma-color-bg-hover);
    }

    .tab-active {
      color: var(--figma-color-text);
      border-bottom-color: var(--figma-color-bg-brand);
    }

    /* Disabled button */
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>${uiJs}</script>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, 'dist/ui.html'), html);
}

async function build() {
  // Ensure dist directory exists
  if (!fs.existsSync(path.join(__dirname, 'dist'))) {
    fs.mkdirSync(path.join(__dirname, 'dist'));
  }

  if (isWatch) {
    console.log('Starting watch mode...');

    const mainCtx = await esbuild.context(mainConfig);
    const uiCtx = await esbuild.context(uiConfig);

    // Initial build
    await mainCtx.rebuild();
    await uiCtx.rebuild();
    await buildHTML();
    console.log('Initial build complete');

    // Watch for changes
    await mainCtx.watch();
    await uiCtx.watch();

    // Rebuild HTML when UI changes
    fs.watch(path.join(__dirname, 'dist/ui.js'), async () => {
      await buildHTML();
      console.log('Rebuilt HTML');
    });
  } else {
    console.log('Building for production...');

    await esbuild.build(mainConfig);
    await esbuild.build(uiConfig);
    await buildHTML();

    console.log('Build complete!');
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
