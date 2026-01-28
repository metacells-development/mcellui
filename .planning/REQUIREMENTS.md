# Requirements: mcellui v1.2 Consistency Sweep

**Defined:** 2026-01-28
**Core Value:** Users own the component code — tooling must work reliably

## v1.2 Requirements

Requirements for consistency sweep milestone. Each maps to roadmap phases.

### Token Usage — Colors (Critical)

- [ ] **TOK-01**: All UI components use semantic color tokens (no hardcoded hex/rgb/rgba)
- [ ] **TOK-02**: All block templates use semantic color tokens
- [ ] **TOK-03**: All screen templates use semantic color tokens
- [ ] **TOK-04**: All icon defaults use theme `colors.foreground` instead of hardcoded `#000`
- [ ] **TOK-05**: All overlay/scrim colors use semantic tokens (not hardcoded rgba)

### Token Usage — Spacing & Layout

- [ ] **TOK-06**: All components use `spacing[n]` tokens for padding/margin (no raw numbers)
- [ ] **TOK-07**: All components use `radius.*` tokens for borderRadius (no hardcoded values)

### Token Usage — Typography

- [ ] **TOK-08**: All components use typography tokens for fontSize/fontWeight (no hardcoded values)

### Token Usage — Shadows

- [ ] **TOK-09**: All components use `platformShadow()` helper for shadows (no custom shadow objects)

### API Patterns

- [ ] **API-01**: Avatar component uses standard size scale (`sm|md|lg`) matching all other components

### Component Reuse

- [ ] **REUSE-01**: Home screen uses existing MediaCard/Card component instead of manual card construction

### Naming Patterns

- [ ] **NAME-01**: All demo app block files use `-block` suffix in file names (9 files)
- [ ] **NAME-02**: All demo app block component names include `Block` suffix

### Demo Consistency

- [ ] **DEMO-01**: Demo app follows same token and naming standards as library components

## Future Requirements (v1.3+)

### Prevention & Enforcement

- **LINT-01**: ESLint rule to prevent hardcoded color values in components
- **LINT-02**: ESLint rule to enforce spacing token usage
- **DOC-01**: Contributing guide documenting consistency patterns

## Out of Scope

| Feature | Reason |
|---------|--------|
| New components | Focus on consistency, not quantity |
| CLI/MCP changes | Tooling was audited in v1.1 |
| Breaking API changes (except Avatar) | Maintain v1.x compatibility |
| Performance optimization | Not part of consistency sweep |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TOK-01 | Phase 19 | Pending |
| TOK-02 | Phase 19 | Pending |
| TOK-03 | Phase 19 | Pending |
| TOK-04 | Phase 19 | Pending |
| TOK-05 | Phase 19 | Pending |
| TOK-06 | Phase 20 | Pending |
| TOK-07 | Phase 20 | Pending |
| TOK-08 | Phase 20 | Pending |
| TOK-09 | Phase 19 | Pending |
| API-01 | Phase 19 | Pending |
| REUSE-01 | Phase 19 | Pending |
| NAME-01 | Phase 20 | Pending |
| NAME-02 | Phase 20 | Pending |
| DEMO-01 | Phase 21 | Pending |

**Coverage:**
- v1.2 requirements: 14 total
- Mapped to phases: 14 (100%)
- Unmapped: 0

**Phase Breakdown:**
- Phase 19 (Critical Color & API Fixes): 8 requirements (TOK-01, TOK-02, TOK-03, TOK-04, TOK-05, TOK-09, API-01, REUSE-01)
- Phase 20 (Spacing, Typography & Naming): 5 requirements (TOK-06, TOK-07, TOK-08, NAME-01, NAME-02)
- Phase 21 (Demo Consistency & Validation): 1 requirement (DEMO-01)

---
*Requirements defined: 2026-01-28*
*Last updated: 2026-01-28 after roadmap creation*
