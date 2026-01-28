# Phase 17: Registry Structure & Metadata - Context

**Gathered:** 2026-01-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Audit and fix the component registry for complete metadata, correct dependencies, consistent naming, and extensible structure across all 33 components (27 UI + 6 blocks). No new components are added — this phase improves registry quality.

</domain>

<decisions>
## Implementation Decisions

### Metadata completeness
- Claude's Discretion: which metadata fields are required vs optional (audit current state and fill gaps)
- Claude's Discretion: whether to add a description field per component
- Claude's Discretion: platform support tracking approach
- Track Expo Go compatibility: add a field indicating whether a component requires a dev client (e.g., gesture handler, reanimated)
- Claude's Discretion: metadata validation approach (manual audit vs schema enforcement)

### Dependency accuracy
- Separate internal and external dependencies into distinct fields: `registryDependencies` (other mcellui components) and `dependencies` (npm packages)
- Claude's Discretion: dependency verification approach (manual audit vs automated script)
- Claude's Discretion: whether to include version constraints in external dependencies or just package names
- Claude's Discretion: peer dependency handling (separate field vs folding into external deps, considering Phase 14 decisions)

### Naming conventions
- Enforce current category names — new components must fit existing categories
- Blocks must end with `-block` suffix (e.g., `login-block`, `signup-block`, `settings-list-block`)
- Claude's Discretion: registry key format (kebab-case consistency, compound name handling, displayName field)

### Registry extensibility
- Keep flat list structure — one array of components with category field for grouping
- Claude's Discretion: schema version field (whether to add `schemaVersion` at top level)
- Claude's Discretion: inline template for new component entries
- Claude's Discretion: status value expansion (experimental, deprecated, beta)

</decisions>

<specifics>
## Specific Ideas

- Expo Go compatibility field helps agents warn users before adding components that need a dev client
- Separate registryDependencies/dependencies fields make the CLI's install logic cleaner — internal deps trigger recursive `mcellui add`, external deps trigger `npx expo install`
- Block suffix `-block` makes component type obvious from the name alone, without needing to check the category field

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 17-registry-structure-metadata*
*Context gathered: 2026-01-28*
