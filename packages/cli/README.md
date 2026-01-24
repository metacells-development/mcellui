# @nativeui/cli

CLI for adding beautifully designed, accessible UI components to your Expo and React Native projects.

**Copy-paste components. You own the code.**

## Installation

```bash
npx @nativeui/cli init
```

Or install globally:

```bash
npm install -g @nativeui/cli
nativeui init
```

## Quick Start

1. **Initialize your project:**

```bash
npx @nativeui/cli init
```

This creates a `mcellui.config.ts` with your theme preferences.

2. **Add components:**

```bash
npx @nativeui/cli add button
npx @nativeui/cli add card input badge
```

3. **Use in your app:**

```tsx
import { Button } from '@/components/ui/button';

export function MyScreen() {
  return (
    <Button onPress={() => console.log('Pressed!')}>
      Get Started
    </Button>
  );
}
```

## Commands

### `init`

Initialize nativeui in your project.

```bash
npx @nativeui/cli init
```

Creates `mcellui.config.ts` with theme configuration.

### `add <components...>`

Add one or more components to your project.

```bash
npx @nativeui/cli add button
npx @nativeui/cli add card input badge avatar
```

### `list`

List all available components.

```bash
npx @nativeui/cli list
npx @nativeui/cli list --category="Inputs"
```

### `pick`

Interactive component picker with categories.

```bash
npx @nativeui/cli pick
```

### `diff`

Show available updates for installed components.

```bash
npx @nativeui/cli diff
npx @nativeui/cli diff button
```

### `update`

Update installed components to latest version.

```bash
npx @nativeui/cli update button
npx @nativeui/cli update --all
npx @nativeui/cli update --all --dry-run
```

### `doctor`

Check project setup and diagnose issues.

```bash
npx @nativeui/cli doctor
```

### `create`

Scaffold a new custom component.

```bash
npx @nativeui/cli create my-component
npx @nativeui/cli create my-button --template=pressable
```

Templates: `basic`, `animated`, `pressable`, `input`

## Configuration

`mcellui.config.ts`:

```ts
import { defineConfig } from '@nativeui/cli';

export default defineConfig({
  // Theme preset: zinc, slate, stone, blue, green, rose, orange, violet
  theme: 'violet',

  // Border radius: none, sm, md, lg, full
  radius: 'md',

  // Color scheme: light, dark, system
  colorScheme: 'system',

  // Output directory for components
  componentsDir: './components/ui',
});
```

## Available Components

### Inputs & Forms (13)
Button, Input, Textarea, Checkbox, Switch, Radio Group, Select, Slider, Stepper, Label, Search Input, DateTime Picker, Form

### Data Display (9)
Card, Badge, Avatar, Avatar Stack, Skeleton, Progress, Rating, Image, Stories

### Overlays & Feedback (6)
Dialog, Sheet, Toast, Alert Dialog, Action Sheet, Tooltip

### Navigation (3)
Tabs, Accordion, Segmented Control

### Mobile Patterns (2)
Pull to Refresh, Swipeable Row

### Layout (7)
Separator, Spinner, List, Horizontal List, Section Header, Chip, FAB

### Media (2)
Carousel, Image Gallery

## Blocks

Pre-built screen sections:

```bash
npx @nativeui/cli add login-block
npx @nativeui/cli add profile-block settings-list-block
```

Available: `login-block`, `signup-block`, `profile-block`, `settings-list-block`, `empty-state-block`, `error-state-block`, and more.

## Requirements

- Node.js 18+
- Expo SDK 54+ or React Native 0.76+
- TypeScript recommended

## Links

- [Documentation](https://mcellui.dev/docs)
- [Components](https://mcellui.dev/docs/components)
- [GitHub](https://github.com/metacells/nativeui)

## License

MIT
