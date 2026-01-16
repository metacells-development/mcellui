# Phase 7: Documentation & Landing Page

## Overview

Build a shadcn-style documentation site for nativeui with live React Native Web previews, block gallery, and compelling landing page.

**Target:** Production-ready docs site deployed on Netlify

---

## Tech Stack

Based on analysis of shadcn/ui's actual codebase (https://github.com/shadcn-ui/ui):

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | Next.js 15 (App Router) | shadcn uses latest Next.js |
| Content | **fumadocs** (fumadocs-core, fumadocs-mdx, fumadocs-ui) | What shadcn actually uses (not contentlayer!) |
| Styling | Tailwind CSS v4 | Consistent with shadcn aesthetic |
| Previews | React Native Web | Live component rendering |
| Search UI | **cmdk** | Command palette (⌘K) - shadcn standard |
| Search Logic | Fuse.js | Simple fuzzy search backend |
| Icons | Lucide React | Same as shadcn |
| Syntax | **shiki + rehype-pretty-code** | Code highlighting with themes |
| Toasts | sonner | Toast notifications |
| Animations | motion (framer-motion) | Subtle UI animations |
| URL State | nuqs | URL query state management |
| Deploy | Netlify | Free tier, easy setup |

### Key Dependencies (from shadcn/ui)

```json
{
  "fumadocs-core": "^15.x",
  "fumadocs-mdx": "^11.x",
  "fumadocs-ui": "^15.x",
  "cmdk": "^1.x",
  "shiki": "^1.x",
  "rehype-pretty-code": "latest",
  "sonner": "^1.x",
  "motion": "^11.x",
  "nuqs": "^2.x",
  "fuse.js": "^7.x",
  "lucide-react": "latest"
}

---

## Site Structure

```
/                           → Landing Page (Hero + Features + Demo)
/docs                       → Getting Started
/docs/installation          → Installation guide
/docs/theming               → Theme configuration
/docs/cli                   → CLI commands reference
/docs/components            → Component index
/docs/components/[slug]     → Individual component pages (43)
/blocks                     → Block gallery grid
/blocks/[slug]              → Individual block pages (14)
/screens                    → Screen templates (2)
```

---

## Page Specifications

### 1. Landing Page (`/`)

**Hero Section**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              Beautiful UI components for                    │
│                 Expo & React Native                         │
│                                                             │
│     Copy-paste components. You own the code. No deps.       │
│                                                             │
│     [Get Started]  [Browse Components]  [GitHub ☆]          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Features Grid** (3 columns)
- 🎨 **8 Theme Presets** - Zinc, Slate, Blue, Green, Rose, Orange, Violet, Stone
- 📱 **iOS + Android** - Tested on both platforms, native feel
- ⚡ **5 Second Setup** - `npx nativeui init` and you're ready
- 🎭 **Dark Mode** - System, light, dark - all supported
- 🔧 **You Own It** - No runtime dependency, copy-paste code
- ♿ **Accessible** - VoiceOver & TalkBack ready

**Live Demo Section**
- Interactive component showcase using React Native Web
- Show Button, Card, Input, Toast in action
- Theme switcher to demo presets

**Component Preview Grid**
- 6-8 featured components with hover previews
- Link to full components list

**Stats Bar**
```
43 Components  •  14 Blocks  •  2 Screens  •  8 Themes
```

**Footer**
- Links: Docs, GitHub, npm
- "Built by [metacells]"

---

### 2. Documentation Layout

**Three-Column Layout**
```
┌──────────┬─────────────────────────────────┬──────────┐
│          │                                 │          │
│ Sidebar  │         Main Content            │  TOC     │
│  220px   │         max-w-3xl               │  160px   │
│          │                                 │          │
│ - Intro  │  # Component Name               │ On this  │
│ - Install│  Description text...            │ page:    │
│ - Theme  │                                 │          │
│ - CLI    │  ┌─────────────────────────┐    │ - Install│
│          │  │ [Preview] [Code]    [⎘] │    │ - Usage  │
│ Components│ │                         │    │ - Props  │
│ - Button │  │    Live Component       │    │ - API    │
│ - Card   │  │                         │    │          │
│ - Input  │  └─────────────────────────┘    │          │
│ - ...    │                                 │          │
│          │  ## Installation                │          │
│ Blocks   │  ```bash                        │          │
│ - Login  │  npx nativeui add button        │          │
│ - ...    │  ```                            │          │
│          │                                 │          │
└──────────┴─────────────────────────────────┴──────────┘
```

**Header**
- Logo (left)
- Nav: Docs | Components | Blocks | GitHub
- Search (⌘K)
- Theme toggle (light/dark)

**Mobile Layout**
- Hamburger menu for sidebar
- TOC hidden (or collapsed)
- Full-width content

---

### 3. Component Page Template

Each of the 43 component pages follows this structure:

```markdown
---
title: Button
description: Displays a button with various styles and states.
component: true
---

