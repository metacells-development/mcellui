# Requirements: mcellui Quality Refinement

**Defined:** 2026-01-24
**Core Value:** Every component, block, and screen feels like it was designed and built together

## v1 Requirements

Requirements for this refinement milestone. Each maps to roadmap phases.

### Visual Consistency

- [ ] **VISUAL-01**: All components use theme spacing tokens (no hardcoded values)
- [ ] **VISUAL-02**: All components use consistent border radius from tokens
- [ ] **VISUAL-03**: All components use unified shadow/elevation system
- [ ] **VISUAL-04**: All components use typography tokens for font sizes
- [ ] **VISUAL-05**: All components use color tokens correctly (light/dark)

### API Consistency

- [ ] **API-01**: All components use consistent prop naming (variant, size, disabled)
- [ ] **API-02**: All components use consistent variant values (default, secondary, destructive)
- [ ] **API-03**: All components use consistent size scale (sm, md, lg)
- [ ] **API-04**: Complex components use compound pattern (Dialog.Content, etc.)
- [ ] **API-05**: All components have complete TypeScript types

### State Coverage

- [ ] **STATE-01**: All interactive components support disabled state
- [ ] **STATE-02**: All async components support loading state
- [ ] **STATE-03**: All validatable components support error state
- [ ] **STATE-04**: All focusable components have focus ring for accessibility

### Demo Coverage

- [ ] **DEMO-01**: Demo app shows all variants for each component
- [ ] **DEMO-02**: Demo app shows all states for each component

### Composition

- [ ] **COMPOSE-01**: Components compose from existing primitives where cleaner

## v2 Requirements

Deferred to future release. Not in current roadmap.

### Testing

- **TEST-01**: Automated visual regression tests for all components
- **TEST-02**: Accessibility audit automation (axe-core equivalent)
- **TEST-03**: Unit tests for component logic

### Documentation

- **DOCS-01**: Component documentation pages on docs site
- **DOCS-02**: Props tables auto-generated from TypeScript
- **DOCS-03**: Interactive examples on docs site

## Out of Scope

Explicitly excluded from this milestone.

| Feature | Reason |
|---------|--------|
| New components | Refinement milestone — polish existing, don't add |
| New blocks/screens | Focus on quality, not quantity |
| Breaking API changes | Maintain backward compatibility |
| Performance optimization | Focus is consistency, not speed |
| Documentation site | Separate effort after refinement |

## Traceability

All requirements apply to ALL phases. Each phase applies the full quality standard to its component group.

| Requirement | Phases | Status |
|-------------|--------|--------|
| VISUAL-01 | All (1-12) | Pending |
| VISUAL-02 | All (1-12) | Pending |
| VISUAL-03 | All (1-12) | Pending |
| VISUAL-04 | All (1-12) | Pending |
| VISUAL-05 | All (1-12) | Pending |
| API-01 | All (1-12) | Pending |
| API-02 | Phases 1-3, 5, 7-12 (where variants apply) | Pending |
| API-03 | Phases 1-5, 7-12 (where sizes apply) | Pending |
| API-04 | Phases 3, 7, 8 (complex components) | Pending |
| API-05 | All (1-12) | Pending |
| STATE-01 | All (1-12) | Pending |
| STATE-02 | Phases 2, 4, 8-12 (async components) | Pending |
| STATE-03 | Phases 1, 8, 9, 12 (validatable components) | Pending |
| STATE-04 | Phases 1-3, 5, 7-12 (focusable components) | Pending |
| DEMO-01 | All (1-12) | Pending |
| DEMO-02 | All (1-12) | Pending |
| COMPOSE-01 | All (1-12) | Pending |

**Coverage:**
- v1 requirements: 17 total
- Mapped to phases: 17/17 ✓
- Unmapped: 0

**Note:** Requirements are quality standards, not features. Each phase applies all relevant standards to its component group. Some requirements (like API-02 variants or STATE-03 error states) only apply to applicable component types within each phase.

---
*Requirements defined: 2026-01-24*
*Last updated: 2026-01-24 after roadmap creation*
