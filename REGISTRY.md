# nativeui Registry

Single Source of Truth für alle Components, Blocks, Screens, Hooks und Themes.

**Fokus:** Consumer Apps (Social, E-Commerce, Lifestyle)

**Legende:**
- ✅ Fertig
- 🚧 In Arbeit
- 📋 Phase 2
- 📌 Phase 3
- 💤 Zukunft

---

## Components

### Inputs & Forms

| Name | Status | Beschreibung |
|------|--------|--------------|
| `button` | ✅ | Pressable mit Varianten, Sizes, Loading |
| `input` | ✅ | Text Input mit Label, Error, Helper |
| `checkbox` | ✅ | Animierte Checkbox |
| `switch` | ✅ | iOS-style Toggle |
| `radio-group` | ✅ | Single Selection Group |
| `label` | ✅ | Form Label |
| `textarea` | ✅ | Multiline Input |
| `select` | ✅ | Bottom Sheet Picker |
| `slider` | ✅ | Value Slider |
| `stepper` | ✅ | +/- Quantity Input |
| `search-input` | 📌 | Search mit Clear Button |
| `input-otp` | 📌 | OTP/PIN Code Input |
| `rating` | 📌 | Star Rating Input |
| `field` | 📌 | Label + Input + Error Wrapper |
| `form` | 📌 | Form Context (react-hook-form) |

### Data Display

| Name | Status | Beschreibung |
|------|--------|--------------|
| `badge` | ✅ | Status Label |
| `avatar` | ✅ | Profilbild mit Fallback |
| `card` | ✅ | Container |
| `separator` | ✅ | Horizontale/Vertikale Linie |
| `skeleton` | ✅ | Loading Shimmer |
| `spinner` | ✅ | Activity Indicator |
| `progress` | ✅ | Progress Bar |
| `list-item` | 📌 | Standard List Row |
| `empty` | 📌 | Empty State mit Illustration |

### Overlays & Feedback

| Name | Status | Beschreibung |
|------|--------|--------------|
| `dialog` | ✅ | Modal mit Backdrop |
| `alert-dialog` | ✅ | Confirmation Modal |
| `sheet` | ✅ | Bottom Sheet |
| `toast` | ✅ | Notifications |
| `action-sheet` | 📌 | iOS Action Sheet |
| `popover` | 📌 | Positioned Overlay |
| `tooltip` | 📌 | Info on Long-Press |

### Navigation

| Name | Status | Beschreibung |
|------|--------|--------------|
| `tabs` | ✅ | Animated Tab Bar |
| `accordion` | ✅ | Collapsible Sections |
| `segmented-control` | ✅ | iOS Segmented Control |

### Mobile Patterns

| Name | Status | Beschreibung |
|------|--------|--------------|
| `pull-to-refresh` | ✅ | Refresh Indicator |
| `swipeable-row` | ✅ | Swipe Actions (Delete, Archive) |
| `fab` | 📌 | Floating Action Button |
| `biometric-prompt` | 💤 | Face ID / Fingerprint UI |
| `image-picker` | 💤 | Photo Selection |

---

## Blocks

Wiederverwendbare Screen-Sections. Fokus auf die wichtigsten.

### Auth

| Name | Status | Beschreibung |
|------|--------|--------------|
| `auth/login-email` | 📌 | Email + Password |
| `auth/login-social` | 📌 | Apple + Google Buttons |
| `auth/signup` | 📌 | Signup Form |
| `auth/otp` | 📌 | OTP Verification |

### Settings

| Name | Status | Beschreibung |
|------|--------|--------------|
| `settings/list` | 📌 | Grouped Settings |
| `settings/profile` | 📌 | Edit Profile |
| `settings/appearance` | 📌 | Theme Toggle |

### Empty States

| Name | Status | Beschreibung |
|------|--------|--------------|
| `empty/no-results` | 📌 | Search Empty |
| `empty/error` | 📌 | Error + Retry |
| `empty/offline` | 📌 | No Connection |

### Lists

| Name | Status | Beschreibung |
|------|--------|--------------|
| `lists/chat` | 💤 | Message List |
| `lists/feed` | 💤 | Social Feed |

---

## Screens

Komplette Screens. Erstmal nur die wichtigsten.

| Name | Status | Beschreibung |
|------|--------|--------------|
| `screens/welcome` | 📌 | App Intro + CTA |
| `screens/login` | 📌 | Full Login |
| `screens/signup` | 📌 | Full Signup |
| `screens/settings` | 📌 | Main Settings |
| `screens/error` | 📌 | Error Screen |

---

## Hooks

| Name | Status | Beschreibung |
|------|--------|--------------|
| `use-theme` | ✅ | Theme Context |
| `use-color-scheme` | ✅ | Dark/Light Mode |
| `use-config` | ✅ | Config Access |
| `use-haptics` | 📋 | Haptic Feedback |
| `use-keyboard` | 📌 | Keyboard State |
| `use-device-type` | 📌 | Phone/Tablet |

---

## Themes

| Name | Status |
|------|--------|
| `zinc` | ✅ |
| `slate` | ✅ |
| `stone` | ✅ |
| `blue` | ✅ |
| `green` | ✅ |
| `rose` | ✅ |
| `orange` | ✅ |
| `violet` | ✅ |

---

## Übersicht

| Kategorie | ✅ | 📋 Phase 2 | 📌 Phase 3 | 💤 Zukunft |
|-----------|---|-----------|-----------|-----------|
| Components | 26 | 0 | 10 | 2 |
| Blocks | 0 | 0 | 10 | 2 |
| Screens | 0 | 0 | 5 | 0 |
| Hooks | 3 | 1 | 2 | 0 |
| Themes | 8 | 0 | 0 | 0 |
| **Total** | **37** | **1** | **27** | **4** |

---

## Entfernt (Desktop-Konzepte)

Diese passen nicht zu Mobile Consumer Apps:
- ~~kbd~~ (Keyboard Shortcuts)
- ~~breadcrumb~~ (Mobile = Back Button)
- ~~pagination~~ (Mobile = Infinite Scroll)
- ~~table~~ (Mobile = Listen)
- ~~hover-card~~ (kein Hover auf Touch)
- ~~resizable~~ (Desktop Split Views)
- ~~charts~~ (Edge Case, später)

---

## Phase 2 Fokus

**✅ PHASE 2 COMPLETE!**

Core:
- ~~`label`~~ ✅
- ~~`separator`~~ ✅
- ~~`skeleton`~~ ✅
- ~~`spinner`~~ ✅
- ~~`progress`~~ ✅

Inputs:
- ~~`textarea`~~ ✅
- ~~`select`~~ ✅
- ~~`slider`~~ ✅
- ~~`stepper`~~ ✅

Overlays:
- ~~`dialog`~~ ✅
- ~~`alert-dialog`~~ ✅
- ~~`sheet`~~ ✅
- ~~`toast`~~ ✅

Navigation:
- ~~`tabs`~~ ✅
- ~~`accordion`~~ ✅
- ~~`segmented-control`~~ ✅

Mobile:
- ~~`pull-to-refresh`~~ ✅
- ~~`swipeable-row`~~ ✅
