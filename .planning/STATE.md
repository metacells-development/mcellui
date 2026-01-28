# Project State: mcellui

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-28)

**Core value:** Users own the component code — tooling must work reliably
**Current focus:** v1.2 Consistency Sweep — Phase 19 ready to plan

## Current Position

Phase: 19 of 21 (Critical Color & API Fixes)
Plan: 2 of 5 in current phase
Status: In progress
Last activity: 2026-01-28 — Completed 19-02-PLAN.md (RGBA overlays & hex colors)

Progress: [███████████████████░] 87% (v1.0 + v1.1 complete, v1.2 in progress)

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
- 250+ hardcoded values bypass token system (breaks theming/dark mode)
- ~~50+ icon components use `#000` instead of `colors.foreground`~~ → FIXED in 19-01 (5 icons)
- ~~6 shadow objects use hardcoded `#000`~~ → FIXED in 19-01 (migrated to platformShadow)
- ~~20+ RGBA overlays need semantic token migration~~ → FIXED in 19-02 (8 components)
- ~~Hardcoded hex colors (#fff, #F59E0B) in UI components~~ → FIXED in 19-02 (4 components)
- 9 demo app files missing `-block` suffix
- Avatar component uses 5-value size scale instead of standard 3-value

## Session Continuity

Last session: 2026-01-28
Stopped at: Completed 19-02-PLAN.md (RGBA overlays & hex colors)
Resume file: None

---
*Updated: 2026-01-28 after completing 19-02-PLAN.md*