# Button

Displays a button with various styles and states.

<ComponentPreview name="button-demo" />

## Installation

<Tabs defaultValue="cli">
  <TabsList>
    <TabsTrigger value="cli">CLI</TabsTrigger>
    <TabsTrigger value="manual">Manual</TabsTrigger>
  </TabsList>
  <TabsContent value="cli">
    ```bash
    npx nativeui add button
    ```
  </TabsContent>
  <TabsContent value="manual">
    Copy the code from the registry...
  </TabsContent>
</Tabs>

## Usage

```tsx
import { Button } from '@/components/ui/button';

export function MyComponent() {
  return <Button onPress={() => {}}>Click me</Button>;
}
```

## Examples

### Primary
<ComponentPreview name="button-primary" />

### Secondary
<ComponentPreview name="button-secondary" />

### Outline
<ComponentPreview name="button-outline" />

### With Icon
<ComponentPreview name="button-with-icon" />

### Loading
<ComponentPreview name="button-loading" />

## Props

<PropsTable
  data={[
    { prop: 'variant', type: '"default" | "secondary" | "outline" | "ghost" | "destructive"', default: '"default"' },
    { prop: 'size', type: '"sm" | "md" | "lg"', default: '"md"' },
    { prop: 'loading', type: 'boolean', default: 'false' },
    { prop: 'disabled', type: 'boolean', default: 'false' },
  ]}
/>
```

---

### 4. Blocks Gallery (`/blocks`)

**Grid Layout**
```
┌─────────────────────────────────────────────────────────┐
│  Blocks                                                 │
│  Pre-built screen sections ready to copy-paste          │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │             │  │             │  │             │     │
│  │  Login      │  │  Signup     │  │  Profile    │     │
│  │  Block      │  │  Block      │  │  Block      │     │
│  │             │  │             │  │             │     │
│  │ ─────────── │  │ ─────────── │  │ ─────────── │     │
│  │ Auth flow   │  │ Registration│  │ User info   │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ Settings    │  │ Empty State │  │ Error State │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                         │
│  ... (14 total blocks)                                  │
└─────────────────────────────────────────────────────────┘
```

**Card Component**
- Preview image (light mode)
- Title
- Short description
- Hover: slight scale + shadow
- Click: navigate to detail page

**Block Detail Page**
- Full preview (React Native Web)
- Code with copy button
- Installation command
- Dependencies listed

---

## Custom MDX Components

Based on shadcn/ui's actual MDX components:

### `<ComponentPreview />`

Main component demo with live preview and code tabs.

```tsx
interface ComponentPreviewProps {
  name: string;           // Registry example name (e.g., "button-demo")
  description?: string;   // Optional description
  hideCode?: boolean;     // Hide code tab
  align?: 'center' | 'start' | 'end';
}

// Usage in MDX:
<ComponentPreview name="button-demo" description="A button with default styling." />
```

Features:
- Tab toggle: Preview | Code
- Copy button (clipboard API)
- Expand to full width
- React Native Web rendering in preview
- Syntax highlighting via rehype-pretty-code

### `<ComponentSource />`

Show component source code directly.

```tsx
interface ComponentSourceProps {
  name: string;           // Component name from registry
}

// Usage in MDX:
<ComponentSource name="button" />
```

### `<CodeTabs />`

Installation tabs for CLI vs Manual.

```tsx
// Usage in MDX:
<CodeTabs>
<Tab value="cli">
```bash
npx nativeui add button
```
</Tab>
<Tab value="manual">
Copy and paste the following code into your project.
</Tab>
</CodeTabs>
```

### `<Steps />`

Numbered step-by-step instructions.

```tsx
// Usage in MDX:
<Steps>
### Install dependencies
Run the following command.

### Add the component
Use the CLI to add the button.

### Import and use
Import the component in your file.
</Steps>
```

### `<Callout />`

Highlighted callout boxes (fumadocs built-in).

```tsx
// Usage in MDX:
<Callout type="info">
  This component requires `react-native-reanimated`.
</Callout>

<Callout type="warning">
  iOS only feature.
