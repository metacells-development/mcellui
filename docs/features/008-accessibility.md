# Feature: Accessibility

Built-in Accessibility Features und Checker Tools.

## Prinzipien

1. **Accessible by Default** – Jede Komponente ist von Anfang an barrierefrei
2. **Screen Reader Support** – Korrekte Labels und Roles
3. **Touch Target Sizes** – Minimum 44x44pt
4. **Color Contrast** – WCAG AA Standard
5. **Keyboard Navigation** – Für Web-Version

## Built-in Features

### Screen Reader Labels

```tsx
// Automatische Labels basierend auf Content
<Button>Submit</Button>
// → accessibilityLabel="Submit"
// → accessibilityRole="button"

// Überschreibbar
<Button accessibilityLabel="Submit registration form">
  Submit
</Button>
```

### Accessibility Roles

```tsx
// Automatisch gesetzt basierend auf Komponente
<Button />        // role="button"
<Checkbox />      // role="checkbox"
<Switch />        // role="switch"
<Dialog />        // role="dialog"
<Alert />         // role="alert"
<Tab />           // role="tab"
```

### Touch Targets

```tsx
// Minimum 44x44 für alle interaktiven Elemente
const styles = StyleSheet.create({
  touchable: {
    minWidth: 44,
    minHeight: 44,
  },
});

// Kleine Icons haben größere Hit-Area
<IconButton size={24} hitSlop={10} />
```

### Focus Management

```tsx
// Automatischer Focus bei Dialogen
<Dialog>
  {/* Erster focusable Element bekommt Focus */}
  <Input autoFocus />
</Dialog>

// Focus Trap für Modals
<FocusTrap>
  <DialogContent />
</FocusTrap>
```

## Accessibility Checker

### CLI Integration

```bash
npx mcellui a11y check

# Output:
# ✓ Button: All checks passed
# ✓ Card: All checks passed
# ⚠ CustomComponent:
#   - Touch target too small (32x32, minimum 44x44)
#   - Missing accessibilityLabel
```

### Playground Integration

```
┌─────────────────────────────────────────┐
│ Accessibility Report              [✓]   │
├─────────────────────────────────────────┤
│                                         │
│ Color Contrast                          │
│ ├── Primary on White: 4.5:1 ✓ AA        │
│ ├── Gray.500 on White: 4.6:1 ✓ AA       │
│ └── Error on White: 4.0:1 ⚠ AA Large    │
│                                         │
│ Touch Targets                           │
│ ├── Button: 44x44 ✓                     │
│ ├── IconButton: 44x44 ✓                 │
│ └── Checkbox: 44x44 ✓                   │
│                                         │
│ Screen Reader                           │
│ ├── Labels: All present ✓               │
│ └── Roles: All correct ✓                │
│                                         │
└─────────────────────────────────────────┘
```

### Checks

```typescript
const a11yChecks = {
  // Farbkontrast (WCAG 2.1)
  contrast: {
    aa: 4.5,      // Normal text
    aaLarge: 3.0, // Large text (18pt+ or 14pt bold)
    aaa: 7.0,     // Enhanced
  },

  // Touch Targets (Apple HIG, Material)
  touchTargets: {
    minimum: 44,
    recommended: 48,
  },

  // Labels
  labels: {
    required: ['button', 'link', 'image', 'input'],
  },

  // Focus
  focus: {
    visible: true,
    order: 'logical',
  },
};
```

## Platform-spezifische Unterschiede

### iOS (VoiceOver) vs Android (TalkBack)

```
┌─────────────────────────────┬───────────────────────────────────┐
│ iOS (VoiceOver)             │ Android (TalkBack)                │
├─────────────────────────────┼───────────────────────────────────┤
│ accessibilityHint ✓         │ accessibilityHint (limited) ⚠️    │
│ Magic Tap (2-finger tap)    │ Nicht verfügbar                   │
│ Escape Gesture              │ Back Button                       │
│ Custom Actions              │ Custom Actions                    │
│ UIAccessibilityTraits       │ importantForAccessibility         │
└─────────────────────────────┴───────────────────────────────────┘
```

### Platform-spezifische Props

```typescript
// iOS-only Features
<Pressable
  accessibilityHint="Double tap to submit the form"  // iOS liest vor
  accessibilityViewIsModal={true}                    // iOS Focus Trap
  onAccessibilityEscape={() => navigation.goBack()} // iOS Escape Gesture
/>

// Android-only Features
<View
  importantForAccessibility="yes"  // Android: Force announce
  accessibilityLiveRegion="polite" // Android: Live updates
/>

// Cross-platform Helper
import { Platform } from 'react-native';

const a11yProps = Platform.select({
  ios: {
    accessibilityHint: 'Double tap to submit',
  },
  android: {
    accessibilityLiveRegion: 'polite',
  },
});
```

### Testing auf beiden Platforms

```bash
# iOS Simulator
# Settings → Accessibility → VoiceOver → ON
# Oder: Cmd + F5 im Simulator

# Android Emulator
# Settings → Accessibility → TalkBack → ON
# Oder: adb shell settings put secure enabled_accessibility_services com.google.android.marvin.talkback

# CLI Check für beide
npx mcellui a11y test --ios --android
```

## Implementation

```typescript
// Jede Komponente hat a11y Props
interface AccessibilityProps {
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityState?: AccessibilityState;
  accessible?: boolean;
}

// Automatische Defaults
const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <Pressable
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={typeof children === 'string' ? children : undefined}
      {...props}
    >
      {children}
    </Pressable>
  );
};
```

## Resources

- [React Native Accessibility Docs](https://reactnative.dev/docs/accessibility)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Material Design Accessibility](https://m3.material.io/foundations/accessible-design)
