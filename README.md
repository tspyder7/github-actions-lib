# github-actions-lib: Reusable GitHub Actions

This repository contains **reusable GitHub Actions** and **workflows** for internal organization use.

> **Note:** Not published to GitHub Marketplace. Use relative paths for actions and `workflow_call` for workflows.

---

## Actions

| Action | Description | Documentation |
|--------|-------------|---------------|
| [`action-generator`](actions/action-generator/) | Generates composite actions | [README](actions/action-generator/README.md) |
| [`npm-publish`](actions/npm-publish/) | Publish packages to NPM with npm/yarn/pnpm support | [README](actions/npm-publish/README.md) |
| [`sleep-for-while`](actions/sleep-for-while/) | Sleeps for given seconds and optionally prints a message | [README](actions/sleep-for-while/README.md) |

---

## Workflows

| Workflow | Description | Documentation |
|----------|-------------|---------------|
| [`auto-pr.yml`](.github/workflows/auto-pr.yml) | Auto-generate PRs from branch hierarchy | [README](.github/docs/auto-pr.md) |
| [`enforce-pr-hierarchy.yml`](.github/workflows/enforce-pr-hierarchy.yml) | Enforce PR branch hierarchy rules | [README](.github/docs/enforce-pr-hierarchy.md) |
| [`npm-publish.yml`](.github/workflows/npm-publish.yml) | Publish packages to NPM registry | [README](.github/docs/npm-publish.md) |

---

## License

Apache License Version 2.0