</Callout>
```

### Code Blocks

Automatic syntax highlighting via `rehype-pretty-code` with shiki.

Features:
- Language badge
- Copy button
- Line numbers
- Line highlighting (`{1,3-5}`)
- Word highlighting
- File name display (`title="button.tsx"`)

---

## React Native Web Integration

### Strategy

1. **Shared Components**: Create web-compatible versions of all 43 components
2. **Wrapper Layer**: `ComponentPreview` renders components in isolated container
3. **Styling Bridge**: Map React Native styles to web equivalents
4. **Animation Fallbacks**: Reanimated → CSS transitions where needed

### Compatibility Notes

| Feature | RN Web Support | Fallback |
|---------|---------------|----------|
| StyleSheet | ✅ Full | - |
| Pressable | ✅ Full | - |
| Animated (RN) | ⚠️ Partial | CSS |
| Reanimated | ⚠️ Limited | CSS transitions |
| Gesture Handler | ⚠️ Limited | Mouse events |
| Haptics | ❌ None | Skip |
| BlurView | ❌ None | backdrop-filter |

### Preview Container

```tsx
// components/docs/component-preview.tsx
export function ComponentPreview({ name }: { name: string }) {
  const Component = registry[name];

  return (
    <div className="preview-container">
      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <div className="rn-web-container">
            <Component />
          </div>
        </TabsContent>

        <TabsContent value="code">
          <CodeBlock code={registry[name].code} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

---

## Search Implementation

### Command Palette with cmdk

shadcn uses `cmdk` for the command palette UI. We'll combine it with Fuse.js for search logic.

```tsx
// components/command-menu.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { Command } from 'cmdk';
import Fuse from 'fuse.js';
import { useRouter } from 'next/navigation';
import { docs } from '@/.source'; // fumadocs source

const fuse = new Fuse(docs.getPages(), {
  keys: ['data.title', 'data.description'],
  threshold: 0.3,
  includeMatches: true,
});

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();

  // ⌘K to open
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const results = search ? fuse.search(search).slice(0, 10) : [];

  return (
    <Command.Dialog open={open} onOpenChange={setOpen}>
      <Command.Input
        value={search}
        onValueChange={setSearch}
        placeholder="Search components..."
      />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        {results.map(({ item }) => (
          <Command.Item
            key={item.url}
            onSelect={() => {
              router.push(item.url);
              setOpen(false);
            }}
          >
            {item.data.title}
          </Command.Item>
        ))}
      </Command.List>
    </Command.Dialog>
  );
}
```

### Features

- Trigger: Cmd+K / Ctrl+K
- Fuzzy search with Fuse.js
- Categorized results (Components, Blocks, Docs)
- Keyboard navigation (arrow keys, enter)
- Recent searches (optional enhancement)

---

## Design System

### Colors (Tailwind)

```css
/* Following shadcn's zinc palette */
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4.8% 95.9%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --border: 240 5.9% 90%;
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  /* ... dark variants */
}
```

### Typography

```css
/* Inter for body, Geist Mono for code */
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'Geist Mono', 'Fira Code', monospace;
```

### Spacing

Following Tailwind defaults (4px base).

---

## Folder Structure

Based on shadcn/ui's actual structure with fumadocs:

```
apps/docs/
├── app/
│   ├── layout.tsx                  # Root layout with providers
│   ├── page.tsx                    # Landing page
│   ├── (app)/                      # Route group for main app
│   │   └── docs/
│   │       ├── layout.tsx          # Docs layout (fumadocs DocsLayout)
│   │       └── [[...slug]]/
│   │           └── page.tsx        # Dynamic doc pages
│   ├── blocks/
│   │   ├── page.tsx                # Block gallery grid
│   │   └── [slug]/
│   │       └── page.tsx            # Block detail
│   └── api/
│       └── og/
│           └── route.tsx           # OG image generation
├── components/
│   ├── docs/
│   │   ├── component-preview.tsx   # Live RN Web preview
│   │   ├── component-source.tsx    # Show component source
│   │   ├── props-table.tsx
│   │   ├── code-tabs.tsx           # CLI/Manual tabs
│   │   └── callout.tsx
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── mobile-nav.tsx
│   │   └── footer.tsx
│   ├── landing/
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── demo.tsx
│   │   └── stats.tsx
│   ├── command-menu.tsx            # ⌘K search (cmdk)
│   └── ui/                         # shadcn/ui components for docs site
│       ├── button.tsx
│       ├── tabs.tsx
│       └── ...
├── content/
│   └── docs/                       # MDX content (fumadocs)
│       ├── index.mdx               # /docs landing
│       ├── installation.mdx
│       ├── theming.mdx
│       ├── cli.mdx
│       └── components/
│           ├── button.mdx
│           ├── card.mdx
│           └── ... (43 component docs)
├── registry/                       # Component registry for previews
│   ├── ui/                         # RN Web component wrappers
│   │   ├── button.tsx
│   │   └── ...
│   ├── examples/                   # Demo examples
│   │   ├── button-demo.tsx
│   │   ├── button-primary.tsx
│   │   └── ...
│   └── blocks/                     # Block previews
│       ├── login-block.tsx
│       └── ...
├── lib/
│   ├── registry.ts                 # Registry loader
│   ├── rehype.ts                   # rehype-pretty-code config
│   └── utils.ts
├── styles/
│   └── globals.css
├── .source.ts                      # fumadocs source config
├── source.config.ts                # fumadocs MDX config
├── next.config.mjs
├── tailwind.config.ts
├── components.json                 # shadcn/ui config (for docs site UI)
└── package.json
```

### Key Config Files

**`.source.ts`** (fumadocs source)
```ts
import { docs } from '@/.source';

export { docs };
```

**`source.config.ts`** (fumadocs MDX)
```ts
import { defineDocs, defineConfig } from 'fumadocs-mdx/config';

export const docs = defineDocs({
  dir: 'content/docs',
});

export default defineConfig({
  mdxOptions: {
    rehypePlugins: [
      // rehype-pretty-code config
    ],
  },
});
```

---

## Content Migration

### From Registry to Docs

For each component in `packages/registry/`:

1. Create MDX file in `content/docs/components/`
2. Create demo components in `registry/`
3. Extract props from TypeScript interfaces
4. Write usage examples

### Automation Script

```bash
# scripts/generate-docs.ts
# Reads registry.json, generates MDX stubs
```

---

## Deployment (Netlify)

### netlify.toml

```toml
[build]
  command = "npm run build"
  publish = "apps/docs/.next"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Build Command

```bash
cd apps/docs && npm run build
```

### Environment Variables

```
NEXT_PUBLIC_SITE_URL=https://nativeui.netlify.app
```

---

## Milestones

### Milestone 1: Foundation
- [ ] Next.js 15 setup with App Router
- [ ] Tailwind CSS v4 + shadcn/ui components (for docs site)
- [ ] fumadocs setup (fumadocs-core, fumadocs-mdx, fumadocs-ui)
- [ ] Basic layout (header, mobile nav, footer)
- [ ] Dark mode toggle (next-themes)
- [ ] rehype-pretty-code for syntax highlighting

### Milestone 2: Landing Page
- [ ] Hero section with tagline
- [ ] Features grid (6 features)
- [ ] Stats bar (43 components, 14 blocks, etc.)
- [ ] Footer with links
- [ ] Responsive design
- [ ] Subtle animations (motion)

### Milestone 3: Docs Infrastructure
- [ ] fumadocs DocsLayout (sidebar + TOC)
- [ ] MDX components (ComponentPreview, CodeTabs, Steps, Callout)
- [ ] Command menu with cmdk (⌘K search)
- [ ] Fuse.js search backend
- [ ] Mobile navigation drawer

### Milestone 4: Component Pages
- [ ] React Native Web integration
- [ ] ComponentPreview with live rendering
- [ ] ComponentSource for code display
- [ ] PropsTable component
- [ ] Generate 43 component MDX files
- [ ] Create example components for previews

### Milestone 5: Blocks Gallery
- [ ] Grid layout with preview cards
- [ ] Hover effects (scale + shadow)
- [ ] Block detail pages
- [ ] 14 block MDX files
- [ ] 2 screen pages

### Milestone 6: Polish & Deploy
- [ ] SEO (meta tags, sitemap)
- [ ] OG image generation
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Netlify deployment
- [ ] Analytics (optional)

---

## Success Criteria

1. **Lighthouse Score**: 90+ on all metrics
2. **Mobile Responsive**: Works perfectly on all devices
3. **Search**: Finds any component in <100ms
4. **Previews**: All 43 components render correctly in RN Web
5. **Copy-Paste**: Code blocks copy cleanly
6. **Dark Mode**: Seamless toggle, persisted preference

---

## Future Enhancements (Post-v1)

- [ ] Theme customizer (visual editor)
- [ ] Expo Snack embeds for full interactivity
- [ ] Component changelog
- [ ] AI search with natural language
- [ ] Community showcase
- [ ] Versioned docs

---

## References

- [shadcn/ui](https://ui.shadcn.com) - Primary inspiration
- [shadcn/ui GitHub](https://github.com/shadcn-ui/ui) - Source code reference
- [fumadocs](https://fumadocs.vercel.app) - Documentation framework (what shadcn uses)
- [cmdk](https://cmdk.paco.me) - Command palette component
- [rehype-pretty-code](https://rehype-pretty.pages.dev) - Syntax highlighting
- [React Native Web](https://necolas.github.io/react-native-web/) - Web rendering
- [Tailwind CSS v4](https://tailwindcss.com/docs) - Styling
