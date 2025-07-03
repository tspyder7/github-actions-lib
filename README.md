# 🧩 github-action-lib: Reusable GitHub Actions Workflows

This repository contains a collection of **reusable GitHub Actions workflows** designed to automate common development tasks across multiple repositories, including:

- 🔁 Auto-generating pull requests from development branches
- 🚦 Enforcing pull request branch hierarchy rules
- 🚀 Publishing packages to NPM

Each workflow is modular, reusable via `workflow_call`, and configurable via inputs and secrets.

---

## 📁 Available Workflows

### 1. [`auto-pr.yml`](.github/workflows/auto-pr/workflow.yml)

**Automatically creates or updates pull requests** based on a configurable branch hierarchy. It also groups and appends release notes based on commit message types (e.g., `feat`, `fix`, `chore`).

🔗 [View README](./.github/workflows/auto-pr/README.md) (or inline the full usage guide in the same file)

---

### 2. [`enforce-pr-hierarchy.yml`](.github/workflows/enforce-pr-hierarchy/workflow.yml)

**Validates pull request source and target branches** against an allowed hierarchy. If a PR is opened from an unauthorized branch, it automatically comments and closes it.

🔗 [View README](./.github/workflows/enforce-pr-hierarchy/README.md)

---

### 3. [`npm-publish.yml`](.github/workflows/npm-publish/workflow.yml)

**Publishes your package to the NPM registry** using your preferred package manager (`npm`, `yarn`, or `pnpm`). It supports automatic build and dependency installation before publishing.

🔗 [View README](./.github/workflows/npm-publish/README.md)

---
