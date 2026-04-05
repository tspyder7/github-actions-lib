# AGENTS.md

This file provides guidance for agentic coding agents working in this repository.

## Repository Overview

This repository contains **reusable GitHub Actions** and **workflows** for internal organization
use.

> **Note:** These are not published to the GitHub Marketplace. Use relative paths for actions and
> `workflow_call` for workflows.

### Actions (use via relative path: `.github/actions/<name>`)

- `npm-publish` - Publish packages to NPM with npm/yarn/pnpm support

### Workflows (use via `workflow_call`)

- `auto-pr.yml` - Automatically creates/updates PRs based on branch hierarchy
- `enforce-pr-hierarchy.yml` - Validates and enforces PR branch hierarchy rules
- `npm-publish.yml` - Publish packages to NPM registry

## Build/Lint/Test Commands

This is a YAML-only repository with no build scripts or automated tests.

```bash
# Install yamllint
pip install yamllint

# Validate all YAML files
yamllint .github/

# Validate a specific file
yamllint .github/workflows/auto-pr.yml
yamllint .github/actions/npm-publish/action.yml
```

### VS Code Integration

- YAML schema validation via `json.schemastore.org/github-workflow`
- Auto-format on save using `redhat.vscode-yaml`

### Manual Workflow Testing

Test workflows by creating a test workflow that calls reusable workflows via `workflow_call`.

## Code Style Guidelines

### YAML Formatting

| Rule                      | Value    |
| ------------------------- | -------- |
| Indentation (workflows)   | 2 spaces |
| Indentation (other files) | 4 spaces |
| Line endings              | LF       |
| Charset                   | UTF-8    |
| Trailing whitespace       | Trimmed  |
| Final newline             | Required |

### Naming Conventions

| Element          | Convention                | Example                     |
| ---------------- | ------------------------- | --------------------------- |
| Workflow names   | PascalCase                | `Auto PR Generation`        |
| Inputs/secrets   | kebab-case                | `pr-branch-hierarchy-json`  |
| Job names        | PascalCase                | `Generate PR Automatically` |
| Step names       | Sentence case, verb first | `Checkout code`             |
| Outputs          | snake_case                | `is_valid`                  |
| Environment vars | SCREAMING_SNAKE           | `ALLOWED_BRANCHES_JSON`     |

### Workflow Structure

```yaml
# File header comment
# Reusable GitHub Actions workflow: [Brief Description]

name: Workflow Name

on:
    workflow_call:
        inputs:
            input-name:
                type: string
                required: true
                description: 'Description'
        secrets:
            SECRET_NAME:
                description: 'GitHub token with...'
                required: true

jobs:
    job-name:
        name: Job Name
        runs-on: ubuntu-latest
        permissions:
            contents: write
            pull-requests: write
        steps:
            - name: Step name
              run: |
                  # commands
```

### Error Handling Patterns

```bash
# Error (stops workflow)
echo "::error::Invalid JSON"
exit 1

# Grouped output (collapsible)
echo "::group::Validating..."
echo "Content"
echo "::endgroup::"

# Warning
echo "::warning::Optional dependency not found"
```

### Validation Patterns

Always validate JSON inputs:

```bash
if ! echo "$INPUT_JSON" | jq empty 2>/dev/null; then
  echo "::error::Invalid JSON in input"
  exit 1
fi
```

### JSON Output Multiline Values

```bash
{
  echo "content<<EOF"
  echo -e "$multiline_content"
  echo "EOF"
} >> $GITHUB_OUTPUT
```

### Conditional Step Execution

```yaml
- name: Step name
  if: steps.previous.outputs.has_changes == 'true'
  run: |
      # commands
```

## Commit Message Conventions

| Type        | Use Case                           |
| ----------- | ---------------------------------- |
| `feat:`     | New features or workflows          |
| `fix:`      | Bug fixes                          |
| `hotfix:`   | Urgent production fixes            |
| `chore:`    | CI/CD, tooling, dependency updates |
| `refactor:` | Code restructuring                 |
| `test:`     | Test additions                     |
| `docs:`     | Documentation updates              |

Example: `feat: add npm-publish workflow for automated package publishing`

## Documentation Standards

### Workflows

Each workflow should have corresponding docs in `.github/docs/`:

- Filename: `{workflow-name}.md`
- Include: Features, usage, inputs, secrets, example caller workflows

### Actions

Each action should have a README.md in the action directory:

- Filename: `README.md`
- Include: Features, usage, inputs, outputs, examples

## Security Considerations

1. Never log secret values
2. Always specify minimal required permissions
3. Document required token permissions in secrets description
4. Always validate JSON inputs before processing
5. Don't expose sensitive info in error messages

## File Organization

```
.github/
├── actions/            # Reusable actions (composite)
│   └── npm-publish/
│       ├── action.yml
│       └── README.md
├── workflows/         # Reusable workflow definitions
│   ├── auto-pr.yml
│   ├── enforce-pr-hierarchy.yml
│   └── npm-publish.yml
├── docs/              # Workflow documentation
│   ├── auto-pr.md
│   ├── enforce-pr-hierarchy.md
│   └── npm-publish.md
└── PULL_REQUEST_TEMPLATE.md
```

### Action Structure

Each action should follow this pattern:

```yaml
name: Action Name
description: Brief description
inputs:
    input-name:
        description: 'Description'
        required: false
        default: 'default-value'
outputs:
    output-name:
        description: 'Output description'
        value: ${{ steps.step-id.outputs.value }}
runs:
    using: composite
    steps:
        - name: Step name
          shell: bash
          run: |
              # commands
```

## PR Checklist

Before submitting a PR:

- [ ] YAML files pass `yamllint`
- [ ] All inputs/secrets have descriptions
- [ ] Documentation updated if workflow behavior changed
- [ ] Commit messages follow conventional format
- [ ] No sensitive data in logs or comments
