# action-generator Action

A GitHub Action to generate composite actions.

---

## Features

- Dynamic action generation
- Customizable action invocation
- Configurable inputs passed to generated actions
- Built-in logging for execution tracking

---

## Usage

### Basic Usage

```yaml
jobs:
  generate-action:
    runs-on: ubuntu-latest
    steps:
      - name: Generate publish action
        uses: tspyder7/github-actions-lib/actions/action-generator@main
        with:
          action-type: publish
          uses: tspyder7/github-actions-lib/actions/sleep-for-while@main
```

### With Custom Configuration

```yaml
jobs:
  generate-action:
    runs-on: ubuntu-latest
    steps:
      - name: Generate publish action with inputs
        uses: tspyder7/github-actions-lib/actions/action-generator@main
        with:
          action-type: publish
          uses: actions/npm-publish
          with: '{"registry":"https://npm.pkg.github.com","token":"${{ secrets.NPM_TOKEN }}"}'
```

---

## Inputs

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `action-type` | string | Yes | - | Type of action to generate |
| `uses` | string | Yes | - | Custom action to call in the generated action |
| `with` | string | No | - | JSON string of inputs to pass to the custom action |

### action-type:
| Name | Description |
|------|------|
| `publish` | Will generate action at runtime: `./.github/actions/publish/` |

---

## Outputs

This action does not produce outputs.

---

## Examples

### CI-CD Pipeline

```yaml
name: Generate and Use Action

on:
  workflow_dispatch:

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Generate publish action
        uses: tspyder7/github-actions-lib/actions/action-generator@main
        with:
          action-type: publish
          uses: <action>
          with: <input_in_json_format>
```

---

## Requirements

- Node.js 24 runner
- GitHub Actions runner
- Valid action type
- Valid custom action reference

---

## License

Apache License Version 2.0
