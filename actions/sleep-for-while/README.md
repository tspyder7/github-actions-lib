# sleep-for-while Action

A GitHub Action to pause execution for a given number of seconds and optionally print a message.

---

## Features

- Configurable sleep duration
- Optional message printing after sleep
- Clear logging for start and completion
- Simple, reusable composite action

---

## Usage

### Basic Usage

```yaml
jobs:
  sleep-for-while:
    runs-on: ubuntu-latest
    steps:
      - name: Sleep for 5 seconds
        uses: tspyder7/github-actions-lib/actions/sleep-for-while@main
```

### With Custom Configuration

```yaml
jobs:
  sleep-for-while:
    runs-on: ubuntu-latest
    steps:
      - name: Sleep with message
        uses: tspyder7/github-actions-lib/actions/sleep-for-while@main
        with:
          sleep_time: 10
          message: "Done waiting!"
```

---

## Inputs

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `sleep_time` | string | No | `5` | Time to sleep in seconds |
| `message` | string | No | `I'm awake now` | Optional message to print after sleep |

---

## Outputs

This action does not produce outputs.

---

## Examples

### CI/CD Pipeline

```yaml
name: Sleep Demo

on:
  workflow_dispatch:

jobs:
  wait:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Sleep for 15 seconds
        uses: tspyder7/github-actions-lib/actions/sleep-for-while@main
        with:
          sleep_time: 15
          message: "Finished waiting for 15 seconds!"
```

---

## Requirements

- Runs on Linux-based runners (uses bash and sleep)
- GitHub Actions runner with shell support

---

## License

Apache License Version 2.0
