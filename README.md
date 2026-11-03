# Playwright + Jev Decision Map Demo

Production-oriented demonstration of the decision-map architecture:

- **Playwright** owns deterministic browser actions and hard assertions.
- **TypeSafe Jev (System One)** answers narrow, typed semantic questions (noul / choice / score) against compact accessibility snapshots.

No generative LLM is used inside the regression path. Output tokens are free; typical latency is 70–500 ms.

## Quick Start

```bash
npm install
npx playwright install chromium
export TYPESAFE_API_KEY=sk-...   # optional — falls back to deterministic mock
npx playwright test
```

See the accompanying deep-dive guide for architecture, trade-offs, thresholds, and production hardening steps.
