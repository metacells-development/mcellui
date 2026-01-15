# Phase 2: Core Components

> Status: **Not Started**

## Overview

Erweiterung der Komponentenbibliothek um Forms, Feedback und Navigation. Platform Testing Setup.

---

## Tasks

### Form Components

- [ ] **Checkbox**
  - Animated checkmark
  - Indeterminate state
  - Accessibility labels

- [ ] **Switch**
  - iOS-style toggle
  - Animated thumb
  - Disabled state

- [ ] **Radio Group**
  - Single selection
  - Animated indicator
  - Keyboard navigation

- [ ] **Select / Dropdown**
  - Native picker (iOS/Android)
  - Custom dropdown option
  - Search/filter

- [ ] **Slider**
  - Single value
  - Range option
  - Step markers

### Form Integration

- [ ] **react-hook-form Integration**
  - Controller wrapper
  - Error handling
  - Validation display

- [ ] **Zod Schema Support**
  - Type inference
  - Error messages

- [ ] **Field Component**
  - Label + Input + Error combined
  - Consistent spacing
  - Required indicator

### Feedback Components

- [ ] **Toast**
  - Multiple variants (success, error, warning, info)
  - Auto-dismiss
  - Swipe to dismiss
  - Queue management

- [ ] **Dialog / Modal**
  - Alert Dialog
  - Confirmation Dialog
  - Custom content
  - Backdrop blur

- [ ] **Alert**
  - Inline alerts
  - Dismissable
  - With actions

- [ ] **Bottom Sheet**
  - Snap points
  - Drag to dismiss
  - Keyboard aware

### Navigation Components

- [ ] **Tabs**
  - Animated indicator
  - Swipeable content
  - Badge support

- [ ] **Tab Bar**
  - iOS-style bottom tabs
  - Animated icons
  - Safe area aware

- [ ] **Navigation Bar**
  - Title + Back button
  - Large title mode
  - Search bar integration

### Data Display

- [ ] **List Item**
  - Leading/trailing content
  - Swipe actions
  - Separator options

- [ ] **Skeleton**
  - Shimmer animation
  - Configurable shapes
  - Reduce motion support

- [ ] **Empty State**
  - Icon + Title + Description
  - Action button
  - Customizable

### MCP Server

- [ ] **Registry Tools**
  - Query components
  - Search by name/category
  - Dependency resolution

- [ ] **Validation Tools**
  - Component prop validation
  - Import checking

### Platform Testing

- [ ] **Testing Setup**
  - iOS Simulator automation
  - Android Emulator automation
  - Screenshot comparison

- [ ] **Component Testing**
  - All components iOS verified
  - All components Android verified
  - VoiceOver tested
  - TalkBack tested

---

## Component Checklist Template

Für jede Komponente:

- [ ] TypeScript types
- [ ] Props documentation
- [ ] iOS Simulator ✓
- [ ] Android Emulator ✓
- [ ] VoiceOver ✓
- [ ] TalkBack ✓
- [ ] Dark Mode ✓
- [ ] Reduce Motion ✓
- [ ] Example in Demo App

---

## Dependencies

Neue Dependencies für diese Phase:

```json
{
  "react-hook-form": "^7.x",
  "zod": "^3.x",
  "@gorhom/bottom-sheet": "^4.x"
}
```

---

## Dateien (geplant)

```
packages/registry/ui/
├── checkbox.tsx
├── switch.tsx
├── radio-group.tsx
├── select.tsx
├── slider.tsx
├── field.tsx
├── toast.tsx
├── dialog.tsx
├── alert.tsx
├── bottom-sheet.tsx
├── tabs.tsx
├── tab-bar.tsx
├── navigation-bar.tsx
├── list-item.tsx
├── skeleton.tsx
└── empty-state.tsx
```

---

## Voraussetzungen

- [x] Phase 1 abgeschlossen (Portal, Slot für Overlays)
- [ ] MCP Server functional

---

## Nächste Schritte

→ [Phase 3: Advanced](./PHASE-3-ADVANCED.md)
