# 🧩 github-action-lib: Reusable GitHub Actions

This repository contains **reusable GitHub Actions** and **workflows** for internal organization use.

> **Note:** Not published to GitHub Marketplace. Use relative paths for actions and `workflow_call` for workflows.

---

## Actions

| Action | Description | Documentation |
|--------|-------------|---------------|
| [`npm-publish`](.github/actions/npm-publish/) | Publish packages to NPM with npm/yarn/pnpm support | [README](.github/actions/npm-publish/README.md) |

---

## Workflows

| Workflow | Description | Documentation |
|----------|-------------|---------------|
| [`auto-pr.yml`](.github/workflows/auto-pr.yml) | Auto-generate PRs from branch hierarchy | [README](.github/docs/auto-pr.md) |
| [`enforce-pr-hierarchy.yml`](.github/workflows/enforce-pr-hierarchy.yml) | Enforce PR branch hierarchy rules | [README](.github/docs/enforce-pr-hierarchy.md) |
| [`npm-publish.yml`](.github/workflows/npm-publish.yml) | Publish packages to NPM registry | [README](.github/docs/npm-publish.md) |
