export function Snapshot() {
  const articles = [
    { title: 'FDA Approves New Drug for Rare Disease Treatment', date: 'March 2, 2026', snippet: 'The FDA approved a new therapy for a rare genetic disorder, offering hope for patients with limited options.', link: 'https://fda.gov' },
    { title: 'Pharma Giant Faces Lawsuit Over Opioid Marketing', date: 'March 1, 2026', snippet: 'A major pharmaceutical company is sued for misleading marketing practices related to opioid painkillers.', link: 'https://nytimes.com' },
    { title: 'Breakthrough in Alzheimer\'s Drug Trials', date: 'March 3, 2026', snippet: 'New trial results show promise for a drug that slows cognitive decline in early Alzheimer\'s.', link: 'https://nature.com' },
    { title: 'Global Shortage of Antibiotics Raises Concerns', date: 'March 2, 2026', snippet: 'WHO warns of antibiotic shortages due to supply chain issues.', link: 'https://who.int' },
    { title: 'mRNA Vaccine for Cancer Shows Positive Results', date: 'March 1, 2026', snippet: 'An mRNA-based cancer vaccine in trials reduced tumor growth in 40% of patients.', link: 'https://sciencemag.org' },
  ];

  return (
    <section className="my-8">
      <h2>Latest Pharma News (Updated on 2026-03-03 by Rituxan)</h2>
      <ul className="list-disc pl-5">
        {articles.map((article, index) => (
          <li key={index}>
            <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {article.title}
            </a> ({article.date}) - {article.snippet}
          </li>
        ))}
      </ul>
    </section>
  );
}
