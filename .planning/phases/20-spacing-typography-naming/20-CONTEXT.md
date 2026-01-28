# Phase 20: Spacing, Typography & Naming - Context

**Gathered:** 2026-01-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Migrate hardcoded spacing, borderRadius, and typography values to theme tokens across all components. Rename demo app block files and exports to match registry naming patterns. This phase standardizes how styling values are expressed — no new visual changes, just consistent token usage.

</domain>

<decisions>
## Implementation Decisions

### Spacing token granularity
- Use 4px base scale (4, 8, 12, 16, 20, 24...)
- Round non-matching values to nearest token (13px → spacing[3] = 12px)
- Negative margins use tokens: margin: -spacing[2] instead of -8
- Flex gaps use a different/tighter scale than padding/margin

### Border radius approach
- Global presets only: radius.none, radius.sm, radius.md, radius.lg, radius.full
- radius.full = 9999 (standard approach for pills/circles)
- radius.none = 0 (explicit token for sharp corners)
- Radius scale is user-configurable — setting radius: 'lg' in config shifts all components rounder

### Typography token mapping
- Semantic role names: typography.heading, typography.body, typography.caption, typography.label
- Bundled tokens include fontSize + fontWeight + lineHeight together
- Map edge cases to closest role (button text → typography.label, card title → typography.subheading)
- No component-specific typography tokens — keep system simple

### Demo block renaming
- Match registry pattern exactly: hero-block.tsx exports HeroBlock
- Rename files + update imports in one atomic pass (no gradual migration)
- Component names get Block suffix: Hero → HeroBlock, Profile → ProfileBlock
- Demo app is internal-only — breaking changes are acceptable

### Claude's Discretion
- Exact mapping of current values to spacing scale indices
- Which typography role maps to which component text
- Order of file renames and import updates

</decisions>

<specifics>
## Specific Ideas

- Flex gaps should feel tighter than padding — don't force same scale
- The goal is consistency, not visual changes — migrated components should look identical
- "Round to nearest" is acceptable for spacing because minor visual shifts won't be noticeable

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 20-spacing-typography-naming*
*Context gathered: 2026-01-28*
