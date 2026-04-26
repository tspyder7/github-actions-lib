# Release Pipeline Reusable Workflow

Reusable GitHub Actions workflow for automating release creation (via [Release Please](https://github.com/googleapis/release-please)) and package publishing. Supports trigger via push events with manual `workflow_dispatch`.

## Features

- **Release Please integration**: Generates release PRs, changelogs, and versions using per-type Release Please configs
- **Dynamic publish support**: Accepts arbitrary publish actions via JSON config, enabling NPM/Docker/custom publishing
- **Job result aggregation**: Final summary job collates outcomes of all pipeline steps with clear status reporting
- **Scoped permissions**: Uses provided `GH_TOKEN` with explicit `contents:write`, `pull-requests:write` & `actions:write` permissions

## Prerequisites

1. **Release Please configs**: For each supported release type (`rc`, `alpha`, `beta`, `latest`), create the following files in your repository:

   ```text
   .release/<type>/config.json
   .release/<type>/manifest.json
   ```

   | Release Type | Folder |
   |--------------|--------|
   | `rc`         | `.release/rc/` |
   | `alpha`      | `.release/alpha/` |
   | `beta`       | `.release/beta/` |
   | `latest`     | `.release/prod/` |

   Follow the [Release Please configuration guide](https://github.com/googleapis/release-please#configuration) for content specifics.

2. **Publish action**: The `publish` input requires a valid GitHub Action reference (e.g., `tspyder7/github-actions-lib/actions/npm-publish@main`). Ensure the action is accessible to the workflow.

## Usage

This is a reusable workflow, called via `workflow_call` from a parent workflow. It requires no manual trigger configuration beyond the input parameters.

### Inputs

All inputs are passed via the `with` block of the `uses` call in the parent workflow:

| Input Name | Type | Required | Default | Description |
|------------|------|----------|---------|-------------|
| `environment` | `string` | No | (none) | Target GitHub environment (e.g., `dev`, `staging`, `production`). Used only for approvals. |
| `release-type` | `string` | No | `latest` | Release type for manual dispatch. Accepts `rc`, `alpha`, `beta`, `latest`. Ignored for push triggers. |
| `publish` | `string` | Yes | (none) | Publish action configuration in JSON format. Must include a `uses` key (action reference) and optional `with` map (action inputs). |
| `timeout_minutes` | `number` | No | `10` | Timeout in minutes for each job in the pipeline. |

### Secrets

| Secret Name | Required | Description |
|-------------|----------|-------------|
| `GH_TOKEN` | Yes | GitHub token with `contents:write`, `pull-requests:write` & `actions:write` permissions |

Any additional secrets required by the publish action (e.g., `NPM_TOKEN`) must be included in the `with` map of the `publish` input JSON.

## Pipeline Logic

The `setup-pipeline` job evaluates the trigger event to determine which jobs to run:

| Trigger Event | Condition | `generate_release` | `publish_package` |
|---------------|-----------|--------------------|--------------------|
| `push` | Single commit matches `release(<type>): <message>` pattern | `true` | `true` |
| `push` | No matching commit / multiple commits | `false` | `false` |
| `workflow_dispatch` | Manual trigger | `true` | `false` |
| Other events | Any other event | `false` | `false` |

## Example Caller Workflows

### 1. Release Pipeline with sleep-for-whlie

Triggers on pushes to `main` with valid release commits, and supports manual `workflow_dispatch` for testing releases:

```yaml
name: Release Pipeline

on:
  workflow_dispatch:
    inputs:
      release-type:
        description: "Release type (rc, alpha, beta, latest)"
        type: choice
        options:
          - rc
          - latest
        default: latest
  push:
    branches:
      - main

jobs:
  release:
    permissions:
      contents: write
      pull-requests: write
      actions: write
    uses: tspyder7/github-actions-lib/.github/workflows/release-pipeline.yml@main
    with:
      environment: production
      release-type: ${{ inputs.release-type }}
      publish: |
        {
          "uses": "tspyder7/github-actions-lib/actions/sleep-for-while@main",
          "with": {
            "sleep_time": "10",
            "message": "Slept for 10 seconds. Release is complete"
          }
        }
    secrets:
      GH_TOKEN: ${{ secrets.GH_REPO_TOKEN }}
```

### 2. Release Pipeline for NPM Package

```yaml
name: Release Pipeline

on:
  workflow_dispatch:
    inputs:
      release-type:
        description: "Release type (rc, alpha, beta, latest)"
        type: choice
        options:
          - rc
          - latest
        default: latest
  push:
    branches:
      - main

jobs:
  release:
    permissions:
      contents: write
      pull-requests: write
      actions: write
    uses: tspyder7/github-actions-lib/.github/workflows/release-pipeline.yml@main
    with:
      environment: production
      release-type: ${{ inputs.release-type }}
      publish: |
        {
          "uses": "tspyder7/github-actions-lib/actions/npm-publish@main",
          "with": {
            "registry": "https://registry.npmjs.org",
            "token": "${{ secrets.NPM_TOKEN }}"
          }
        }
    secrets:
      GH_TOKEN: ${{ secrets.GH_REPO_TOKEN }}
```

## Job Overview

| Job Name | Description | Runs When |
|----------|-------------|-----------|
| `setup-pipeline` | Evaluates trigger event and outputs job execution flags | Always first |
| `release-generator` | Runs Release Please to create/update release PRs | `generate_release == 'true'` |
| `publish` | Executes the publish action from the `publish` input | `publish_package == 'true'` |
| `summary` | Writes final pipeline results to workflow summary | Always (runs last) |
