export type PlaybookDoc = {
  title: string;
  status: string;
  slug: string;
  file: string;
};

export const playbookDocs: PlaybookDoc[] = [
  {
    title: "GLP-1 playbook",
    status: "Draft · needs Derek review",
    slug: "glp-1-playbook",
    file: "glp-1-playbook.md",
  },
  {
    title: "MSSP survival kit",
    status: "Outline complete · waiting on payer quotes",
    slug: "mssp-survival-kit",
    file: "mssp-survival-kit.md",
  },
  {
    title: "CKD/ESRD playbook",
    status: "Research phase",
    slug: "ckd-esrd-playbook",
    file: "ckd-esrd-playbook.md",
  },
  {
    title: "Type 2 diabetes guide",
    status: "Clinical guide · patient + provider",
    slug: "type-2-diabetes-guide",
    file: "type-2-diabetes-guide.md",
  },
  {
    title: "Hypertension guide",
    status: "Clinical guide · patient + provider",
    slug: "hypertension-guide",
    file: "hypertension-guide.md",
  },
  {
    title: "Hyperlipidemia guide",
    status: "Clinical guide · patient + provider",
    slug: "hyperlipidemia-guide",
    file: "hyperlipidemia-guide.md",
  },
  {
    title: "COPD guide",
    status: "Clinical guide · patient + provider",
    slug: "copd-guide",
    file: "copd-guide.md",
  },
  {
    title: "Asthma guide",
    status: "Clinical guide · patient + provider",
    slug: "asthma-guide",
    file: "asthma-guide.md",
  },
  {
    title: "Acute bacterial sinusitis guide",
    status: "Clinical guide · patient + provider",
    slug: "acute-bacterial-sinusitis-guide",
    file: "acute-bacterial-sinusitis-guide.md",
  },
  {
    title: "Heart failure guide",
    status: "Clinical guide · patient + provider",
    slug: "heart-failure-guide",
    file: "heart-failure-guide.md",
  },
  {
    title: "Coronary artery disease guide",
    status: "Clinical guide · patient + provider",
    slug: "coronary-artery-disease-guide",
    file: "coronary-artery-disease-guide.md",
  },
  {
    title: "Atrial fibrillation guide",
    status: "Clinical guide · patient + provider",
    slug: "atrial-fibrillation-guide",
    file: "atrial-fibrillation-guide.md",
  },
  {
    title: "Chronic kidney disease guide",
    status: "Clinical guide · patient + provider",
    slug: "chronic-kidney-disease-guide",
    file: "chronic-kidney-disease-guide.md",
  },
  {
    title: "GERD guide",
    status: "Clinical guide · patient + provider",
    slug: "gerd-guide",
    file: "gerd-guide.md",
  },
  {
    title: "Major depressive disorder guide",
    status: "Clinical guide · patient + provider",
    slug: "depression-guide",
    file: "depression-guide.md",
  },
  {
    title: "Generalized anxiety guide",
    status: "Clinical guide · patient + provider",
    slug: "generalized-anxiety-guide",
    file: "generalized-anxiety-guide.md",
  },
  {
    title: "Hypothyroidism guide",
    status: "Clinical guide · patient + provider",
    slug: "hypothyroidism-guide",
    file: "hypothyroidism-guide.md",
  },
  {
    title: "Osteoarthritis guide",
    status: "Clinical guide · patient + provider",
    slug: "osteoarthritis-guide",
    file: "osteoarthritis-guide.md",
  },
  {
    title: "Low back pain guide",
    status: "Clinical guide · patient + provider",
    slug: "low-back-pain-guide",
    file: "low-back-pain-guide.md",
  },
  {
    title: "Obesity guide",
    status: "Clinical guide · patient + provider",
    slug: "obesity-guide",
    file: "obesity-guide.md",
  },
  {
    title: "Migraine guide",
    status: "Clinical guide · patient + provider",
    slug: "migraine-guide",
    file: "migraine-guide.md",
  },
  {
    title: "UTI guide",
    status: "Clinical guide · patient + provider",
    slug: "uti-guide",
    file: "uti-guide.md",
  },
  {
    title: "Insomnia guide",
    status: "Clinical guide · patient + provider",
    slug: "insomnia-guide",
    file: "insomnia-guide.md",
  },
];

export function getPlaybookBySlug(slug: string) {
  return playbookDocs.find((doc) => doc.slug === slug);
}
