# Build notes

## 2026-02-14
### ✅ Medication lookup upgrade
- Added curated dataset for GLP-1s, SGLT2s, anticoag, HF, asthma, and ID use cases with dosing, renal, monitoring, and pearls.
- Built an interactive lookup surface with search + tag filters so Derek can jump between classes without leaving the hero page.
- Shortlist panel keeps all visible hits clickable while the main panel exposes the full dosing/monitoring cards.

### ✅ Brave-powered hero snapshot
- Wired the hero "Snapshot" card to Brave Search (news endpoint) with category-specific queries + 30-min caching.
- Added graceful fallback headlines + README instructions for setting `BRAVE_API_KEY` so Derek can keep shipping even if the key isn’t present locally.
- Snapshot now prints timestamps + source lines so intel looks like a living feed instead of lorem ipsum.
