# CLI Best Practices Research

**Research Date:** 2026-01-26
**Confidence Level:** HIGH
**Sources:** clig.dev, Heroku CLI Style Guide, shadcn/ui CLI, Vite CLI, Evil Martians CLI UX

## Executive Summary

Modern developer CLIs have evolved from simple command-line tools into conversational, human-first interfaces that guide users through complex workflows. The best CLIs (shadcn/ui, Vite, Heroku CLI) share common patterns: they prioritize developer experience through clear error messages, intelligent defaults, progressive disclosure, and visual feedback that makes CLI interaction feel responsive and trustworthy.

**Key Finding:** Excellence in CLI design comes from treating the terminal as a conversational interface where users learn through doing, not from exhaustive documentation.

---

## 1. Command Structure & Naming

### Best Practices from Successful CLIs

**Verb-Noun or Noun-Verb Consistency**
- **shadcn/ui pattern:** `shadcn init`, `shadcn add button`, `shadcn list`
- **Heroku pattern:** `heroku apps:create`, `heroku pg:credentials:repair-default`
- **Rule:** Pick one ordering and stick to it across all commands
- **mcellui current:** Uses verb pattern (`mcellui init`, `mcellui add`, `mcellui list`) ✓

**Avoid List Commands as Subcommands**
- **Anti-pattern:** `heroku apps:list` → Instead: `heroku apps` (root lists by default)
- **Rationale:** Listing is the most common operation, don't make users type extra
- **mcellui current:** `mcellui list` is separate command (acceptable but could be shortened)

**Use Kebab-Case for Multi-Word Commands**
- **Good:** `git cherry-pick`, `heroku pg:credentials:repair-default`
- **Bad:** `gitCherryPick`, `git_cherry_pick`
- **mcellui current:** No multi-word commands yet ✓

### Flag Design Patterns

**Always Provide Long-Form Flags**
```bash
# Good - both options available
-h, --help
-y, --yes
-o, --overwrite

# Bad - only short form
-h (no --help)
```

**Standard Flag Names (from clig.dev)**
| Flag | Purpose | Used By |
|------|---------|---------|
| `-f, --force` | Skip safety checks | git, npm |
| `-n, --dry-run` | Preview without executing | rsync, apt |
| `-q, --quiet` | Suppress output | curl, wget |
| `-v, --verbose` | Detailed output | npm, curl |
| `--json` | Machine-readable output | heroku, shadcn |
| `--no-color` | Disable colors | most CLIs |
| `-y, --yes` | Skip confirmations | apt, npm |
| `--cwd <path>` | Working directory | shadcn, vite |

**mcellui current flags:** ✓ Uses standard conventions

### Arguments vs. Flags

**Prefer Flags Over Arguments**
```bash
# Good - clear intent
heroku fork --from sourceapp --to destapp
mcellui add button --overwrite

# Bad - confusing order
heroku fork destapp -a sourceapp
```

**When Arguments Are Acceptable:**
1. Only one argument needed: `git commit`, `npm install express`
2. Multiple items of same type: `rm file1 file2 file3`, `mcellui add button card input`
3. Order is obvious and natural

**mcellui current:** ✓ Uses arguments for component names (good pattern)

---

## 2. Error Handling & User Feedback

### Error Message Principles

**1. Catch Expected Errors and Rewrite for Humans**
```bash
# Bad - raw stack trace
Error: ENOENT: no such file or directory, open 'package.json'
  at Object.openSync (fs.js:498:3)
  at readFileSync (fs.js:394:35)

# Good - actionable error
Could not find a valid project.
Run `npx mcellui init` first.
```

**mcellui current:** ✓ Good error messages in init, add, list commands

**2. Provide Actionable Solutions**
```bash
# Bad
Error: Config file not found

# Good (mcellui pattern - excellent!)
Project not initialized.
Run `npx mcellui init` first.
```

**3. Place Critical Information at the End**
- Terminal scrolls down → users see last output first
- Put the "what to do now" at the bottom, not the top

**4. Use High Signal-to-Noise Ratio**
```bash
# Good - grouped errors
3 components failed to install:
  - button: registry unreachable
  - card: file already exists
  - input: invalid format

# Bad - individual error per component with stack traces
```

### Exit Codes

**Standard Exit Code Pattern**
```bash
0 = success
1 = general error
2 = misuse of shell command
130 = terminated by Ctrl-C
```

**Semantic Exit Codes (Advanced)**
```bash
# mcellui diff pattern (excellent!)
0 = all components identical
1 = components have differences
```

