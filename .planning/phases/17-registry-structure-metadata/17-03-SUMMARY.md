---
phase: 17-registry-structure-metadata
plan: "03"
subsystem: registry
tags: [validation, quality, schema, json-schema, ajv, ci-cd]

requires:
  - 17-01-registry-metadata

provides:
  - registry-json-schema
  - validation-infrastructure
  - ci-cd-validation-script

affects:
  - 18-final-audit (validation can catch inconsistencies)
  - future-component-additions (enforces quality standards)

tech-stack:
  added:
    - ajv@8.12.0
    - ajv-formats@3.0.1
  patterns:
    - json-schema-validation
    - cli-validation-script

key-files:
  created:
    - packages/registry/registry.schema.json
    - packages/registry/scripts/validate-registry.js
  modified:
    - packages/registry/package.json

decisions:
  - decision: "Use Ajv v8 for JSON Schema validation"
    rationale: "Modern, well-maintained, supports draft-07 schemas"
    alternatives: ["joi", "yup", "zod"]
    impact: "dev-dependency"
  - decision: "Validation script performs 5 checks: schema, duplicates, naming, dependencies, file existence"
    rationale: "Comprehensive validation catches all common registry issues"
    alternatives: ["schema-only validation"]
    impact: "high-quality-registry"
  - decision: "npm run validate:registry command for CI/CD integration"
    rationale: "Standard npm script pattern, easy to integrate in CI pipelines"
    alternatives: ["standalone CLI tool"]
    impact: "ci-cd-integration"

metrics:
  duration: "2m 33s"
  completed: "2026-01-28"

---

# Phase 17 Plan 03: Registry Validation Schema & Script Summary

JSON Schema and validation infrastructure to enforce registry quality standards.

## One-liner

JSON Schema with Ajv validation script enforcing naming conventions, dependencies, and file existence for all 101 components.

## Tasks Completed

### Task 1: Create JSON Schema for registry
**Commit:** 9002113
**Files:** packages/registry/registry.schema.json

- Complete JSON Schema defining registry structure with strict validation rules
- 5 component types: ui, primitive, hook, block, screen
- 21 categories covering all use cases (Authentication → Support)
- Enforces kebab-case naming with conditional -block and -screen suffix requirements
- Validates all metadata fields: name, displayName, type, description, category, status, files, dependencies, registryDependencies, expoGo
- schemaVersion field for future compatibility tracking
- Pattern validation ensures consistent naming (kebab-case, min 10 char descriptions)

### Task 2: Create validation script and npm command
**Commit:** 21347ff
**Files:** packages/registry/scripts/validate-registry.js, packages/registry/package.json

- Comprehensive validation script with 5 validation checks:
  1. JSON Schema validation using Ajv
  2. Duplicate component name detection
  3. Naming convention enforcement (kebab-case, -block/-screen suffixes)
  4. Registry dependency validation (all deps reference real components)
  5. File existence check (all files in registry.json exist on disk)
- Colored terminal output with detailed error reporting
- Exit code 0 on success, 1 on failure (CI/CD friendly)
- npm script: `npm run validate:registry`
- All 101 components validated successfully

**Dependency updates:**
- Updated ajv from v6.12.6 to v8.12.0 for compatibility with ajv-formats
- Added ajv-formats@3.0.1 for format validation
- Fixed strict mode warnings by adding explicit type declarations in conditional schemas

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed ajv version compatibility**
- **Found during:** Task 2 validation script execution
- **Issue:** Registry package had ajv@6.12.6 while ajv-formats requires ajv@8+, causing runtime errors
- **Fix:** Updated packages/registry/package.json to use ajv@^8.12.0
- **Files modified:** packages/registry/package.json
- **Commit:** 21347ff

**2. [Rule 1 - Bug] Fixed JSON Schema strict mode warnings**
- **Found during:** Task 2 validation run
- **Issue:** Ajv strict mode reported missing type declarations in conditional name patterns for blocks/screens
- **Fix:** Added explicit `"type": "string"` in allOf conditional schemas
- **Files modified:** packages/registry/registry.schema.json
- **Commit:** 21347ff

## Integration Points

### Expected by plan 17-02
Plan 17-02 renames blocks to add -block suffix. The schema enforces this convention, so the validation script confirms all naming is correct after the renames.

### Enables future work
- **Phase 18 Final Audit:** Validation can be run as pre-commit hook or CI check
- **Future component additions:** Schema ensures new components meet all metadata requirements
- **CLI improvements:** Validation script can be integrated into `npx mcellui add` to verify registry integrity

## Validation Results

All 101 components passed validation:
- ✓ Schema validation passed
- ✓ No duplicate component names
- ✓ All naming conventions followed (including -block and -screen suffixes)
- ✓ All registry dependencies are valid
- ✓ All component files exist on disk

## Next Phase Readiness

**Blockers:** None

**Concerns:** None

**Dependencies met:**
- Plan 17-01 completed (metadata fields added)
- Plan 17-02 completed (file renames applied)
- Schema validates current registry.json structure
- Validation script can be integrated into CI/CD

**Ready to proceed:** Yes - Phase 17 complete (3/3 plans done)

## Notes

The validation script provides detailed error reporting with colored output, making it easy to identify and fix registry issues during development. The schema enforces all conventions established in plan 17-01 and the naming conventions from plan 17-02.

The script performs 5 types of validation:
1. **Schema validation** - Ensures registry matches JSON Schema structure
2. **Duplicate detection** - Prevents multiple components with same name
3. **Naming conventions** - Enforces kebab-case, -block, -screen suffixes
4. **Dependency validation** - Verifies registryDependencies reference real components
5. **File existence** - Confirms all files in registry.json exist on disk

This comprehensive validation ensures high registry quality and catches errors early.
