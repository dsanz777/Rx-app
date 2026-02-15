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
    title: "ACO REACH survival kit",
    status: "Outline complete · waiting on payer quotes",
    slug: "aco-reach-survival-kit",
    file: "aco-reach-survival-kit.md",
  },
  {
    title: "Hospital at Home FAQ",
    status: "Research phase",
    slug: "hospital-at-home-faq",
    file: "hospital-at-home-faq.md",
  },
];

export function getPlaybookBySlug(slug: string) {
  return playbookDocs.find((doc) => doc.slug === slug);
}
