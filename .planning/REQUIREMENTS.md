# Requirements: mcellui v1.1 Audit

**Defined:** 2026-01-26
**Core Value:** Users own the component code — tooling must work reliably

## v1.1 Requirements

Requirements for audit milestone. Each maps to roadmap phases.

### Package Fixes (Critical)

- [x] **PKG-01**: Core package exports compiled .js instead of .ts source
- [x] **PKG-02**: All animated components declare peer dependencies (reanimated, gesture-handler)
- [x] **PKG-03**: Core package exports ./package.json for tooling compatibility

### CLI Audit

- [x] **CLI-01**: All CLI errors written to stderr with actionable messages
- [x] **CLI-02**: All CLI commands use consistent exit codes (0=success, 1=error)
- [x] **CLI-03**: All CLI commands have consistent flag naming patterns
- [x] **CLI-04**: CLI help text is complete and accurate for all commands
- [x] **CLI-05**: CLI handles edge cases gracefully (no project, missing config, network errors)

### MCP Server Audit

- [x] **MCP-01**: All MCP tools have accurate descriptions and examples
- [x] **MCP-02**: All MCP tools return useful responses for AI consumers
- [x] **MCP-03**: All MCP errors include actionable recovery steps
- [x] **MCP-04**: MCP tool schemas are flat with clear parameter descriptions
- [x] **MCP-05**: MCP resources are discoverable with hierarchical URIs

### Registry Audit

- [x] **REG-01**: All components have complete metadata (name, description, dependencies)
- [x] **REG-02**: All component dependencies are correctly declared
- [x] **REG-03**: Component naming is consistent across registry
- [x] **REG-04**: Registry structure supports future component additions

### Core Package Audit

- [x] **CORE-01**: Theme token exports are complete and documented
- [x] **CORE-02**: Utility functions are properly exported and typed
- [x] **CORE-03**: No orphaned or unused exports (address technical debt)

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
| PKG-01 | Phase 14 | Complete |
| PKG-02 | Phase 14 | Complete |
| PKG-03 | Phase 14 | Complete |
| CLI-01 | Phase 15 | Complete |
| CLI-02 | Phase 15 | Complete |
| CLI-03 | Phase 15 | Complete |
| CLI-04 | Phase 15 | Complete |
| CLI-05 | Phase 15 | Complete |
| MCP-01 | Phase 16 | Complete |
| MCP-02 | Phase 16 | Complete |
| MCP-03 | Phase 16 | Complete |
| MCP-04 | Phase 16 | Complete |
| MCP-05 | Phase 16 | Complete |
| REG-01 | Phase 17 | Complete |
| REG-02 | Phase 17 | Complete |
| REG-03 | Phase 17 | Complete |
| REG-04 | Phase 17 | Complete |
| CORE-01 | Phase 18 | Complete |
| CORE-02 | Phase 18 | Complete |
| CORE-03 | Phase 18 | Complete |

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
*Last updated: 2026-01-28 after Phase 18 completion (all v1.1 requirements complete)*
