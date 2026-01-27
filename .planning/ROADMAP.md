# Roadmap: mcellui v1.1 Audit

## Milestones

- ✅ **v1.0 MVP** - Phases 1-13 (shipped 2026-01-26)
- 🚧 **v1.1 Project Audit** - Phases 14-18 (in progress)

## Overview

v1.0 shipped 102 components with consistent quality. v1.1 audits all tooling for production readiness — CLI error handling, MCP server tool quality, package structure, and exports. Critical package fixes come first (TypeScript compilation, peer dependencies), followed by systematic audits of each subsystem. This milestone ensures users can reliably install and use mcellui components via npx, MCP integration, or direct copy-paste.

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-13) - SHIPPED 2026-01-26</summary>

### Phase 1: Foundation
**Goal**: Project structure and core infrastructure
**Status**: Complete (2026-01-26)

### Phase 2: Basic Form Components
**Goal**: Input, Textarea, Select, Slider, Stepper
**Status**: Complete (2026-01-26)

### Phase 3: Interactive UI Components
**Goal**: Button, Badge, Avatar, Checkbox, Switch, Radio Group, Label, Separator
**Status**: Complete (2026-01-26)

### Phase 4: Feedback Components
**Goal**: Spinner, Skeleton, Progress
**Status**: Complete (2026-01-26)

### Phase 5: Modal Components
**Goal**: Sheet, Dialog, Alert Dialog
**Status**: Complete (2026-01-26)

### Phase 6: Layout Components
**Goal**: Card, Tabs, Accordion
**Status**: Complete (2026-01-26)

### Phase 7: Native Pattern Components
**Goal**: Toast, Segmented Control, Pull to Refresh, Swipeable Row
**Status**: Complete (2026-01-26)

### Phase 8: Form System
**Goal**: react-hook-form + Zod integration
**Status**: Complete (2026-01-26)

### Phase 9: Authentication Blocks
**Goal**: LoginBlock, SignupBlock
**Status**: Complete (2026-01-26)

### Phase 10: Settings Blocks
**Goal**: SettingsListBlock, ProfileBlock
**Status**: Complete (2026-01-26)

### Phase 11: State Blocks
**Goal**: EmptyStateBlock, ErrorStateBlock
**Status**: Complete (2026-01-26)

### Phase 12: Screen Templates - Foundation
**Goal**: 55 UI components refined to token consistency
**Status**: Complete (2026-01-26)

### Phase 13: Screen Templates - Completion
**Goal**: 28 blocks + 19 screens refined to token consistency
**Status**: Complete (2026-01-26)

</details>

### 🚧 v1.1 Project Audit (In Progress)

**Milestone Goal:** Audit and fix all tooling for production readiness — fix critical package issues, verify CLI/MCP/Registry/Core quality

- [x] **Phase 14: Critical Package Fixes** - Fix TypeScript compilation, peer dependencies, package exports
- [x] **Phase 15: CLI Error Handling & Consistency** - Audit all CLI commands for error handling and UX consistency
- [ ] **Phase 16: MCP Server Tool Quality** - Audit all MCP tools for AI agent usability
- [ ] **Phase 17: Registry Structure & Metadata** - Audit component registry structure and metadata completeness
- [ ] **Phase 18: Core Package Exports** - Audit core package theme tokens and utilities

## Phase Details

### Phase 14: Critical Package Fixes
**Goal**: Core package compiles correctly, peer dependencies declared, package exports complete
**Depends on**: Nothing (first phase of v1.1)
**Requirements**: PKG-01, PKG-02, PKG-03
**Success Criteria** (what must be TRUE):
  1. Core package exports compiled JavaScript (.js + .d.ts), not raw TypeScript
  2. All animated components declare peer dependencies (reanimated, gesture-handler)
  3. All packages export ./package.json for tooling compatibility
  4. Fresh npm install of mcellui components works without TypeScript configuration
  5. Users can require('@metacells/mcellui-core') in Node.js without errors
**Plans**: 2 plans

Plans:
- [ ] 14-01-PLAN.md — Core package compilation (tsup + dist exports)
- [ ] 14-02-PLAN.md — Package exports and registry peer dependencies

### Phase 15: CLI Error Handling & Consistency
**Goal**: All CLI commands follow consistent error handling and output patterns
**Depends on**: Phase 14
**Requirements**: CLI-01, CLI-02, CLI-03, CLI-04, CLI-05
**Success Criteria** (what must be TRUE):
  1. All CLI errors written to stderr with actionable next-step guidance
  2. All CLI commands use consistent exit codes (0 for success, 1 for errors)
  3. All CLI flags follow consistent naming patterns across commands
  4. All CLI help text is accurate and complete for every command
  5. CLI handles edge cases gracefully (no project, missing config, network failures)
