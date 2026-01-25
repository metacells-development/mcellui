---
phase: 04-progress-loading
plan: 01
subsystem: ui
tags: [design-tokens, theme-system, progress, loading, spinner, skeleton, react-native]

# Dependency graph
requires:
  - phase: 03-feedback-components
    provides: overlayTypography tokens, componentRadius pattern
  - phase: 01-form-inputs
    provides: component token foundation, spacing/typography integration
provides:
  - spinnerTokens with sm/md/lg container and ActivityIndicator size mappings
  - skeletonTokens with radius variants and shimmer animation config
  - progressTokens with sm/md/lg heights and animation durations
  - circularProgressTokens with size/stroke/label configurations
  - PROGRESS_CONSTANTS for indeterminate animation behavior
  - SKELETON_CONSTANTS for shimmer effect timing
affects: [04-02, 04-03, 04-04, 04-progress-loading]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Progress component tokens follow sm/md/lg size variant pattern
    - Animation configs included in token definitions (determinateDuration, indeterminateDuration)
    - Skeleton radius map provides comprehensive border radius options
    - Spinner uses ActivityIndicator 'small'/'large' native size variants

key-files:
  created: []
  modified:
    - packages/core/src/theme/components.ts
    - packages/core/src/constants.ts

key-decisions:
  - "Spinner MD uses 'small' ActivityIndicator for 24px wrapper consistency"
  - "Skeleton radius map includes none/sm/md/lg/full for maximum flexibility"
  - "Progress animation tokens separate determinate vs indeterminate durations"
  - "CircularProgress includes labelSize tokens for percentage display scaling"

patterns-established:
  - "Animation configs as nested objects within component tokens (tokens.animation.duration)"
  - "Fallback color constants for variant support (success/warning)"
  - "Text-specific tokens for Skeleton (defaultLines, defaultGap, lastLineWidth)"

# Metrics
duration: 2.2min
completed: 2026-01-25
---

# Phase 04 Plan 01: Progress & Loading Token Foundation

**Centralized component tokens for Spinner, Skeleton, Progress, and CircularProgress with size variants and animation configurations**

## Performance

- **Duration:** 2.2 min
- **Started:** 2026-01-25T10:03:55Z
- **Completed:** 2026-01-25T10:06:08Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Added spinnerTokens, skeletonTokens, progressTokens, circularProgressTokens to core theme system
- Established PROGRESS_CONSTANTS and SKELETON_CONSTANTS for animation behavior
- All tokens follow established sm/md/lg size variant pattern for API consistency
- Animation configurations embedded in token definitions for component consumption

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Spinner, Skeleton, Progress, CircularProgress tokens** - `0fda932` (feat)
2. **Task 2: Add PROGRESS_CONSTANTS and SKELETON_CONSTANTS** - `73054c2` (feat)

## Files Created/Modified

- `packages/core/src/theme/components.ts` - Added spinnerTokens, skeletonTokens, progressTokens, circularProgressTokens with full size variant configs and animation settings
- `packages/core/src/constants.ts` - Added PROGRESS_CONSTANTS (indeterminate width, fallback colors) and SKELETON_CONSTANTS (shimmer timing, opacity range)

## Decisions Made

**1. Spinner uses ActivityIndicator native sizes**
- MD variant uses 'small' (24px container) for compact feel
- LG variant uses 'large' (36px container) for prominent loading states
- Rationale: Aligns with React Native ActivityIndicator API conventions

**2. Skeleton radius map provides comprehensive options**
- Includes none/sm/md/lg/full variants (0, 4, 8, 12, 9999)
- Enables skeletons to match any component border radius
- Rationale: Maximum flexibility for placeholder UI matching real content

**3. Progress animation tokens separate determinate vs indeterminate**
- determinateDuration: 300ms for smooth value transitions
- indeterminateDuration: 1000ms for continuous animation cycle
- Rationale: Different UX patterns need different timing characteristics

**4. CircularProgress includes labelSize tokens**
- SM: 10px, MD: 14px, LG: 20px label font sizes
- Scales percentage display proportionally to circle size
- Rationale: Ensures readable labels at all size variants

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for Wave 2 component migrations:**
- All four progress component token definitions complete
- Animation constants established for Skeleton and Progress
- Pattern consistency with existing form input and button components
- No blockers for 04-02 (Spinner/Skeleton migration) or 04-03 (Progress/CircularProgress migration)

**Token foundation complete for:**
- Spinner size variants with native ActivityIndicator integration
- Skeleton shimmer animations and radius flexibility
- Progress bar heights and animation timing
- Circular progress stroke widths and label scaling

---
*Phase: 04-progress-loading*
*Completed: 2026-01-25*
