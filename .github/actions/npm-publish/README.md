# npm-publish Action

A GitHub Action to publish your package to the NPM registry with support for npm, yarn, and pnpm package managers.

> **Note:** Not published to GitHub Marketplace. Use `workflow_call` for workflows and `uses:` with repo path for actions.

---

## Features

- Supports multiple package managers: `npm`, `yarn`, and `pnpm`
- Configurable Node.js version
- Custom NPM registry support
- Custom working directory
- Publishes with public access
- Outputs package information after publish

---

## Usage

### Basic Usage

```yaml
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Publish to NPM
        uses: tspyder7/github-actions-lib/.github/actions/npm-publish@main
        with:
          package-manager: npm
          registry-token: ${{ secrets.NPM_TOKEN }}
```

### With Custom Configuration

```yaml
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Publish with pnpm
        uses: tspyder7/github-actions-lib/.github/actions/npm-publish@main
        with:
          node-version: "20"
          registry-url: "https://registry.npmjs.org/"
          package-manager: pnpm
          publish-tag: next
          registry-token: ${{ secrets.NPM_TOKEN }}
```

### Using Outputs

```yaml
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Publish to NPM
        id: publish
        uses: tspyder7/github-actions-lib/.github/actions/npm-publish@main
        with:
          package-manager: npm
          registry-token: ${{ secrets.NPM_TOKEN }}

      - name: Show publish info
        run: |
          echo "Published ${{ steps.publish.outputs.package-name }}@${{ steps.publish.outputs.package-version }}"
          echo "URL: ${{ steps.publish.outputs.published-url }}"
```

### Using with Custom Work Directory

```yaml
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Publish from subdirectory
        uses: tspyder7/github-actions-lib/.github/actions/npm-publish@main
        with:
          package-manager: npm
          work-dir: packages/my-package
          registry-token: ${{ secrets.NPM_TOKEN }}
```

---

## Inputs

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `node-version` | string | No | `22` | Node.js version to use for setup and publishing |
| `registry-url` | string | No | `https://registry.npmjs.org/` | The npm registry URL where the package will be published |
| `package-manager` | string | Yes | — | Package manager to use (`pnpm`, `yarn`, or `npm`) |
| `publish-tag` | string | No | `latest` | Tag the npm package |
| `work-dir` | string | No | `.` | Directory where commands should run |
| `registry-token` | string | Yes | — | NPM authentication token used to publish the package |

---

## Outputs

| Name | Type | Description |
|------|------|-------------|
| `package-name` | string | Name of the published package |
| `package-version` | string | Version of the published package |
| `published-url` | string | URL to the package on npmjs.com |

---

## Examples

### Complete CI/CD Pipeline

```yaml
name: Publish Package

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Get version from tag
        id: version
        run: echo "VERSION=${GITHUB_REF#refs/tags/v}" >> $GITHUB_OUTPUT

      - name: Update version in package.json
        run: npm version ${{ steps.version.outputs.VERSION }} --no-git-tag-version

      - name: Publish to NPM
        uses: tspyder7/github-actions-lib/.github/actions/npm-publish@main
        with:
          package-manager: npm
          registry-token: ${{ secrets.NPM_TOKEN }}
          publish-tag: latest
```

### Using with Yarn

```yaml
- name: Publish with Yarn
  uses: tspyder7/github-actions-lib/.github/actions/npm-publish@main
  with:
    package-manager: yarn
    registry-token: ${{ secrets.NPM_TOKEN }}
```

### Using with pnpm

```yaml
- name: Publish with pnpm
  uses: tspyder7/github-actions-lib/.github/actions/npm-publish@main
  with:
    package-manager: pnpm
    registry-token: ${{ secrets.NPM_TOKEN }}
    publish-tag: beta
```

---

## Requirements

- Node.js 18+ (default: 22)
- Valid NPM authentication token with publish permissions
- Package.json must exist in the specified working directory

---

## License

Apache License Version 2.0
