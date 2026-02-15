# ACO REACH Survival Kit

**Status:** Outline complete · Waiting on payer quotes  
**Audience:** Value-based ops leads, population health pharmacists, care coordinators

---

## 1. Core Pillars
1. **Risk Coding & Roster Hygiene**
   - Monthly chart sweeps for HCC refresh; flag >12 months without visit.
   - Automate AWV + chronic care management invites.
2. **High-Risk Medication Playbook**
   - Deprescribing protocols for benzos, anticholinergics, duplicative anticoagulation.
   - GLP-1/SGLT2 automatic eligibility prompts (tie-in with Rx Brief modules).
3. **Triage & Escalation**
   - 24-hour nurse line decision tree (ED avoidance vs. urgent care vs. home visit).
   - Partner ride-share/home health dispatch list with SLA.

## 2. Required Infrastructure
| Component | Owner | Notes |
| --- | --- | --- |
| Central registry dashboard | Analytics | Needs real-time ADT feeds |
| Pharmacy consult line | Clinical pharmacy | Publish SLA (≤2 business days) |
| Transitional care workflow | Nursing + pharmacy | Script + med-rec form |

## 3. Pharmacy-Led Interventions
- **48hr post-discharge call** (medication reconciliation, SDOH screening, follow-up scheduling).
- **Polypharmacy review** for ≥12 meds or ≥5 high-risk classes.
- **Infusion & specialty oversight** (PA renewals, site-of-care shifts, biosimilar conversions).

## 4. Financial Guardrails
- Keep utilization within benchmarks: SNF length of stay ≤21 days average, ED per 1k <160.
- Track pharmacy cost PMPM vs. RAF; flag outliers >+$100 PMPM trend.
- Model impact of GLP-1 and SGLT2 uptake on total cost of care (present to finance monthly).

## 5. Communication Assets
- **Provider one-pager:** How to refer to Derek’s consult line, turnaround time, sample consult note.
- **Patient FAQ:** What ACO REACH means, how to access 24/7 support, medication refills.
- **Escalation ladder:** Color-coded cheat sheet for care coordinators.

## 6. Metrics Dashboard (Starter Set)
| KPI | Target | Data Source |
| --- | --- | --- |
| 7-day post-discharge contact | ≥85% | Care management platform |
| Medication reconciliation completed | ≥90% | Clinical pharmacist log |
| Avoidable ED visits per 1k | <150 | Claims/ADT |
| GLP-1 utilization in eligible cohort | >40% | EHR + Rx claims |

## 7. Action Items
1. Secure payer quotes for remote patient monitoring subsidy (in-flight).
2. Finalize pharmacist consult documentation template in EHR.
3. Train care coordinators on new escalation script (target date: Feb 28).

---
**Owner:** Derek Sanz · Last updated 2026-02-14
