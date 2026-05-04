# npm-publish Action

A GitHub Action to publish your package to the NPM registry with support for npm, yarn, and pnpm package managers.

---

## Features

- Supports multiple package managers: `npm`, `yarn`, and `pnpm`
- Configurable Node.js version
- Custom NPM registry support
- Custom working directory
- Publishes with public access
- Uses NPM Trusted Publishing (no token required)
- Outputs package information after publish

---

## Usage

### Basic Usage

```yaml
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - name: Publish to NPM
        uses: tspyder7/github-actions-lib/actions/npm-publish@main
        with:
          package-manager: npm
```

### With Custom Configuration

```yaml
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - name: Publish with pnpm
        uses: tspyder7/github-actions-lib/actions/npm-publish@main
        with:
          node-version: "20"
          registry-url: "https://registry.npmjs.org/"
          package-manager: pnpm
          publish-tag: next
```

### Using Outputs

```yaml
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - name: Publish to NPM
        id: publish
        uses: tspyder7/github-actions-lib/actions/npm-publish@main
        with:
          package-manager: npm

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
      - uses: actions/checkout@v5

      - name: Publish from subdirectory
        uses: tspyder7/github-actions-lib/actions/npm-publish@main
        with:
          package-manager: npm
          work-dir: packages/my-package
```

---

## Inputs

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `node-version` | string | No | `24` | Node.js version to use for setup and publishing |
| `registry-url` | string | No | `https://registry.npmjs.org/` | The npm registry URL where the package will be published |
| `package-manager` | string | Yes | — | Package manager to use (`pnpm`, `yarn`, or `npm`) |
| `publish-tag` | string | No | `latest` | Tag the npm package |
| `publish-access` | string | No | `public` | Access level for the published package (`public` or `restricted`) |
| `work-dir` | string | No | `.` | Directory where commands should run |

---

## Outputs

| Name | Type | Description |
|------|------|-------------|
| `package-name` | string | Name of the published package |
| `package-version` | string | Version of the published package |
| `published-url` | string | URL to the package on npmjs.com |

---

## Trusted Publishing

This action uses [NPM Trusted Publishing](https://docs.npmjs.com/trusted-publishers) for authentication, eliminating the need for API tokens.

### Setup

1. Go to your package settings on npmjs.com
2. Navigate to **Publishing > Trusted Publishing**
3. Add a new publisher:
   - **Name**: GitHub Actions
   - **Repository**: Select your GitHub repository
   - **Workflow**: Your publish workflow
   - **Environment** (optional): Create a GitHub environment (e.g., `npm-publish`) and add it here
4. Configure your workflow to run on `ubuntu-latest`

---

## Examples

### CI/CD Pipeline

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
      - uses: actions/checkout@v5

      - name: Get version from tag
        id: version
        run: echo "VERSION=${GITHUB_REF#refs/tags/v}" >> $GITHUB_OUTPUT

      - name: Update version in package.json
        run: npm version ${{ steps.version.outputs.VERSION }} --no-git-tag-version

      - name: Publish to NPM
        uses: tspyder7/github-actions-lib/actions/npm-publish@main
        with:
          package-manager: npm
          publish-tag: latest
```

### Using with Yarn

```yaml
- name: Publish with Yarn
  uses: tspyder7/github-actions-lib/actions/npm-publish@main
  with:
    package-manager: yarn
```

### Using with pnpm

```yaml
- name: Publish with pnpm
  uses: tspyder7/github-actions-lib/actions/npm-publish@main
  with:
    package-manager: pnpm
    publish-tag: beta
```

---

## Requirements

- Node.js 18+ (default: 24)
- NPM Trusted Publishing configured on npmjs.com
- Package.json must exist in the specified working directory
- GitHub repository must be added to Trusted Publishing

---

## License

Apache License Version 2.0
