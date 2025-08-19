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

### 🧾 Workflow Inputs

| Name            | Type   | Required | Default                        | Description                                                                 |
|-----------------|--------|----------|--------------------------------|-----------------------------------------------------------------------------|
| node-version    | string | No       | 22                             | Node.js version to use for setup and publishing |
| registry-url    | string | No       | https://registry.npmjs.org/    | NPM registry URL where the package will be published |
| package-manager | string | Yes      | —                              | Package manager to use (pnpm, yarn, or npm) for installing and build |

### 🔐 Workflow Secrets

| Name      | Required | Default | Description                                                |
|-----------|----------|---------|------------------------------------------------------------|
| NPM_TOKEN | Yes      | —       | NPM authentication token used to publish the package           |


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