**mcellui current:** ✓ Uses correct exit codes, semantic exit in `diff` command

### Progress Indication

**Spinner Pattern (using ora)**
```javascript
const spinner = ora('Loading...').start();
// ... operation ...
spinner.succeed('Completed');  // or .fail(), .warn(), .info()
```

**Best Practices:**
1. Start within 100ms to avoid "frozen" feeling
2. Always stop/clear spinners after operations
3. Show what's happening: "Fetching components...", "Comparing files..."
4. Only show spinners when stdout is a TTY

**mcellui current:** ✓ Excellent spinner usage in all commands

**Progress Bar vs. Spinner**
- **Spinner:** Use for indeterminate operations (fetching, network calls)
- **Progress Bar:** Use for "X of Y" operations (installing 3/10 components)
- **X of Y Pattern:** Best for multi-step operations

```bash
# Example from Evil Martians
Installing dependencies (2/5)
✓ react-native-reanimated
✓ react-native-gesture-handler
⏳ react-native-safe-area-context
  @react-native-community/blur
  expo-haptics
```

---

## 3. Output Formatting & Colors

### Color Usage Guidelines

**Intentional Color Usage**
```javascript
// Good - semantic colors
chalk.red('Error: file not found')
chalk.green('✓ Success!')
chalk.yellow('⚠ Warning: deprecated API')
chalk.cyan('npx mcellui add button')  // Commands
chalk.dim('(up to date)')  // Meta information

// Bad - rainbow output
chalk.red('Project')
chalk.blue('not')
chalk.green('initialized')
```

**mcellui current:** ✓ Excellent semantic color usage

**When to Disable Colors**
1. `stdout` or `stderr` is not a TTY (being piped)
2. `NO_COLOR` environment variable is set
3. `TERM=dumb`
4. User passes `--no-color` flag

**Implementation:**
```javascript
// chalk handles this automatically, but be aware:
import chalk from 'chalk';

// Force color detection
if (process.env.NO_COLOR) {
  chalk.level = 0;  // disable colors
}
```

### Icon/Symbol Usage

**Consistent Status Icons**
```javascript
// mcellui pattern (excellent!)
✓ = success (green)
✗ = error (red)
⚠ = warning (yellow)
! = attention (yellow)
? = unknown/custom (blue)
⏳ = in progress
```

**Emoji Usage:** Use sparingly, can break in some terminals

### Output Modes

**Human-Readable (Default)**
```bash
$ mcellui list

Available Components

Forms
  button        Interactive button component
  input         Text input field with validation
  card          Container component for content
```

**Machine-Readable (--json)**
```bash
$ mcellui list --json
[
  {
    "name": "button",
    "category": "forms",
    "description": "Interactive button component",
    "status": "stable"
  }
]
```

**Best Practices:**
1. Default to human-readable when TTY
2. Always provide `--json` for scripting
3. `--json` output should be valid JSON (no extra logging mixed in)
4. Consider `--plain` for tabular data that needs piping

**mcellui current:** ✓ Has `--json` in `diff` and `doctor` commands, could add to `list`

### Table Formatting

**grep-Parseable Tables**
```bash
# Good - can grep for columns
ID         Location                 Runtime
eu         Europe                   Common Runtime
us         United States            Common Runtime

# Can do: mcellui list | grep "stable"
```

**mcellui list --installed output:** ✓ Well-structured, readable

---

## 4. Configuration Management

### Configuration Precedence (Highest to Lowest)

1. **Command-line flags** - always win
2. **Environment variables** - per-user/machine
3. **Project config file** - version-controlled
4. **User config** - `~/.config/mcellui/config.json`
5. **System config** - `/etc/mcellui/config.json`

**mcellui current:** ✓ Uses project config file + flags (good pattern)

### Config File Patterns

**cosmiconfig Pattern (Best Practice)**
- Searches for config in multiple formats automatically
- Commonly used by Prettier, ESLint, Babel, etc.

Search order:
```bash
1. package.json "mcellui" key
2. .mcelluirc.json, .mcelluirc.yaml, .mcelluirc.yml
3. .mcelluirc.js, .mcelluirc.ts, .mcelluirc.mjs, .mcelluirc.cjs
4. .config/mcelluirc (any format)
5. mcellui.config.js, mcellui.config.ts, mcellui.config.mjs, mcellui.config.cjs
```

**mcellui current:** Uses `mcellui.config.ts` (good - TypeScript DX is excellent)

