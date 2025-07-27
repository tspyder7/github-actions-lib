# 🚦 [Enforce PR Branch Hierarchy Workflow](../workflows/enforce-pr-hierarchy.yml)

This reusable GitHub Actions workflow enforces branch hierarchy rules for pull requests. If a PR is opened from a disallowed source branch into a protected base branch, the workflow will automatically comment on and close the PR.

---

## ✅ Features

- Enforces branch merge rules using a JSON-defined hierarchy
- Automatically validates input JSON and PR structure
- Automatically closes non-compliant PRs with a comment explaining the reason

---

## 📦 Usage

To use this workflow, call it from a repository-specific workflow that is triggered on `pull_request`.

### Example Caller Workflow

```yaml
name: Enforce PR Rules

on:
  pull_request:
    types:
      - opened
      - reopened
      - synchronize
      - edited

jobs:
  enforce-pr-hierarchy:
    permissions:
      contents: write
      pull-requests: write
    uses: tspyder7/github-actions-lib/.github/workflows/enforce-pr-hierarchy.yml@main
    with:
      allowed-branches-hierarchy-json: |
        {
            "release": [
                "stage"
            ],
            "stage": [
                "main"
            ],
            "main": [
                "development"
            ]
        }
    secrets:
      GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

