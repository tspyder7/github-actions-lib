# Release Pipeline Reusable Workflow

Reusable GitHub Actions workflow for automating release creation (via [Release Please](https://github.com/googleapis/release-please)) and package publishing. Supports trigger via push events with manual `workflow_dispatch`.

## Features

- **Release Please integration**: Generates release PRs, changelogs, and versions using per-type Release Please configs
- **Dynamic publish support**: Accepts arbitrary publish actions via JSON config, enabling NPM/Docker/custom publishing
- **Job result aggregation**: Final summary job collates outcomes of all pipeline steps with clear status reporting
- **Minimal permissions**: Release generator job uses scoped `contents: write`, `pull-requests: write`, `actions: write` permissions

## Prerequisites

1. **Release Please configs**: For each supported release type (`rc`, `alpha`, `beta`, `latest`), create the following files in your repository:

   ```text
   .release/<type>/release-please-config.json
   .release/<type>/release-please-manifest.json
   ```

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

The workflow uses the automatic `GITHUB_TOKEN` for Release Please operations, with permissions scoped via the `release-generator` job. Any secrets required by the publish action (e.g., `NPM_TOKEN`) must be included in the `with` map of the `publish` input JSON.

## Pipeline Logic

The `setup-pipeline` job evaluates the trigger event to determine which jobs to run:

| Trigger Event | Condition | `generate_release` | `publish_package` |
|---------------|-----------|--------------------|--------------------|
| `push` | Single commit matches `release(<type>): <message>` pattern | `true` | `true` |
| `push` | No matching commit / multiple commits | `false` | `false` |
| `workflow_dispatch` | Manual trigger | `true` | `false` |
| Other events | Any other event | `false` | `false` |

## Example Caller Workflows

### 1. Automated Release on Push

Triggers on pushes to `main` with valid release commits, runs release generation and publishing:

```yaml
name: Automated Release

on:
  push:
    branches:
      - main

jobs:
  release:
    uses: tspyder7/github-actions-lib/.github/workflows/release-pipeline.yml@main
    with:
      publish: |
        {
          "uses": "tspyder7/github-actions-lib/actions/npm-publish@main",
          "with": {
            "registry": "https://registry.npmjs.org",
            "token": "${{ secrets.NPM_TOKEN }}"
          }
        }
```

### 2. Manual Release Dispatch

Triggers manual release generation (publishing is disabled for manual dispatch by default):

```yaml
name: Manual Release

on:
  workflow_dispatch:
    inputs:
      environment:
        description: "Target environment"
        type: string
        required: true
      release-type:
        description: "Release type (rc, alpha, beta, latest)"
        type: string
        default: latest

jobs:
  release:
    uses: tspyder7/github-actions-lib/.github/workflows/release-pipeline.yml@main
    with:
      environment: ${{ inputs.environment }}
      release-type: ${{ inputs.release-type }}
      publish: |
        {
          "uses": "tspyder7/github-actions-lib/actions/npm-publish@main",
          "with": {
            "registry": "https://registry.npmjs.org",
            "token": "${{ secrets.NPM_TOKEN }}"
          }
        }
```

> **Note**: The `publish` input is mandatory even when publishing is disabled, as it is a required workflow input.

## Job Overview

| Job Name | Description | Runs When |
|----------|-------------|-----------|
| `setup-pipeline` | Evaluates trigger event and outputs job execution flags | Always first |
| `release-generator` | Runs Release Please to create/update release PRs | `generate_release == 'true'` |
| `publish` | Executes the publish action from the `publish` input | `publish_package == 'true'` |
| `summary` | Writes final pipeline results to workflow summary | Always (runs last) |
