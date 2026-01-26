# Requirements: mcellui v1.1 Audit

**Defined:** 2026-01-26
**Core Value:** Users own the component code — tooling must work reliably

## v1.1 Requirements

Requirements for audit milestone. Each maps to roadmap phases.

### Package Fixes (Critical)

- [ ] **PKG-01**: Core package exports compiled .js instead of .ts source
- [ ] **PKG-02**: All animated components declare peer dependencies (reanimated, gesture-handler)
- [ ] **PKG-03**: Core package exports ./package.json for tooling compatibility

### CLI Audit

- [ ] **CLI-01**: All CLI errors written to stderr with actionable messages
- [ ] **CLI-02**: All CLI commands use consistent exit codes (0=success, 1=error)
- [ ] **CLI-03**: All CLI commands have consistent flag naming patterns
- [ ] **CLI-04**: CLI help text is complete and accurate for all commands
- [ ] **CLI-05**: CLI handles edge cases gracefully (no project, missing config, network errors)

### MCP Server Audit

- [ ] **MCP-01**: All MCP tools have accurate descriptions and examples
- [ ] **MCP-02**: All MCP tools return useful responses for AI consumers
- [ ] **MCP-03**: All MCP errors include actionable recovery steps
- [ ] **MCP-04**: MCP tool schemas are flat with clear parameter descriptions
- [ ] **MCP-05**: MCP resources are discoverable with hierarchical URIs

### Registry Audit

- [ ] **REG-01**: All components have complete metadata (name, description, dependencies)
- [ ] **REG-02**: All component dependencies are correctly declared
- [ ] **REG-03**: Component naming is consistent across registry
- [ ] **REG-04**: Registry structure supports future component additions

### Core Package Audit

- [ ] **CORE-01**: Theme token exports are complete and documented
- [ ] **CORE-02**: Utility functions are properly exported and typed
- [ ] **CORE-03**: No orphaned or unused exports (address technical debt)

## Future Requirements (v1.2+)

Deferred to later milestones. Documented from research findings.

### CLI Enhancements

- **CLI-F01**: Command suggestions when typos detected
- **CLI-F02**: Progress bars for batch operations
- **CLI-F03**: --json output flag for list command

### Testing Infrastructure

- **TEST-01**: Expo SDK version compatibility testing (52, 53, 54)
- **TEST-02**: Platform testing automation (iOS + Android)
- **TEST-03**: MCP server integration tests

### Documentation

- **DOC-01**: Component usage patterns documentation
- **DOC-02**: Theme customization guide
- **DOC-03**: MCP server tool reference

## Out of Scope

| Feature | Reason |
|---------|--------|
| New components | Focus on quality, not quantity |
| Demo app changes | Audit is tooling-focused |
| Documentation site | Separate milestone |
| Breaking API changes | Maintain v1.0 compatibility |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| PKG-01 | Phase 14 | Pending |
| PKG-02 | Phase 14 | Pending |
| PKG-03 | Phase 14 | Pending |
| CLI-01 | Phase 15 | Pending |
| CLI-02 | Phase 15 | Pending |
| CLI-03 | Phase 15 | Pending |
| CLI-04 | Phase 15 | Pending |
| CLI-05 | Phase 15 | Pending |
| MCP-01 | Phase 16 | Pending |
| MCP-02 | Phase 16 | Pending |
| MCP-03 | Phase 16 | Pending |
| MCP-04 | Phase 16 | Pending |
| MCP-05 | Phase 16 | Pending |
| REG-01 | Phase 17 | Pending |
| REG-02 | Phase 17 | Pending |
| REG-03 | Phase 17 | Pending |
| REG-04 | Phase 17 | Pending |
| CORE-01 | Phase 18 | Pending |
| CORE-02 | Phase 18 | Pending |
| CORE-03 | Phase 18 | Pending |

**Coverage:**
- v1.1 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0

**Phase Breakdown:**
- Phase 14 (Critical Fixes): 3 requirements
- Phase 15 (CLI Audit): 5 requirements
- Phase 16 (MCP Audit): 5 requirements
- Phase 17 (Registry Audit): 4 requirements
- Phase 18 (Core Audit): 3 requirements

---
*Requirements defined: 2026-01-26*
*Last updated: 2026-01-26 after roadmap creation*
