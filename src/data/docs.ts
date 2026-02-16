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
];

export function getPlaybookBySlug(slug: string) {
  return playbookDocs.find((doc) => doc.slug === slug);
}
