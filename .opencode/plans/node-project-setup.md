# Plan: Configure Node.js Project with TypeScript and Tooling

## Objective

Configure a Node.js project using pnpm for dependency management with TypeScript, esbuild, and
various linting tools. Git hooks will enforce code quality before commits.

---

## Source Directory Structure

```
src/
  actions/
    npm-publish/
      index.ts         # Main entry point (to be implemented later)
      utils/
        logger.ts      # Shared logging utility
```

## Output Location

Each action's bundled script will be placed at:

```
.github/actions/<name>/dist/script.js
```

---

## Phase 1: Root Configuration Files

### 1.1 `package.json`

- Workspace root with `private: true`
- Dependencies: `typescript`, `esbuild`
- DevDependencies: `eslint`, `prettier`, `markdownlint-cli`, `husky`, `@commitlint/cli`,
  `@commitlint/config-conventional`, `@typescript-eslint/parser`,
  `@typescript-eslint/eslint-plugin`, `@types/node`
- Scripts:
    - `build` - Run esbuild to bundle all action scripts
    - `lint` - ESLint on src/
    - `lint:fix` - ESLint with --fix
    - `format` - Prettier write
    - `format:check` - Prettier check
    - `markdownlint` - Markdown linting
    - `ci` - Full linting suite (lint + format:check + markdownlint)

### 1.2 `pnpm-workspace.yaml`

- Define workspace: `packages: ['src/**']`

### 1.3 `tsconfig.json`

- Target: `ES2020`
- Module: `ESNext`
- Strict mode enabled
- ESBuild-compatible settings (`isolatedModules`, `esModuleInterop`)
- Include: `src/**/*`

---

## Phase 2: Tooling Configuration

### 2.1 `eslint.config.mjs`

- Flat config format (ESLint v9)
- Parser: `@typescript-eslint/parser`
- Extends: `eslint:recommended`, `plugin:@typescript-eslint/recommended`
- Plugins: `@typescript-eslint`
- Rules: Semi, quotes, indentation, no-unused-vars
- Ignore: `dist/`, `node_modules/`

### 2.2 `prettier.config.mjs`

```js
/**
 * @type {import('prettier').Config}
 */
const config = {
    printWidth: 120,
    tabWidth: 4,
    useTabs: false,
    semi: true,
    singleQuote: true,
    quoteProps: 'as-needed',
    trailingComma: 'all',
    arrowParens: 'always',
    proseWrap: 'always',
    endOfLine: 'auto',
    embeddedLanguageFormatting: 'auto',
    singleAttributePerLine: true,
};

export default config;
```

### 2.3 `.prettierignore`

```
dist/
node_modules/
pnpm-lock.yaml
.git/
*.yml
```

### 2.4 `markdownlint.json`

- Rules: MD003 (atx style), MD024 (allow different nesting), MD033 (no inline HTML), MD040 (fenced
  code language), MD041 (first line heading), MD047 (final newline)
- Ignores: `node_modules/`, `.git/`, `AGENTS.md`, `README.md`

---

## Phase 3: Build Configuration

### 3.1 `esbuild.config.mjs`

- Entry points: Glob `src/actions/*/index.ts`
- Output: `dist/script.js` in each action's directory
- Bundle: `bundle: true`
- Platform: `node`
- Target: `node20`
- Format: `esm`
- Minify: Based on `NODE_ENV`
- Sourcemap: Based on `NODE_ENV`
- Log level: `info`
- Each entry outputs to corresponding `.github/actions/<name>/dist/script.js`

---

## Phase 4: Git Configuration

### 4.1 `.gitignore` (update)

```
dist/
node_modules/
*.log
.env
.env.*
```

### 4.2 `.husky/pre-commit`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm run lint
```

### 4.3 `.husky/commit-msg`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm commitlint --edit "$1"
```

### 4.4 `commitlint.config.mjs`

```js
export default { extends: ['@commitlint/config-conventional'] };
```

---

## Phase 5: Initial Source Files

### 5.1 `src/actions/npm-publish/index.ts`

```typescript
// TODO: Convert inline bash logic to TypeScript
// Placeholder to establish the build pipeline

export function main(): void {
    console.log('npm-publish action - to be implemented');
}

main();
```

### 5.2 `src/actions/npm-publish/utils/logger.ts`

```typescript
export function log(message: string): void {
    console.log(message);
}

export function error(message: string): void {
    console.error(message);
}
```

---

## Phase 6: Installation & Setup

1. Run `pnpm install`
2. Initialize husky: `npx husky init`
3. Remove default pre-commit hook from husky
4. Create `.husky/pre-commit` with pnpm lint command
5. Create `.husky/commit-msg` with commitlint command
6. Run `pnpm run build` to test esbuild
7. Verify `dist/script.js` is created in `npm-publish` action

---

## Phase 7: Validation

After setup, run:

```bash
pnpm run ci
```

This will validate:

- ESLint passes on `src/`
- Prettier format is correct
- Markdownlint passes on all `.md` files

---

## Files to Create

| File                                      | Purpose                    |
| ----------------------------------------- | -------------------------- |
| `package.json`                            | Dependencies and scripts   |
| `pnpm-workspace.yaml`                     | Workspace definition       |
| `tsconfig.json`                           | TypeScript configuration   |
| `eslint.config.mjs`                       | ESLint rules (flat config) |
| `prettier.config.mjs`                     | Prettier config            |
| `.prettierignore`                         | Prettier ignore            |
| `markdownlint.json`                       | Markdown lint rules        |
| `esbuild.config.mjs`                      | Build configuration        |
| `commitlint.config.mjs`                   | Commit message rules       |
| `.husky/pre-commit`                       | Pre-commit hook            |
| `.husky/commit-msg`                       | Commit-msg hook            |
| `src/actions/npm-publish/index.ts`        | Placeholder action script  |
| `src/actions/npm-publish/utils/logger.ts` | Utility module             |

## Files to Update

| File         | Change                             |
| ------------ | ---------------------------------- |
| `.gitignore` | Add `dist/`, `node_modules/`, etc. |

---

## Notes

- **Workflows**: Scripts will NOT be extracted to TypeScript (per decision)
- **Existing scripts**: `npm-publish` action's inline bash will NOT be converted yet (per decision)
- **Future actions**: Follow the same pattern (TS in `src/actions/<name>/`, bundled to
  `.github/actions/<name>/dist/script.js`)
- **No action scripts**: Actions without TS files (pure bash) will not have `dist/script.js` and
  will continue using inline bash in `action.yml`
