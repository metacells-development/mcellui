# Feature: Testing Tools

Visual Regression Testing, Unit Tests und Performance Profiling.

## Platform Testing Matrix

### Compatibility Matrix

```
┌──────────────────┬─────────┬─────────┬─────────┬─────────┐
│                  │ iOS 17  │ iOS 18  │ Android │ Android │
│                  │         │         │   13    │   14    │
├──────────────────┼─────────┼─────────┼─────────┼─────────┤
│ Expo Go          │   ⚠️*   │   ⚠️*   │   ⚠️*   │   ⚠️*   │
│ Dev Build        │   ✓     │   ✓     │   ✓     │   ✓     │
│ Production       │   ✓     │   ✓     │   ✓     │   ✓     │
│ New Architecture │   ✓     │   ✓     │   ✓     │   ✓     │
└──────────────────┴─────────┴─────────┴─────────┴─────────┘

* Expo Go: Basic components work, native modules limited
```

### Component Compatibility

| Component | Expo Go | Dev Build | Notes |
|-----------|---------|-----------|-------|
| Button, Input, Card | ✓ | ✓ | Volle Unterstützung |
| Bottom Sheet | ✗ | ✓ | Braucht gorhom/bottom-sheet |
| Context Menu | ✗ | ✓ | Braucht zeego |
| Blur View | ✓ | ✓ | expo-blur |
| Haptics | ✓ | ✓ | expo-haptics |
| Toast (burnt) | ✗ | ✓ | Native Toast |

### Expo SDK Compatibility

```bash
# Aktuell getestete SDKs
npx mcellui doctor

# Output:
# nativeui Compatibility Check
# ├── Expo SDK: 52 ✓
# ├── React Native: 0.76 ✓
# ├── Reanimated: 3.16 ✓
# ├── Gesture Handler: 2.20 ✓
# └── New Architecture: Enabled ✓
```

## Visual Regression Testing

Automatische Screenshots für alle Komponenten mit Vergleich bei Updates.

### Setup

```bash
npx mcellui test:visual init

# Erstellt:
# - __snapshots__/ Ordner
# - visual-test.config.ts
```

### Config

```typescript
// visual-test.config.ts
export default {
  components: ['button', 'card', 'input', 'dialog'],
  variants: ['light', 'dark'],
  devices: [
    { name: 'iphone-15', width: 393, height: 852 },
    { name: 'pixel-8', width: 412, height: 915 },
  ],
  threshold: 0.01, // 1% Unterschied erlaubt
};
```

### Commands

```bash
# Snapshots erstellen
npx mcellui test:visual update

# Snapshots vergleichen
npx mcellui test:visual

# Einzelne Komponente
npx mcellui test:visual button
```

### CI Integration

```yaml
# .github/workflows/visual-tests.yml
- name: Visual Regression Tests
  run: npx mcellui test:visual

- name: Upload Diff
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: visual-diff
    path: __snapshots__/diff/
```

### Output

```
Visual Regression Tests
├── button
│   ├── light/iphone-15: ✓ Match
│   ├── light/pixel-8: ✓ Match
│   ├── dark/iphone-15: ✓ Match
│   └── dark/pixel-8: ⚠ 0.5% diff (under threshold)
├── card
│   └── ... ✓
└── input
    ├── light/iphone-15: ✗ 3.2% diff
    └── Diff saved to: __snapshots__/diff/input-light-iphone-15.png
```

## Unit Testing

### Setup

```bash
npm install -D @testing-library/react-native jest
```

### Component Tests

```typescript
// __tests__/button.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../components/ui/button';

describe('Button', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button onPress={onPress}>Click</Button>);

    fireEvent.press(getByText('Click'));
    expect(onPress).toHaveBeenCalled();
  });

  it('shows spinner when loading', () => {
    const { getByTestId } = render(<Button loading>Click</Button>);
    expect(getByTestId('spinner')).toBeTruthy();
  });

  it('is disabled when disabled prop is true', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button disabled onPress={onPress}>Click</Button>
    );

    fireEvent.press(getByText('Click'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
```

### Snapshot Tests

```typescript
import { render } from '@testing-library/react-native';
import { Button } from '../components/ui/button';

describe('Button Snapshots', () => {
  it('primary variant', () => {
    const tree = render(<Button variant="primary">Button</Button>);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('secondary variant', () => {
    const tree = render(<Button variant="secondary">Button</Button>);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
```

## Performance Profiler

### Render Performance

```typescript
// Messe Render-Zeit
import { measureRender } from '@nativeui/test-utils';

const result = await measureRender(<Button>Click</Button>);
console.log(result);
// { firstRender: 2.3ms, reRender: 0.8ms }
```

### Bundle Size

```bash
npx mcellui analyze

# Output:
# Component Bundle Sizes
# ├── button: 2.1kb (gzip: 0.9kb)
# ├── card: 1.4kb (gzip: 0.6kb)
# ├── dialog: 4.2kb (gzip: 1.8kb)
# └── Total: 45kb (gzip: 18kb)
```

### Memory Usage

```typescript
import { measureMemory } from '@nativeui/test-utils';

const result = await measureMemory(<ComplexList items={1000} />);
console.log(result);
// { heapUsed: 12.4MB, heapTotal: 20MB }
```

## Storybook Integration

```bash
npx mcellui storybook init
```

### Auto-generated Stories

```typescript
// Automatisch aus Registry generiert
export default {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    variant: {
      options: ['primary', 'secondary', 'outline', 'ghost'],
      control: { type: 'select' },
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export const Primary = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
};
```

## Test Commands

```bash
# Unit Tests
npm test

# Visual Regression
npx mcellui test:visual

# Performance
npx mcellui analyze

# All Tests
npx mcellui test:all
```
