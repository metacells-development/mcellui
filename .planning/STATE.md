# Project State: mcellui

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-28)

**Core value:** Users own the component code — tooling must work reliably
**Current focus:** v1.2 Consistency Sweep — Phase 21 Demo Consistency Validation in progress

## Current Position

Phase: 21 of 21 (Demo Consistency Validation)
Plan: 4 of 5 in current phase
Status: In progress
Last activity: 2026-01-28 — Completed 21-04-PLAN.md (Remaining Demo File Token Migration)

Progress: [█████████████████████] 99% (v1.0 + v1.1 complete, Phase 19 complete, Phase 20 complete, Phase 21 in progress)

## Performance Metrics

**Velocity:**
- Total plans completed: 18 phases (v1.0 + v1.1)
- Average duration: Not tracked at phase level
- Total execution time: Not tracked

**By Milestone:**

| Milestone | Phases | Status | Completed |
|-----------|--------|--------|-----------|
| v1.0 Quality Refinement | 13 | Shipped | 2026-01-26 |
| v1.1 Project Audit | 5 | Shipped | 2026-01-28 |
| v1.2 Consistency Sweep | 3 | In progress | - |

**Recent Trend:**
- v1.0 delivered 102 components with consistent quality
- v1.1 audited all tooling (CLI, MCP, core, registry)
- v1.2 starting with research-driven consistency fixes

## Accumulated Context

### Key Decisions

See PROJECT.md Key Decisions table for full history.

Recent decisions affecting v1.2:
- ESM-only core package output — Modern bundlers, no CommonJS needed
- JSON Schema registry validation — CI enforcement of component quality
- JSDoc for all core exports — IDE intellisense for developers
- Icon color defaults use colors.foreground fallback — Dark mode support (19-01)
- Shadows use platformShadow() helper — Platform and theme adaptation (19-01)
- RGBA overlays use semantic tokens (overlay, scrim, backgroundElevated) — Full dark mode support (19-02)
- Text-on-image no longer uses text shadows — Gradient overlay provides contrast (19-02)
- Rating stars use colors.warning token — Theme-adaptive amber color (19-02)
- All block icons use semantic color defaults — Automatic theme support (19-03)
- Task priority colors use semantic tokens (success/warning/destructive) — Theme-adaptive priorities (19-03)
- Hero gradient presets preserved as artistic choices — Intentional brand colors (19-03)
- All 63 screen icons use semantic color defaults — Dark mode support for highest-level templates (19-04)
- Google logo brand colors preserved in login/signup — Brand compliance requirement (19-04)
- Profile verified badge uses colors.primary — Theme consistency instead of hardcoded blue (19-04)
- Badge text on destructive backgrounds uses colors.destructiveForeground — Semantic token for proper contrast (19-04)
- Avatar uses standard 3-size scale (sm|md|lg) — Consistency with all other components (19-05)
- Home screen featured items use MediaCard component — Component reuse over manual construction (19-05)
- Registry icon colors use colors.foreground fallback — Gap closure for calendar, pagination, tag-input (19-06)
- Tag-input suggestions shadow uses platformShadow() — Platform-aware shadow adaptation (19-06)
- Modal/sheet overlays use colors.overlay semantic token — Theme-aware semi-transparent backdrops (19-07)
- Fullscreen image viewer uses colors.scrim — Near-opaque dark overlay for photo viewing (19-07)
- All UI component shadows use platformShadow() helper — Complete migration eliminates hardcoded shadowColor (19-08)
- Shadow size selection: 'md' for floating content (popover), 'sm' for inline indicators (tabs, slider, segmented-control, tooltip) (19-08)
- ImageCard text uses colors.primaryForeground — Theme-adaptive text on image overlays (19-09)
- AvatarStack initials/backgrounds use semantic tokens — Consistent theme support (19-09)
- All Avatar usages comply with 3-size API (sm|md|lg) — Standardized sizing across blocks/screens (19-09)
- Dynamic spacing applied via inline styles — Theme-responsive spacing system (20-01)
- Explicit 0 values preserved for intentional resets — Not all zeros should use tokens (20-01)
- Negative margins use spacing tokens — Consistency in token application (20-01)
- BorderRadius >= 2 uses radius tokens (xs|sm) — Global radius preset support (20-02)
- Sub-token borderRadius (1, 1.5) preserved as intentional design details — Not all small values need tokens (20-02)
- fontSize 10 and 13 round up to nearest token (xs=12, sm=14) — No sub-xs tokens in scale (20-03)
- All fontSize and fontWeight values use typography tokens — Eliminates hardcoded numeric font values (20-03)
- Demo app blocks use -block suffix in filename and exports — Matches registry naming pattern (20-05)
- spacing[0.25] used for 1px micro-spacing — Maintains precision while enabling theme customization (20-06)
- spacing[2] for 8px standard gaps — Consistent token usage across components (20-06)
- All padding/margin values use spacing tokens — TOK-06 requirement complete (20-06)
- Runtime PADDING_CONFIG pattern for size-variant components — Splits static layout from dynamic spacing (20-07)
- Static StyleSheet padding moved to inline styles — Enables theme token access at runtime (20-07)
- Theme preview swatches remain hardcoded — Intentional brand color representation (21-01)
- Static layout properties stay in StyleSheet, dynamic values move to inline styles (21-01)
- Demo icon color defaults removed — Callers pass colors.foreground from theme (21-03)
- Showcase colors preserved in demos — Intentional examples of component capabilities (21-03)
- fontSize 13 rounds up to fontSize.sm — No sub-token values in typography scale (21-03)
- Showcase element sizes preserved (InfoIcon:12px, emoji:48px) — Design sizes not UI chrome (21-04)
- Shared Section component preferred over local duplicates — Code deduplication (21-04)

