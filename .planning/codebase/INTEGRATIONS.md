# External Integrations

**Analysis Date:** 2026-01-26

## APIs & External Services

**MCP Servers (Developer Tools):**
- shadcn - Stdio connection for shadcn UI component access
  - Config: `.mcp.json` - MCP configuration
  - Purpose: IDE integration for component discovery

- Expo MCP - HTTP connection to https://mcp.expo.dev/mcp
  - Purpose: Expo development tools integration

- React Native/Expo MCP - Stdio via @divagnz/mcp-react-native-expo
  - Purpose: React Native development assistance

- Figma MCP - HTTP connection to https://mcp.figma.com/mcp
  - Purpose: Design system integration with Figma

- Context7 MCP - Stdio via @upstash/context7-mcp
  - Purpose: Development context management

**No Third-Party API Clients Detected:**
- No Stripe, Firebase, Supabase, AWS SDK, or other service SDKs
- No HTTP client library (axios, fetch, etc.) - components are UI-only
- No authentication service integrations

## Data Storage

**Databases:**
- None - This is a UI component library, not a backend application

**File Storage:**
- Local filesystem only
- No cloud storage integration (S3, Cloudinary, etc.)

**Caching:**
- React Native platform caching (via Expo)
- Build caching via Turborepo (local)
- No external cache service

## Authentication & Identity

**Auth Provider:**
- None integrated
- Components include UI layouts (LoginBlock, SignupBlock in `packages/registry/blocks/`) but no auth logic
- Users implement their own authentication

**Custom Implementation:**
- Form components use react-hook-form + zod for validation
- No pre-built auth provider integration

## Monitoring & Observability

**Error Tracking:**
- None detected

**Logs:**
- Console logging allowed in demo app and CLI tools (via ESLint rules in `eslint.config.js`)
- No centralized logging service

**Debugging:**
- React Native debugging via Expo
- No Sentry, LogRocket, or similar integrations

## CI/CD & Deployment

**Hosting:**
- GitHub repository: https://github.com/metacells/mcellui
- No detected hosting platform (Vercel, Netlify, AWS, etc.)
- Demo app: Requires local Expo development server
- Docs site: Could be deployed to any Node.js hosting (uses Next.js)

**CI Pipeline:**
- No CI/CD service detected (no GitHub Actions, GitLab CI, etc. configs)
- Local development and testing only

**Publishing:**
- npm packages published to npm registry:
  - `@metacells/mcellui-core`
  - `@metacells/mcellui-cli`
  - `@metacells/mcellui-metro-plugin`
  - `@metacells/mcellui-mcp-server`

## Environment Configuration

**Required env vars:**
- None - zero-config philosophy
- Configuration via `mcellui.config.ts` in user projects

**Secrets location:**
- No secrets management detected
- Not applicable for UI component library

**GitHub Integration:**
- Repository: https://github.com/metacells/mcellui
- Issue tracking via GitHub Issues

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected

## Build & Development Tools

**Module Resolution:**
- Babel module-resolver plugin - Maps `@/components/*` paths to registry directories
- Metro extraNodeModules - Custom path aliasing for monorepo
- Path aliases configured in `mcellui.config.ts` user config

**Component Registry:**
- Local registry system in `packages/registry/`
- registry.json generated from component metadata
- No remote registry fetch

## IDE & Editor Integration

**MCP Server (packages/mcp-server):**
- Exposes component registry to Claude and other AI assistants
- Location: `packages/mcp-server/`
- Reads from local `registry.json` and component source
- Broadcasts component metadata, source code, and examples

**Figma Plugin:**
- Location: `packages/figma-plugin/`
- Design token sync capability (documented)
- Component export capability (documented)
- Runs in Figma desktop app, integrates with `@metacells/mcellui-core`

## Third-Party Styling & UI Libraries

**Documentation Site Only (apps/docs):**
- Radix UI primitives - Headless components for docs
- class-variance-authority - Component variant management
- clsx - Conditional className utilities
- cmdk - Command/search menu
- lucide-react - Icon library
- motion - Animation library
- sonner - Toast notifications
- tailwind-merge - Merge Tailwind class conflicts
- shiki - Syntax highlighting
- rehype-pretty-code - Code block rendering

**No External UI in Main Library:**
- Core library uses only React Native primitives
- No dependency on shadcn, Material UI, or other UI libraries

---

*Integration audit: 2026-01-26*
