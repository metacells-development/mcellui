# Phase 3: Advanced

> Status: **Not Started**

## Overview

Komplexe Komponenten, Screen Blocks, Theming System und Documentation Site.

---

## Tasks

### Complex Components

- [ ] **Command Palette**
  - Keyboard shortcut trigger
  - Fuzzy search
  - Recent items
  - Categories

- [ ] **Calendar**
  - Month/Week/Day views
  - Date range selection
  - Event markers
  - Localization

- [ ] **Date Picker**
  - Native integration
  - Custom UI option
  - Range selection

- [ ] **Time Picker**
  - 12/24 hour format
  - Minute intervals

### Screen Blocks

- [ ] **Auth Screens**
  - Login block
  - Signup block
  - Forgot password block
  - OTP verification block

- [ ] **Settings Screens**
  - Settings list block
  - Profile settings block
  - Notification settings block
  - Privacy settings block

- [ ] **List Screens**
  - Search + Filter header
  - Infinite scroll list
  - Pull to refresh
  - Empty state

### Form Blocks

- [ ] **Login Form**
  - Email/Password
  - Social login buttons
  - Remember me
  - Validation

- [ ] **Signup Form**
  - Multi-step option
  - Password strength
  - Terms checkbox

- [ ] **Contact Form**
  - Name, Email, Message
  - Subject dropdown
  - File attachment

- [ ] **Payment Form**
  - Card input
  - Expiry/CVV
  - Billing address

### Theming System

- [ ] **Dark Mode**
  - System preference detection
  - Manual toggle
  - Smooth transition

- [ ] **Custom Themes**
  - Theme creation API
  - Color palette generator
  - Font customization

- [ ] **Theme Presets**
  - Default (neutral)
  - iOS-inspired
  - Material-inspired
  - Custom brand themes

### Web Playground

- [ ] **Playground MVP** (`apps/playground/`)
  - Next.js setup
  - Component preview
  - Code display
  - Copy button

- [ ] **Features**
  - Live prop editing
  - Variant switching
  - Theme preview
  - Mobile frame

### Documentation Site

- [ ] **Docs Site** (`apps/docs/`)
  - Component documentation
  - Installation guide
  - API reference
  - Examples

- [ ] **Content**
  - Getting started
  - Component pages
  - Theming guide
  - Accessibility guide

### Expo Go Compatibility

- [ ] **Compatibility Testing**
  - Test all components in Expo Go
  - Mark incompatible components
  - Document workarounds

- [ ] **Compatibility Matrix**
  - Expo SDK versions
  - React Native versions
  - Native module requirements

---

## Dateien (geplant)

```
packages/registry/
├── ui/
│   ├── command-palette.tsx
│   ├── calendar.tsx
│   ├── date-picker.tsx
│   └── time-picker.tsx
└── blocks/
    ├── auth/
    │   ├── login.tsx
    │   ├── signup.tsx
    │   └── forgot-password.tsx
    ├── settings/
    │   └── settings-list.tsx
    └── forms/
        ├── login-form.tsx
        ├── signup-form.tsx
        └── contact-form.tsx

apps/
├── playground/          # Next.js Web Playground
└── docs/               # Documentation Site
```

---

## Voraussetzungen

- [ ] Phase 2 abgeschlossen
- [ ] Form Components fertig
- [ ] Feedback Components fertig

---

## Nächste Schritte

→ [Phase 4: Ecosystem](./PHASE-4-ECOSYSTEM.md)