### Pending Todos

None yet.

### Open Blockers

None.

### Technical Debt

From v1.1 audit:
- Pre-existing TypeScript strict null check errors in MCP server (2 errors in parseComponentDocs)
- Pre-existing TypeScript strict null check errors in CLI (15 errors in pick.ts/update.ts)
- 4 borderline console.log(chalk.red) instances in CLI (status output, not errors)

**v1.2 Findings (from research):**
- ~~250+ hardcoded values bypass token system~~ → FIXED in 19-01/02/03/04 (all UI, blocks, screens migrated)
- ~~50+ icon components use `#000` instead of `colors.foreground`~~ → FIXED in 19-01 (5 UI icons), 19-03 (50+ block icons), 19-04 (63 screen icons), 19-06 (3 registry icons - gap closure)
- ~~6 shadow objects use hardcoded `#000`~~ → FIXED in 19-01 (migrated to platformShadow), 19-06 (tag-input gap closure), 19-08 (5 UI components - complete gap closure)
- ~~20+ RGBA overlays need semantic token migration~~ → FIXED in 19-02 (8 UI components), 19-03 (7 blocks), 19-07 (3 UI components - gap closure)
- ~~Hardcoded hex colors (#fff, #F59E0B) in UI components~~ → FIXED in 19-02 (4 UI components), 19-03 (15 blocks), 19-04 (18 screens), 19-09 (3 UI components - gap closure)
- ~~Task priority colors hardcoded (#10b981, #f59e0b, #ef4444)~~ → FIXED in 19-03 (semantic tokens)
- ~~Avatar component uses 5-value size scale instead of standard 3-value~~ → FIXED in 19-05 (standardized to sm|md|lg)
- ~~Avatar size="xl" usages in blocks/screens~~ → FIXED in 19-09 (changed to valid size="lg")
- ~~Home screen manual card construction~~ → FIXED in 19-05 (uses MediaCard component)
- ~~9 demo app files missing `-block` suffix~~ → FIXED in 20-05 (renamed to match registry pattern)
- ~~Demo files using hardcoded fontSize~~ → FIXED in 21-02 (blocks), 21-03 (high-violation), 21-04 (remaining files)

## Session Continuity

Last session: 2026-01-28
Stopped at: Completed 21-02-PLAN.md (Block Typography Migration)
Resume file: None

---
*Updated: 2026-01-28 after 21-02 completion (Phase 21 - 4 of 5 plans complete)*
