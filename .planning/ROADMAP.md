# Roadmap: mcellui

## Milestones

- ✅ **v1.0 Quality Refinement** - Phases 1-13 (shipped 2026-01-26)
- ✅ **v1.1 Project Audit** - Phases 14-18 (shipped 2026-01-28)
- ✅ **v1.2 Consistency Sweep** - Phases 19-21 (shipped 2026-01-28)

## Phases

<details>
<summary>✅ v1.0 Quality Refinement (Phases 1-13) - SHIPPED 2026-01-26</summary>

All 102 components refined to consistent quality:
- Centralized theme token system (40+ token sets)
- Consistent API patterns (variant, size, disabled props)
- Complete state coverage (loading, error, disabled, focused)
- Full demo coverage with all variants and states

**Stats:** 33,870 LOC TypeScript | 102 components | 13 phases complete

</details>

<details>
<summary>✅ v1.1 Project Audit (Phases 14-18) - SHIPPED 2026-01-28</summary>

All tooling audited and production-ready:
- Core package exports compiled JS (ESM-only with subpath exports)
- CLI has centralized error handling (stderr, exit codes, retry logic)
- MCP server optimized for AI agent consumption (descriptions, flat schemas, recovery hints)
- Registry has complete metadata (displayName, expoGo, schemaVersion, JSON Schema validation)
- All core exports documented with JSDoc (144 blocks across 15 files)

**Stats:** 18 phases total complete (v1.0 + v1.1)

</details>

### ✅ v1.2 Consistency Sweep (Complete)

**Milestone Goal:** Find and fix all inconsistencies across components, blocks, screens, and demos — component reuse, naming patterns, token usage, and API patterns.

**Final Consistency Score:** 100/100 (all hardcoded values migrated to tokens)

#### Phase 19: Critical Color & API Fixes
**Goal**: All components use semantic color tokens and consistent APIs — dark mode and theming work perfectly
**Depends on**: Nothing (first phase of v1.2)
**Requirements**: TOK-01, TOK-02, TOK-03, TOK-04, TOK-05, TOK-09, API-01, REUSE-01
**Success Criteria** (what must be TRUE):
  1. All 50+ icon components use `colors.foreground` instead of hardcoded `#000` — dark mode works correctly
  2. All overlay/scrim colors use semantic tokens (`colors.overlay`, `colors.scrim`) — no hardcoded RGBA values
  3. All UI components, blocks, and screens use semantic color tokens — no hex/rgb/rgba values in styling
  4. All shadow implementations use `platformShadow()` helper — consistent elevation across platforms
  5. Avatar component uses standard size scale (`sm|md|lg`) — consistent with all other components
  6. Home screen uses existing MediaCard component — no manual card construction
**Plans:** 9 plans (5 original + 4 gap closure)

Plans:
- [x] 19-01-PLAN.md — Icon color defaults + shadow migrations (UI components) - applied to wrong directory
- [x] 19-02-PLAN.md — RGBA overlay + hex color fixes (UI components) - applied to wrong directory
- [x] 19-03-PLAN.md — Icon defaults + color fixes (block components)
- [x] 19-04-PLAN.md — Icon defaults + color fixes (screen components)
- [x] 19-05-PLAN.md — Avatar API standardization + Home screen MediaCard reuse
- [x] 19-06-PLAN.md — [GAP CLOSURE] Icon color defaults + tag-input shadow (packages/registry/ui)
- [x] 19-07-PLAN.md — [GAP CLOSURE] Overlay colors (packages/registry/ui)
- [x] 19-08-PLAN.md — [GAP CLOSURE] Shadow implementations (packages/registry/ui)
- [x] 19-09-PLAN.md — [GAP CLOSURE] Hex colors + Avatar xl usages (packages/registry)

#### Phase 20: Spacing, Typography & Naming
**Goal**: All styling uses theme tokens and naming patterns are consistent — visual hierarchy and developer experience are unified
**Depends on**: Phase 19
**Requirements**: TOK-06, TOK-07, TOK-08, NAME-01, NAME-02
**Success Criteria** (what must be TRUE):
  1. All padding/margin values use `spacing[n]` tokens — no raw number values in styles
  2. All borderRadius values use `radius.*` tokens — user-configurable radius presets work
  3. All fontSize/fontWeight values use typography tokens — consistent text hierarchy
  4. All 9 demo app block files use `-block` suffix in file names — naming pattern matches registry
  5. All demo app block component names include `Block` suffix — export names are consistent
**Plans:** 7 plans (5 original + 2 gap closure)

Plans:
- [x] 20-01-PLAN.md — Spacing token migration (form + display components)
- [x] 20-02-PLAN.md — Radius token migration (form, alert, calendar components)
- [x] 20-03-PLAN.md — Typography token migration batch 1 (form + feedback components)
- [x] 20-04-PLAN.md — Typography token migration batch 2 (navigation + display components)
- [x] 20-05-PLAN.md — Demo block file renaming (9 files + imports)
- [x] 20-06-PLAN.md — [GAP CLOSURE] Remaining spacing values (textarea, select, fab, datetime-picker)
- [x] 20-07-PLAN.md — [GAP CLOSURE] Spacing values (segmented-control, action-sheet, toggle)

#### Phase 21: Demo Consistency & Validation
**Goal**: Demo app follows same token and naming standards as library — consistency is complete
**Depends on**: Phase 20
**Requirements**: DEMO-01
**Success Criteria** (what must be TRUE):
  1. Demo app components use semantic color tokens — no hardcoded hex/rgba values
  2. Demo app components use spacing tokens — no raw number padding/margin
  3. Demo app components use typography tokens — text follows theme hierarchy
  4. Demo app block naming matches registry patterns — all files have correct suffixes
  5. Visual regression testing confirms no dark mode breaks — all demos render correctly
**Plans:** 5 plans

Plans:
- [x] 21-01-PLAN.md — Theme selector modal token migration (_layout.tsx)
- [x] 21-02-PLAN.md — Block file typography migration (16 files)
- [x] 21-03-PLAN.md — Demo file batch 1 token migration (8 high-violation demos)
- [x] 21-04-PLAN.md — Demo file batch 2 token migration (remaining demos)
- [x] 21-05-PLAN.md — App screens migration + dark mode verification checkpoint

## Progress

**Execution Order:**
Phases execute in numeric order: 19 → 20 → 21

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1-13. Quality Refinement | v1.0 | Complete | Complete | 2026-01-26 |
| 14-18. Project Audit | v1.1 | Complete | Complete | 2026-01-28 |
| 19. Critical Color & API Fixes | v1.2 | 9/9 | Complete | 2026-01-28 |
| 20. Spacing, Typography & Naming | v1.2 | 7/7 | Complete | 2026-01-28 |
| 21. Demo Consistency & Validation | v1.2 | 5/5 | Complete | 2026-01-28 |

---
*Last updated: 2026-01-28 after Phase 21 complete - v1.2 shipped*
