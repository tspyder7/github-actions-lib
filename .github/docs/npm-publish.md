# 🚀 [Publish to NPM Workflow](../workflows/npm-publish.yml)

This reusable workflow automates publishing your package to the NPM registry using the specified package manager. It supports **npm**, **yarn**, and **pnpm**.

---

## ✅ Features

- Validates supported package managers (`npm`, `yarn`, `pnpm`)
- Automatically sets up Node.js and project dependencies
- Builds the project before publishing
- Publishes the package to the specified registry with `--access public`

---

## 📦 Usage

To use this workflow in your repository, define a workflow file that calls it using `workflow_call`.

### Example Caller Workflow

```yaml
name: NPM Publish

on:
  push:
    branches: [main]

jobs:
  publish-package:
    uses: tspyder7/github-action-lib/.github/workflows/npm-publish.yml@main
    with:
      node-version: "20"
      registry-url: "https://registry.npmjs.org/"
      package-manager: "pnpm"
    secrets:
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
