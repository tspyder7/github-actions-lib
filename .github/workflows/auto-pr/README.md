# 🔁 Auto PR from PR Branch Hierarchy Workflow

This reusable GitHub Actions workflow automatically creates or updates pull requests based on a predefined branch hierarchy. It groups release notes by commit type and appends them to the PR body.

---

## 🚀 Features

- Automatically determines base branch using a JSON-defined hierarchy
- Validates branch relationships and PR structure
- Checks for existing PRs before creating new ones
- Groups commit messages into:
  - ✨ Features
  - 🐛 Fixes
  - 🔧 Chores / Refactors
  - 📦 Others
- Appends release notes to existing open PRs

---

## 📦 Usage

To use this workflow, call it from another workflow using `workflow_call`.

### Example Caller Workflow

```yaml
name: Create Auto PR

on:
  push:
    branches:
      - dev
      - feature/*

jobs:
  call-auto-pr:
    uses: your-org/your-repo/.github/workflows/auto-pr.yml@main
    with:
      pr-branch-hierarchy-json: |
        {
          "main": ["dev"],
          "dev": ["feature/login", "feature/signup"]
        }
    secrets:
      GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
