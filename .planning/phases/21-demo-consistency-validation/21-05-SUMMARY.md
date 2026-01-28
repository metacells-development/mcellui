# Summary: 21-05 App Screens & Dark Mode Verification

## What Was Built

Completed final demo app token migration and verified dark mode across all screens:

### Task 1: App Screen Migration
- Migrated app screens (index.tsx, playground.tsx, components/[name].tsx)
- Typography values use theme tokens
- UI chrome uses semantic color tokens

### Task 2: Bundling Fixes
Fixed multiple bundling errors discovered during verification:
- **Block import paths**: Corrected imports in blocks-demo.tsx to use registry export names (e.g., `NotificationItem` not `NotificationItemBlock`)
- **Preview component names**: Fixed 7 mismatched Preview function references
- **Metro plugin**: Added emptyConfig.ts to build entries for @mcellui/auto-config resolution
- **Avatar size compatibility**: Fixed SocialProofBar using invalid `avatarSize="xs"` (Avatar only supports sm|md|lg)

### Task 3: Dark Mode Verification (Checkpoint)
Manual verification on iOS Simulator confirmed:
- Light mode renders correctly
- Dark mode adapts properly - no white backgrounds, readable text
- Theme switching works (color themes, radius presets)
- All component demos work in both modes

## Commits

1. `fix(21-05): correct block import paths in blocks-demo` - fc8faf2
2. `fix(21-05): correct Preview component names in blocks-demo` - fa50d00
3. `fix(metro-plugin): include emptyConfig.js in build output` - (earlier)
4. `fix(21-05): align block imports with registry export names` - d0a3dab
5. `fix(21-05): align SocialProofBar avatarSize with Avatar supported sizes` - a48cd85

## Files Modified

- apps/demo/components/demos/blocks-demo.tsx (import fixes, Preview names, avatarSize)
- packages/metro-plugin/tsup.config.ts (added emptyConfig.ts entry)
- packages/registry/blocks/social-proof-bar-block.tsx (avatarSize type fix)
- apps/demo/components/blocks/social-proof-bar-block.tsx (avatarSize type fix)

## Verification

- [x] All app screens use typography tokens
- [x] Demo app renders correctly in light mode
- [x] Demo app renders correctly in dark mode
- [x] Theme selector adapts to color scheme
- [x] Theme switching (colors, radius) works throughout app
- [x] No visual regressions from token migration

## Notes

Several pre-existing bugs were discovered and fixed during verification:
1. Block import names didn't match registry exports (Metro resolves to registry, not local copies)
2. SocialProofBar had 'xs' size option but Avatar only supports sm|md|lg
3. Metro plugin emptyConfig.js wasn't being built, breaking @mcellui/auto-config fallback

Phase 21 complete - demo app follows same token standards as library components.