**Type Safety Pattern (mcellui uses this - excellent!)**
```typescript
// Inline defineConfig helper in generated file
const defineConfig = <T>(config: T): T => config;

export default defineConfig({
  theme: 'blue',
  radius: 'md',
  // ...
});
```

**Alternative:** Export helper from CLI package
```typescript
// From @metacells/mcellui-cli
import { defineConfig } from '@metacells/mcellui-cli';

export default defineConfig({ ... });
```

### Environment Variables

**Standard Environment Variables to Check**
```bash
NO_COLOR=1          # Disable colors
FORCE_COLOR=1       # Force colors (in CI)
DEBUG=1             # Verbose logging
EDITOR=vim          # For interactive editing
HTTP_PROXY=...      # Proxy settings
TMPDIR=/tmp         # Temp file location
HOME=/Users/foo     # User home directory
TERM=xterm-256color # Terminal capabilities
```

**mcellui current:** Could add `DEBUG` support for verbose logging

---

## 5. Interactivity & Prompts

### When to Prompt

**1. Only When stdin is a TTY**
```javascript
import prompts from 'prompts';

// Good - check before prompting
if (process.stdin.isTTY && !options.yes) {
  const response = await prompts({...});
}
```

**mcellui current:** ✓ Uses `--yes` flag to skip prompts (good!)

**2. Always Allow Bypassing Prompts**
```bash
# Interactive mode
$ mcellui init
? Where should components be installed? ./components/ui
? Which style preset? default

# Non-interactive mode (for CI/scripts)
$ mcellui init --yes
```

**mcellui current:** ✓ Both modes supported

### Prompt Patterns

**Confirmation for Dangerous Operations**
```bash
# Adding dependencies
Add 3 additional dependencies?
› Yes / No (default: Yes)

# Overwriting files
button.tsx already exists. Overwrite?
› No (use --overwrite to skip this prompt)
```

**mcellui current:** ✓ Confirms before adding dependencies

**Multi-Select for Lists**
```javascript
// mcellui add (no args) - excellent pattern!
const { selected } = await prompts({
  type: 'multiselect',
  name: 'selected',
  message: 'Which components would you like to add?',
  choices: registry.map(item => ({
    title: `${item.name} ${chalk.dim(`(${item.status})`)}`,
    value: item.name,
    description: item.description,
  })),
  hint: '- Space to select, Enter to confirm',
});
```

**Best Practices:**
1. Show hints: "Space to select, Enter to confirm"
2. Include descriptions for options
3. Provide visual distinction (colors, status)
4. Set sensible defaults

---

## 6. Help & Documentation

### Help Text Patterns

**Short Help (-h)**
```bash
$ mcellui add -h

Usage: mcellui add [options] [components...]

Add a component to your project

Arguments:
  components            Components to add

Options:
  -y, --yes             Skip confirmation
  -o, --overwrite       Overwrite existing files
  --cwd <path>          Working directory (default: current)
  -h, --help            Display help
```

**Detailed Help (--help or docs URL)**
- Link to web documentation
- Show examples
- Explain common workflows

**Commander.js handles this automatically - mcellui benefits from this ✓**

### Help Content Priorities

1. **Lead with examples** - users learn by doing
```bash
Examples:
  $ mcellui add button
  $ mcellui add button card input
  $ mcellui add button --overwrite
```

2. **Show common flags first** - most frequently used at top
3. **Include next steps** - guide conversational flow
```bash
# mcellui init output - excellent!
Next steps:
  1. Add your first component:
     npx mcellui add button

  2. Browse available components:
     npx mcellui list
```

4. **Suggest corrections for invalid input**
```bash
# Good
$ mcellui ad button
Unknown command: ad
Did you mean: add?

# Bad
$ mcellui ad button
Error: command not found
```

---

## 7. Dependencies & Distribution

### Dependency Best Practices

**mcellui Current Stack (Excellent Choices!)**
```json
{
  "commander": "^12.0.0",     // Command structure
  "chalk": "^5.3.0",          // Colors
  "ora": "^8.0.0",            // Spinners
  "prompts": "^2.4.2",        // Interactive prompts
  "fs-extra": "^11.2.0",      // File operations
  "diff": "^7.0.0",           // Diff generation
  "glob": "^10.3.0",          // File globbing
  "zod": "^3.23.0"            // Config validation
}
```

