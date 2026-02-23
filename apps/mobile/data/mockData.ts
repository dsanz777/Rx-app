export const snapshot = {
  patient: 'Acute CHF Panel',
  updatedAt: 'Feb 16, 2026 09:10 ET',
  primaryConcern: 'Monitor IV diuresis response + renal labs',
  vitals: {
    weightDelta: '-1.8 kg / 24h',
    systolic: '108/64 mmHg',
    creatinine: '1.3 mg/dL'
  },
  notes: [
    'Escalated to pharmacist for loop optimization',
    'Pending social-work check on home scale delivery'
  ]
};

export const featureTiles = [
  {
    title: 'Medication Lookup',
    subtitle: 'Check dosing, renal caps, interactions',
    href: '/playbook'
  },
  {
    title: 'Interaction Flags',
    subtitle: 'Auto flag QTc, duplicate loops, etc.',
    href: '/playbook'
  },
  {
    title: 'Playbooks',
    subtitle: 'Heart failure, COPD, diabetes bundles',
    href: '/playbook'
  },
  {
    title: 'Consult',
    subtitle: 'Send a curbside consult in 3 taps',
    href: '/playbook'
  }
];

export const documents = [
  {
    id: 'doc-1',
    title: 'IV Diuresis Titration Ladder',
    category: 'Playbook',
    updated: '2 hrs ago'
  },
  {
    id: 'doc-2',
    title: 'Jardiance + Insulin quick ref',
    category: 'Lookup',
    updated: 'Yesterday'
  },
  {
    id: 'doc-3',
    title: 'Polymyositis steroid taper',
    category: 'Consult note',
    updated: '3 days ago'
  }
];

export const playbooks = [
  {
    id: 'pb-1',
    title: 'Acute decompensated HF – 24h workflow',
    summary: 'Snapshot card + nurse tasks + pharmacist checklist.',
    tags: ['HF', 'RN', 'PharmD'],
    updated: 'Feb 15'
  },
  {
    id: 'pb-2',
    title: 'CKD + Diabetes medication guardrails',
    summary: 'Dose adjustments by eGFR, SGLT2 + GLP-1 combos.',
    tags: ['Diabetes', 'CKD'],
    updated: 'Feb 10'
  },
  {
    id: 'pb-3',
    title: 'BPH urinary retention triage',
    summary: 'When to send to ED vs outpatient straight cath.',
    tags: ['Urology', 'Escalation'],
    updated: 'Jan 31'
  }
];
