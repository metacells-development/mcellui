# Phase 4: Ecosystem

> Status: **Not Started**

## Overview

Tablet-Support, Charts, Dashboard Blocks, erweiterte Playground Features und Figma Plugin.

---

## Tasks

### Tablet/iPad Layouts

- [ ] **Split View**
  - Master/Detail layout
  - Collapsible sidebar
  - Responsive breakpoints

- [ ] **Sidebar Navigation**
  - Expandable/Collapsible
  - Icon + Label mode
  - Active state

- [ ] **Responsive Grid**
  - Column system
  - Breakpoint-aware
  - Gap utilities

- [ ] **Adaptive Components**
  - Components that adapt to screen size
  - Tablet-specific variants

### Chart Components

- [ ] **victory-native Integration**
  - Line Chart
  - Bar Chart
  - Pie Chart
  - Area Chart

- [ ] **Chart Wrapper**
  - Consistent styling
  - Theme integration
  - Accessibility labels

- [ ] **Sparklines**
  - Inline mini charts
  - Trend indicators

### Dashboard Blocks

- [ ] **Stats Card**
  - Value + Label
  - Trend indicator
  - Sparkline option

- [ ] **Metric Grid**
  - Responsive grid of stats
  - Configurable columns

- [ ] **Activity Feed**
  - Timeline layout
  - Avatar + Action + Time
  - Infinite scroll

- [ ] **Data Table**
  - Sortable columns
  - Pagination
  - Row actions

### Playground: Full Features

- [ ] **Advanced Preview**
  - Multiple device frames
  - Side-by-side comparison
  - Responsive preview

- [ ] **Code Features**
  - Syntax highlighting
  - Multiple file tabs
  - Import resolution

- [ ] **Export Options**
  - Copy as component
  - Download as file
  - Share link

- [ ] **Theme Editor**
  - Visual color picker
  - Real-time preview
  - Export theme config

### Theme Gallery

- [ ] **Pre-built Themes**
  - Light/Dark variants
  - Brand color options
  - Community themes

- [ ] **Theme Marketplace**
  - Browse themes
  - Preview themes
  - One-click install

### Figma Plugin

- [ ] **Plugin Setup** (`extensions/figma/`)
  - Figma manifest
  - React UI

- [ ] **Features**
  - Component library in Figma
  - Token sync
  - Export to code

- [ ] **Sync**
  - Design → Code
  - Code → Design
  - Token updates

---

## Dateien (geplant)

```
packages/registry/
├── ui/
│   ├── split-view.tsx
│   ├── sidebar.tsx
│   └── responsive-grid.tsx
├── charts/
│   ├── line-chart.tsx
│   ├── bar-chart.tsx
│   ├── pie-chart.tsx
│   └── sparkline.tsx
└── blocks/
    └── dashboard/
        ├── stats-card.tsx
        ├── metric-grid.tsx
        ├── activity-feed.tsx
        └── data-table.tsx

extensions/
└── figma/
    ├── manifest.json
    ├── src/
    │   └── ui.tsx
    └── package.json
```

---

## Dependencies

```json
{
  "victory-native": "^40.x",
  "react-native-svg": "^15.x"
}
```

---

## Voraussetzungen

- [ ] Phase 3 abgeschlossen
- [ ] Theming System fertig
- [ ] Playground MVP live

---

## Nächste Schritte

→ [Phase 5: Polish & Scale](./PHASE-5-POLISH.md)