**Industry Standard Libraries**
| Purpose | Best Library | Why |
|---------|--------------|-----|
| Commands | Commander.js | Most popular, simple API |
| Colors | Chalk | Auto-detects TTY, wide support |
| Spinners | Ora | Beautiful animations, auto-clears |
| Prompts | Inquirer.js or Prompts | Rich interactions |
| File ops | fs-extra | Promises + extra utilities |

**Avoid:**
- **Native dependencies** - break on node version updates
- **Large dependencies** - slow installs
- **request** → use `node-fetch` or `http-call`
- **underscore** → use `lodash` (tree-shakeable)

### Distribution Pattern

**Single Binary via npx (Best for Developer CLIs)**
```bash
# User never installs globally
npx mcellui init
npx mcellui add button

# Fast, always latest version, no global pollution
```

**mcellui current:** ✓ Distributed via npx (excellent!)

**Benefits:**
1. No global install needed
2. Always runs latest version
3. Easy to uninstall (it's automatic)
4. Works in CI without setup

---

## 8. Advanced Patterns

### Doctor/Diagnostic Command

**Pattern from Expo, Heroku, mcellui**
```bash
$ mcellui doctor

mcellui Doctor
Checking your project setup...

Checks

  ✓ Project Structure
    Valid package.json found

  ✗ Babel Config
    Reanimated plugin not configured
    Fix: Add 'react-native-reanimated/plugin' to babel.config.js

Summary: 8 passed, 2 warnings, 1 failed
```

**Best Practices:**
1. Group checks by category
2. Show both status and actionable fix
3. Use semantic colors (green/yellow/red)
4. Provide summary counts
5. Exit with error code if failures

**mcellui current:** ✓ Excellent `doctor` command implementation!

### Diff Command

**Pattern for Tracking Changes**
```bash
$ mcellui diff

Comparing components...

✓ button.tsx      (identical)
✗ card.tsx        (modified)
    @@ -10,3 +10,4 @@
    - import { View } from 'react-native';
    + import { View, Text } from 'react-native';

Summary: 5 identical, 1 modified

Update modified components with:
  npx mcellui add card --overwrite
```

**Best Practices:**
1. Show unified diff for modified files
2. Color-code additions (green) and deletions (red)
3. Provide update command at end
4. Use exit code to indicate differences (useful for CI)

**mcellui current:** ✓ Excellent diff implementation with colored output!

### List Command with Status

**Pattern: Show Installation Status**
```bash
$ mcellui list --installed

Installed Components (8)

Forms
  ✓ button        (up to date)
  ⚠ input         (modified locally)
  ? custom-form   (custom component)

Not Installed
  card, avatar, badge, ... +15 more

Summary: 5 up to date • 2 modified • 1 custom

Sync modified components:
  npx mcellui diff
```

**mcellui current:** ✓ Excellent --installed mode!

---

## 9. Quality Checklist for CLI Audit

### Command Structure
- [ ] Consistent verb-noun or noun-verb ordering across all commands
- [ ] All flags have both short (-h) and long (--help) forms
- [ ] Standard flag names used (--force, --yes, --json, --no-color)
- [ ] Arguments used appropriately (prefer flags for clarity)
- [ ] No ambiguous command abbreviations (future-proof)
- [ ] Help text shows examples and common usage

### Error Handling
- [ ] Expected errors caught and rewritten for humans
- [ ] Error messages include actionable fixes
- [ ] Exit codes used correctly (0 = success, non-zero = error)
- [ ] No raw stack traces shown to users
- [ ] Critical information placed at end of output
- [ ] Semantic exit codes for meaningful operations (like diff)

### Output & Feedback
- [ ] Colors used intentionally (not overused)
- [ ] Colors disabled when not TTY or NO_COLOR set
- [ ] Consistent status icons (✓ ✗ ⚠ ? !)
- [ ] Spinners shown for operations >100ms
- [ ] Spinners always stopped/cleared
- [ ] --json flag for machine-readable output
- [ ] Human output is grep-parseable

### Interactivity
- [ ] Prompts only shown when stdin is TTY
- [ ] All prompts skippable with flags (--yes)
- [ ] Confirmation required for dangerous operations
- [ ] Hints shown for multi-select prompts
- [ ] Sensible defaults for all prompts

### Configuration
- [ ] Config file has type safety (defineConfig helper)
- [ ] Config file name follows conventions (*.config.ts)
- [ ] Command-line flags override config
- [ ] Legacy config names supported with warnings
- [ ] Config validation with clear error messages

### User Experience
- [ ] Commands provide "next steps" after completion
- [ ] Similar commands suggested on typos
- [ ] Progress clearly communicated (what's happening now)
- [ ] Help text prioritizes examples over flag lists
- [ ] Success/failure clearly indicated with color + icon
- [ ] Long operations show incremental progress

### Dependencies & Performance
- [ ] No native dependencies (unless absolutely required)
- [ ] Minimal dependency tree (check npm ls)
- [ ] ESM modules for modern node support
- [ ] Distributed via npx (no global install)
- [ ] Commands respond within 100ms (or show spinner)

### Advanced Features
- [ ] Doctor command for diagnostics
- [ ] Diff command for tracking changes
- [ ] List command shows installation status
- [ ] Update command for syncing with registry
- [ ] JSON output mode for all read operations

---

## 10. mcellui CLI Strengths (Current Implementation)

### ✅ Excellent Patterns Already Implemented

1. **Error Handling** - Clear, actionable error messages
2. **Spinner Usage** - Consistent ora spinner usage with semantic states
3. **Color Scheme** - Semantic colors (green = success, yellow = warning, red = error)
4. **Status Icons** - Consistent ✓ ✗ ⚠ ? icons
5. **Exit Codes** - Correct exit codes including semantic diff exit code
6. **Prompts** - Skippable with --yes flag
7. **Interactive Mode** - Multi-select component picker in `add` command
8. **Next Steps** - init command shows what to do next
9. **Doctor Command** - Comprehensive diagnostic with actionable fixes
10. **Diff Command** - Colored diff output with update suggestions
11. **List --installed** - Shows sync status with visual indicators
12. **Configuration** - Type-safe config with inline defineConfig helper
13. **Dependencies** - Excellent library choices (commander, chalk, ora, prompts)
14. **Distribution** - npx-first approach

### 🔶 Areas for Potential Enhancement

1. **--json flag** - Add to `list` command for consistency
2. **Command suggestions** - "Did you mean X?" for typos
3. **Progress bars** - For multi-component installations (X of Y)
4. **DEBUG mode** - Verbose logging via DEBUG=mcellui environment variable
5. **Examples in help** - Commander supports .example() calls
6. **Telemetry** - Consider opt-in usage analytics (with clear consent)
7. **Aliases** - Consider `mcellui i` → `mcellui init`, `mcellui a` → `mcellui add`
8. **Update command** - Batch update all outdated components

---

## Sources

**Authoritative CLI Guides:**
- [Command Line Interface Guidelines (clig.dev)](https://clig.dev/) - Comprehensive CLI best practices guide
- [Heroku CLI Style Guide](https://devcenter.heroku.com/articles/cli-style-guide) - Production CLI patterns
- [CLI UX Best Practices - Evil Martians](https://evilmartians.com/chronicles/cli-ux-best-practices-3-patterns-for-improving-progress-displays) - Progress display patterns

**Successful CLI Examples:**
- [shadcn/ui CLI Documentation](https://ui.shadcn.com/docs/cli) - Component CLI inspiration
- [Vite CLI Documentation](https://vite.dev/guide/cli) - Fast, modern CLI patterns

**Node.js CLI Libraries:**
- [Building a CLI with Node.js in 2024](https://egmz.medium.com/building-a-cli-with-node-js-in-2024-c278802a3ef5) - Modern patterns
- [The Top 5 Node.js Packages for Building CLI Tools](https://www.makeuseof.com/nodejs-cli-packages-build-tools-best/) - Library comparison
- [cosmiconfig Documentation](https://github.com/cosmiconfig/cosmiconfig) - Configuration patterns

**Output Formatting:**
- [Colors and Formatting - Better CLI](https://bettercli.org/design/using-colors-in-cli/) - Color usage guidelines
- [FORCE_COLOR Specification](https://force-color.org/) - Color handling standards

---

## Confidence Assessment

| Area | Confidence | Source |
|------|------------|--------|
| Command Structure | HIGH | clig.dev, Heroku guide, Commander.js docs |
| Error Handling | HIGH | clig.dev, industry patterns |
| Output Formatting | HIGH | Better CLI guide, Evil Martians |
| Configuration | HIGH | cosmiconfig, real implementations |
| Interactivity | HIGH | Prompts/Inquirer docs, Heroku guide |
| Dependencies | MEDIUM | Stack Overflow, npm trends (needs verification) |

**Overall Confidence: HIGH** - Research based on authoritative sources (clig.dev, production CLIs) and verified against mcellui's current implementation.
