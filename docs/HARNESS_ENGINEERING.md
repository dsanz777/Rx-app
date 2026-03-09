# Harness Engineering for ClinPharmGPT

This project now follows a harness-first workflow:

1. Define the target behavior in concrete terms.
2. Add executable checks that detect drift.
3. Run checks on every meaningful change.
4. Fix root causes, not just one-off examples.

## Why this exists

Medication content quality regresses silently when datasets are re-ingested or normalized. A harness keeps quality constraints explicit and testable.

## Quality gates (current)

The script `scripts/harness-rx.ts` enforces:

- No placeholder class/mechanism/safety language.
- No FDA label section artifacts in rendered fields.
- No missing critical fields.
- No duplicate slugs or duplicate medication names.
- No overly generic class labels.

## Run it

```bash
npm run harness:rx
```

For release confidence:

```bash
npm run harness:all
```

## Failure policy

- If `harness:rx` fails, content changes are incomplete.
- Fix `src/data/medications.ts` normalization/fallback rules first.
- Only patch individual medications when the issue is truly one-off.

## Interaction output guardrails

`src/app/api/interactions/route.ts` now deduplicates pairwise interactions by drug pair key and keeps only one item per pair to avoid duplicate cards in UI.
