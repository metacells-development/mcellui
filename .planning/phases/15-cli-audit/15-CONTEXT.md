# Phase 15: CLI Error Handling & Consistency - Context

**Gathered:** 2026-01-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Audit all 8 CLI commands (init, add, list, doctor, diff, update, create, pick) for error handling and UX consistency. Standardize error messages, exit codes, flag naming, and help text across all commands. No new commands or features — this is a quality pass on existing behavior.

</domain>

<decisions>
## Implementation Decisions

### Flag naming conventions
- `--cwd <path>` support: Claude's discretion on which commands need it (based on whether the command reads/writes project files)
- `--json` flag: Claude's discretion on which commands benefit from machine-readable output
- `--verbose`/`--debug` flag: Claude's discretion on approach (global vs per-command vs relying on `doctor`)
- Confirmation prompts for destructive operations: Claude's discretion on which commands need confirmation and `--yes` to skip

### Error message style
- Tone: Claude's discretion (should be consistent across all commands)
- Documentation links in errors: Claude's discretion on where they add value
- stderr vs stdout separation: Claude's discretion on output stream strategy
- Partial failure behavior (e.g., `add` with multiple components): Claude's discretion on continue-vs-stop approach

### Claude's Discretion
User gave full discretion on all implementation choices for this phase. Key constraints from the roadmap success criteria that must be met:
1. All CLI errors written to stderr with actionable next-step guidance
2. All CLI commands use consistent exit codes (0 success, 1 errors)
3. All CLI flags follow consistent naming patterns across commands
4. All CLI help text is accurate and complete for every command
5. CLI handles edge cases gracefully (no project, missing config, network failures)

Claude has flexibility on HOW to achieve these — tone, flag strategy, output format, partial failure behavior, verbose mode, and documentation links are all open.

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. The user trusts Claude to make sensible CLI UX decisions within the success criteria defined in the roadmap.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 15-cli-audit*
*Context gathered: 2026-01-26*
