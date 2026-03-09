type GuidelineLinkRule = {
  pattern: RegExp;
  url: string;
};

const GUIDELINE_LINK_RULES: GuidelineLinkRule[] = [
  { pattern: /ADA.*Standards of Care|American Diabetes Association/i, url: "https://professional.diabetes.org/standards-of-care" },
  { pattern: /KDIGO/i, url: "https://kdigo.org/guidelines/" },
  { pattern: /ACC\/AHA\/ACCP\/HRS atrial fibrillation|atrial fibrillation guideline/i, url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001193" },
  { pattern: /ESC atrial fibrillation|ESC .*recommendations|ESC .*guidance/i, url: "https://www.escardio.org/Guidelines" },
  { pattern: /CHEST antithrombotic/i, url: "https://journal.chestnet.org/guidelines-and-consensus-statements" },
  { pattern: /ACC\/AHA hypertension|hypertension guidance/i, url: "https://professional.heart.org/en/guidelines-and-statements" },
  { pattern: /ISH\/ESC hypertension/i, url: "https://www.escardio.org/Guidelines" },
  { pattern: /ACC\/AHA cholesterol|AHA\/ACC primary prevention|AHA\/ACC lipid/i, url: "https://professional.heart.org/en/guidelines-and-statements" },
  { pattern: /ACC\/AHA chronic coronary disease/i, url: "https://professional.heart.org/en/guidelines-and-statements" },
  { pattern: /ACC\/AHA\/HFSA heart failure/i, url: "https://professional.heart.org/en/guidelines-and-statements" },
  { pattern: /ATS\/IDSA CAP/i, url: "https://www.idsociety.org/practice-guideline/community-acquired-pneumonia-cap-in-adults/" },
  { pattern: /IDSA .*rhinosinusitis|IDSA .*UTI|IDSA skin and soft tissue/i, url: "https://www.idsociety.org/practice-guideline/" },
  { pattern: /AAO-HNS adult sinusitis/i, url: "https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/adult-sinusitis/" },
  { pattern: /GINA/i, url: "https://ginasthma.org/" },
  { pattern: /GOLD strategy/i, url: "https://goldcopd.org/" },
  { pattern: /ATS\/ERS COPD/i, url: "https://www.thoracic.org/statements/" },
  { pattern: /CDC.*immunization|ACIP adult immunization/i, url: "https://www.cdc.gov/vaccines/hcp/imz-schedules/adult-schedule.html" },
  { pattern: /CDC outpatient antibiotic stewardship/i, url: "https://www.cdc.gov/antibiotic-use/hcp/core-elements/outpatient-antibiotic-stewardship.html" },
  { pattern: /AACE\/ACE obesity|AACE\/ACE endocrine|AACE/i, url: "https://pro.aace.com/clinical-guidance" },
  { pattern: /American Thyroid Association hypothyroidism/i, url: "https://www.thyroid.org/professionals/ata-professional-guidelines/" },
  { pattern: /Endocrine Society/i, url: "https://www.endocrine.org/clinical-practice-guidelines" },
  { pattern: /American Urological Association BPH/i, url: "https://www.auanet.org/guidelines-and-quality/guidelines" },
  { pattern: /American College of Rheumatology gout|American College of Rheumatology OA/i, url: "https://rheumatology.org/clinical-practice-guidelines" },
  { pattern: /ACP chronic insomnia|ACP low back pain/i, url: "https://www.acponline.org/clinical-information/guidelines" },
  { pattern: /American Academy of Sleep Medicine/i, url: "https://aasm.org/clinical-resources/practice-standards/practice-guidelines/" },
  { pattern: /VA\/DoD .*guideline|VA\/DoD mental health|VA\/DoD low back pain|VA\/DoD insomnia|VA\/DoD MDD/i, url: "https://www.healthquality.va.gov/guidelines/" },
  { pattern: /APA depression|APA and NICE anxiety/i, url: "https://www.psychiatry.org/psychiatrists/practice/clinical-practice-guidelines" },
  { pattern: /NICE depression|NICE low back pain|NICE anxiety/i, url: "https://www.nice.org.uk/guidance" },
  { pattern: /AHRQ evidence summaries/i, url: "https://effectivehealthcare.ahrq.gov/" },
  { pattern: /AAN\/AHS migraine|American Headache Society/i, url: "https://www.aan.com/guidelines" },
  { pattern: /ICHD diagnostic criteria/i, url: "https://ichd-3.org/" },
  { pattern: /ACG GERD|AGA clinical practice/i, url: "https://gi.org/clinical-guidelines/" },
  { pattern: /Choosing Wisely/i, url: "https://www.choosingwisely.org/" },
  { pattern: /National Lipid Association/i, url: "https://www.lipid.org/practicetools/guidelines" },
  { pattern: /National Kidney Foundation/i, url: "https://www.kidney.org/professionals/guidelines" },
  { pattern: /EAU urinary infection/i, url: "https://uroweb.org/guidelines" },
  { pattern: /AASLD|NAFLD\/MASLD/i, url: "https://www.aasld.org/practice-guidelines" },
  { pattern: /AAAAI\/ACAAI practice parameters/i, url: "https://www.aaaai.org/allergist-resources/practice-management/practice-parameters-and-statements" },
  { pattern: /NHLBI asthma guidance/i, url: "https://www.nhlbi.nih.gov/health-topics/asthma-management-guidelines-2020-updates" },
  { pattern: /AAOS guidance/i, url: "https://www.aaos.org/quality/quality-programs/lower-extremity-programs/osteoarthritis-of-the-knee/" },
  { pattern: /OARSI recommendations/i, url: "https://oarsi.org/guidelines-for-non-surgical-management-of-knee-hip-and-polyarticular-osteoarthritis" },
  { pattern: /Obesity Medicine Association/i, url: "https://obesitymedicine.org/obesity-algorithm/" },
  { pattern: /USPSTF tobacco cessation/i, url: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/tobacco-use-in-adults-and-pregnant-women-counseling-and-interventions" },
  { pattern: /U\.S\. Public Health Service cessation/i, url: "https://www.ncbi.nlm.nih.gov/books/NBK63952/" },
  { pattern: /Hematology and gastroenterology society guidance for iron deficiency/i, url: "https://ashpublications.org/bloodadvances/article/4/12/2725/460662/American-Society-of-Hematology-2020-guidelines-for" },
  { pattern: /National and endocrine society osteoporosis/i, url: "https://www.endocrine.org/clinical-practice-guidelines" },
];

export function addGuidelineLinks(markdown: string): string {
  const lines = markdown.split("\n");
  let inGuidelineReferences = false;

  const linked = lines.map((line) => {
    if (/^##\s+.*Guideline references/i.test(line.trim())) {
      inGuidelineReferences = true;
      return line;
    }
    if (/^##\s+/.test(line.trim()) && inGuidelineReferences) {
      inGuidelineReferences = false;
    }
    if (!inGuidelineReferences) {
      return line;
    }

    const bulletMatch = line.match(/^-\s+(.*)$/);
    if (!bulletMatch) {
      return line;
    }

    const bulletText = bulletMatch[1].trim();
    if (/\[[^\]]+\]\(https?:\/\/[^\)]+\)/i.test(bulletText)) {
      return line;
    }

    const rule = GUIDELINE_LINK_RULES.find((item) => item.pattern.test(bulletText));
    if (!rule) {
      return line;
    }

    const noPeriod = bulletText.replace(/\.$/, "");
    const hasPeriod = bulletText.endsWith(".");
    return `- [${noPeriod}](${rule.url})${hasPeriod ? "." : ""}`;
  });

  return linked.join("\n");
}