**Plans**: 4 plans

Plans:
- [ ] 15-01-PLAN.md — Centralized error handling and output utilities
- [ ] 15-02-PLAN.md — Network retry logic and timeout for registry fetches
- [ ] 15-03-PLAN.md — Refactor all 8 commands to use centralized error handling
- [ ] 15-04-PLAN.md — Commander.js async config, --json for list, help text audit

### Phase 16: MCP Server Tool Quality
**Goal**: All MCP tools optimized for AI agent consumption with accurate documentation
**Depends on**: Phase 15
**Requirements**: MCP-01, MCP-02, MCP-03, MCP-04, MCP-05
**Success Criteria** (what must be TRUE):
  1. All MCP tools have accurate descriptions with usage examples
  2. All MCP tool responses are useful for AI agent decision-making
  3. All MCP errors include actionable recovery steps for the agent
  4. All MCP tool schemas are flat with clear parameter descriptions
  5. MCP resources are discoverable via hierarchical URIs
**Plans**: 3 plans

Plans:
- [ ] 16-01-PLAN.md — Tool descriptions, schemas, and parameter defaults (MCP-01, MCP-04)
- [ ] 16-02-PLAN.md — Tool response format and error handling with isError + recovery hints (MCP-02, MCP-03)
- [ ] 16-03-PLAN.md — Resource metadata (sizeHint, lastUpdated) and error handling (MCP-05)

### Phase 17: Registry Structure & Metadata
**Goal**: Component registry has complete metadata and consistent structure
**Depends on**: Phase 16
**Requirements**: REG-01, REG-02, REG-03, REG-04
**Success Criteria** (what must be TRUE):
  1. All components have complete metadata (name, description, dependencies)
  2. All component dependencies are correctly declared in registry
  3. Component naming is consistent across entire registry
  4. Registry structure supports future component additions without refactoring
**Plans**: TBD

Plans:
- [ ] 17-01: TBD (will be planned)

### Phase 18: Core Package Exports
**Goal**: Theme tokens, utilities, and exports are complete and well-documented
**Depends on**: Phase 17
**Requirements**: CORE-01, CORE-02, CORE-03
**Success Criteria** (what must be TRUE):
  1. All theme token exports are complete and documented
  2. All utility functions are properly exported with TypeScript types
  3. No orphaned or unused exports (technical debt addressed)
  4. Users can import any theme token or utility without manual path configuration
**Plans**: TBD

Plans:
- [ ] 18-01: TBD (will be planned)

## Progress

**Execution Order:**
Phases execute in numeric order: 14 → 15 → 16 → 17 → 18

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation | v1.0 | 3/3 | Complete | 2026-01-26 |
| 2. Basic Form | v1.0 | 2/2 | Complete | 2026-01-26 |
| 3. Interactive UI | v1.0 | 2/2 | Complete | 2026-01-26 |
| 4. Feedback | v1.0 | 1/1 | Complete | 2026-01-26 |
| 5. Modal | v1.0 | 1/1 | Complete | 2026-01-26 |
| 6. Layout | v1.0 | 1/1 | Complete | 2026-01-26 |
| 7. Native Patterns | v1.0 | 1/1 | Complete | 2026-01-26 |
| 8. Form System | v1.0 | 1/1 | Complete | 2026-01-26 |
| 9. Auth Blocks | v1.0 | 1/1 | Complete | 2026-01-26 |
| 10. Settings Blocks | v1.0 | 1/1 | Complete | 2026-01-26 |
| 11. State Blocks | v1.0 | 1/1 | Complete | 2026-01-26 |
| 12. Screen Foundation | v1.0 | 1/1 | Complete | 2026-01-26 |
| 13. Screen Completion | v1.0 | 1/1 | Complete | 2026-01-26 |
| 14. Critical Fixes | v1.1 | 2/2 | Complete | 2026-01-26 |
| 15. CLI Audit | v1.1 | 4/4 | Complete | 2026-01-27 |
| 16. MCP Audit | v1.1 | 0/3 | Not started | - |
| 17. Registry Audit | v1.1 | 0/1 | Not started | - |
| 18. Core Audit | v1.1 | 0/1 | Not started | - |

---
*Roadmap created: 2026-01-26*
*Last updated: 2026-01-27 after Phase 15 completion*
