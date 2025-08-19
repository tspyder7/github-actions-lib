# 🚦 [Enforce PR Branch Hierarchy Workflow](../workflows/enforce-pr-hierarchy.yml)

This reusable GitHub Actions workflow enforces branch hierarchy rules for pull requests. If a PR is opened from a disallowed source branch into a protected base branch, the workflow will automatically comment on and close the PR.

---

## ✅ Features

- Enforces branch merge rules using a JSON-defined hierarchy
- Automatically validates input JSON and PR structure
- Can close non-compliant PRs with a comment explaining the reason if configured

---

## 📦 Usage

- To use this workflow, call it from a repository-specific workflow that is triggered on `pull_request`.

- To configure close comment template pass `comment-template`

> ⏳ **Workflow Timeout:** Each job in this workflow is configured with a maximum runtime of **10 minutes**.
> If a job exceeds this limit, GitHub Actions will automatically cancel it.

### 📄 Default Template
```
🚫 **PR Automatically Closed - Branch Hierarchy Violation**

**Issue**: This pull request violates the configured branch hierarchy rules.

{__DETAILS__}

**Next Steps**:
1. Create your PR from one of the allowed source branches
2. Or request an update to the branch hierarchy configuration if this is intentional

*This action was performed automatically by the branch hierarchy enforcement workflow.*

```

> NOTE: `{__DETAILS__}` is used to by workflow to inject relevant details like base branch, target branch and allowed branches. Pass it if you want to show these details

### 🧾 Workflow Inputs

| Name                          | Type     | Required | Default   | Description                                                                 |
|-------------------------------|----------|----------|-----------|-----------------------------------------------------------------------------|
| allowed-branches-hierarchy-json | string | Yes   | —         | JSON object defining allowed source branches for each target branch        |
| auto-close-invalid-prs      | boolean| No    | true    | Whether to automatically close invalid PRs                                 |
| comment-template            | string | No    | [Default Template](#-default-template)       | Custom comment template for invalid PRs                                    |
| timeout_minutes | number | No   | 10         | Custom Timeout in Minutes        |

### 🔐 Workflow Secrets

| Name                        | Required | Default   | Description                                                                 |
|-----------------------------|----------|-----------|-----------------------------------------------------------------------------|
| GH_TOKEN                    | Yes   | —         | GitHub token with `contents:write` and `pull-requests:write` permissions   |

### Example Caller Workflow

```yaml
# .github/workflows/pr-branch-check.yml
name: PR Branch Hierarchy Check

on:
  pull_request:
    types: [opened, reopened, synchronize]

jobs:
  enforce-branch-hierarchy:
    uses: tspyder7/github-actions-lib/.github/workflows/enforce-pr-hierarchy.yml@main
    secrets:
      GH_TOKEN: ${{ secrets.GH_TOKEN }}
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
      auto-close-invalid-prs: true # Optional, Default - true
      comment-template: |   # Optional
        🚫 **PR Automatically Closed - Branch Hierarchy Violation**

        **Issue**: This pull request violates the configured branch hierarchy rules.

        {__DETAILS__}

        **Next Steps**:
        1. Create your PR from one of the allowed source branches
        2. Or request an update to the branch hierarchy configuration if this is intentional

        *This action was performed automatically by the branch hierarchy enforcement workflow.*
      timeout_minutes: 5 # Optional, Default - 10
```
