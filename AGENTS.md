# AGENTS.md

Agentic coding guidance for this repository.

## Project Overview

This repository contains reusable GitHub Actions and workflows for internal use only. Not published to the Marketplace.

**Purpose:** Provide standardized, reusable CI/CD components that can be shared across multiple projects.

## Project Structure

```text
.github/
├── workflows/           # Reusable workflows (workflow_call)
│   └── *.yml
└── PULL_REQUEST_TEMPLATE.md

actions/
└── <action-name>/
    ├── action.yml        # Action definition
    ├── README.md         # Documentation
    ├── src/
    │   └── script.ts     # Source code
    └── dist/
        └── script.cjs    # Built output (generated)
```

## Build System

Actions use esbuild for bundling TypeScript to CJS.

### Build Configuration

```javascript
// esbuild config: platform node, target node20, format cjs
// External: fs, path, net, os, crypto, stream, util
```

### Build Commands

```bash
pnpm build           # Build all actions
pnpm build:watch    # Watch mode
```

### action.yml Structure

```yaml
name: action-name
description: Action description
inputs:
  input-name:
    description: Input description
    required: false
    default: default-value
outputs:
  output-name:
    description: Output description
    value: ${{ steps.step-id.outputs.output-name }}
runs:
  using: node24
  main: dist/script.cjs
```

## Conventions

### YAML

- Indentation: 2 spaces for workflows, 4 spaces for other files
- Line endings: LF
- Trailing whitespace: Trimmed
- Final newline: Required
- Validate with VS Code `redhat.vscode-yaml` extension

### Naming

| Element | Convention | Example |
|---------|------------|---------|
| Workflow names | PascalCase | `Auto PR Generation` |
| Inputs/secrets | kebab-case | `pr-branch-hierarchy-json` |
| Job names | PascalCase | `Generate PR Automatically` |
| Step names | Sentence case, verb first | `Checkout code` |
| Outputs | snake_case | `is_valid` |
| Env vars | SCREAMING_SNAKE | `ALLOWED_BRANCHES_JSON` |
| Action directories | kebab-case | `action-generator` |
| Action entry files | kebab-case | `script.ts` |

### Code Style

- Avoid unnecessary comments; code should be self-explanatory
- Follow existing patterns and conventions in the codebase
- Use existing libraries and utilities rather than reinventing solutions
- Mimic the style of neighboring files
- Keep functions focused and single-purpose
- Use descriptive variable names that convey intent
- Action inputs via `core.getInput()` and outputs via `core.setOutput()`
- Failures via `core.setFailed()`

## Error Handling

```bash
echo "::error::Invalid JSON"
exit 1

echo "::group::Validating..."
echo "::endgroup::"

echo "::warning::Optional dependency not found"
```

## Security

1. Never log secret values
2. Always specify minimal required permissions
3. Document token permissions in secrets description
4. Validate JSON inputs before processing
5. Don't expose sensitive info in errors
