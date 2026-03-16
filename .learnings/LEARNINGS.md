# Learnings

## [LRN-20260313-001] best_practice

**Logged**: 2026-03-13T00:00:00-04:00
**Priority**: medium
**Status**: pending
**Area**: backend

### Summary
Bot surfaces should share the same deterministic medication and interaction data instead of mixing local data with separate AI-only logic.

### Details
The interaction checker was already backed by an offline DDInter dataset in the repo, but the `/api/interactions` route still called the model directly. That created a trust gap, inconsistent source labeling, and harder-to-predict answers across the bots. Consolidating shared clinical reference data behind reusable helpers makes the chat and interaction tools safer and easier to evolve.

### Suggested Action
Keep medication grounding, interaction lookup, and source metadata in shared library modules and reuse them across all bot routes.

### Metadata
- Source: simplify-and-harden
- Related Files: src/lib/ddinter.ts,src/app/api/interactions/route.ts,src/app/api/chat/route.ts
- Tags: bots, grounding, data-consistency
- Pattern-Key: harden.shared_clinical_grounding

---
