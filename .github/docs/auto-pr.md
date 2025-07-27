# 🔁 [Auto PR from PR Branch Hierarchy Workflow](../workflows/auto-pr.yml)

This reusable GitHub Actions workflow automatically creates or updates pull requests based on a predefined branch hierarchy. It groups release notes by commit type and appends them to the PR body.

---

## 🚀 Features

- Automatically determines base branch using a JSON-defined hierarchy
- Validates branch relationships and PR structure
- Checks for existing PRs before creating new ones
- Groups commit messages into:
  - ✨ Features
  - 🐛 Fixes
  - 🚑 Hotfix
  - 🔧 Chores / Refactors
  - 📦 Others
- Appends release notes to existing open PRs

## ✔️ Requirements:
- Need to create Github **_Personal Access Token_** with fine grade access
    - `Contents` -> `Read & Write`
    - `Pull Requests` -> `Read & Write`
- Create a secret `GH_REPO_TOKEN` in repository and store above token in it.

## 📦 Usage

To use this workflow, call it from another workflow using `workflow_call`.

### Example Caller Workflow

```yaml
name: Generate Auto PR

on:
  push:
    branches:
      - development
      - stage
      - main

jobs:
  call-auto-pr:
    permissions:
      contents: write
      pull-requests: write

    uses: tspyder7/github-actions-lib/.github/workflows/auto-pr.yml@main
    with:
      pr-branch-hierarchy-json: |
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
      GH_TOKEN: ${{ secrets.GH_REPO_TOKEN  }}
```
