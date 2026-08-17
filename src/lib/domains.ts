// Shared vocabulary used by the Induction Wizard (student specialization
// interest), the course catalog (domain tags), and the recommender (matches
// one against the other). Keeping this in one file means both sides always
// agree on the same slugs.

export interface Option {
  value: string;
  label: string;
}

export const SPECIALIZATIONS: Option[] = [
  { value: "full-stack", label: "Full-Stack Development" },
  { value: "ai-ml", label: "AI & Machine Learning" },
  { value: "devops-cloud", label: "DevOps & Cloud" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "mobile", label: "Mobile Development" },
  { value: "data-engineering", label: "Data Engineering" },
  { value: "distributed-systems", label: "Distributed Systems" },
  { value: "web3", label: "Web3 & Blockchain" },
  { value: "embedded-edge-ai", label: "Embedded & Edge AI" },
];

export const FIELD_OF_STUDY_OPTIONS: Option[] = [
  { value: "btech-cse", label: "B.Tech / B.E. — CSE" },
  { value: "btech-it", label: "B.Tech / B.E. — IT" },
  { value: "btech-other", label: "B.Tech / B.E. — Other Branch" },
  { value: "bca", label: "BCA" },
  { value: "mca", label: "MCA" },
  { value: "diploma", label: "Diploma" },
  { value: "self-taught", label: "Self-Taught / Working Professional" },
  { value: "other", label: "Other" },
];

export const YEAR_STAGE_OPTIONS: Option[] = [
  { value: "year-1", label: "1st Year" },
  { value: "year-2", label: "2nd Year" },
  { value: "year-3", label: "3rd Year" },
  { value: "year-final", label: "Final Year" },
  { value: "graduated", label: "Graduated" },
  { value: "professional", label: "Working Professional" },
];

export const SKILL_LEVEL_OPTIONS: Option[] = [
  { value: "beginner", label: "Just starting out" },
  { value: "intermediate", label: "Comfortable with the basics" },
  { value: "advanced", label: "Built real projects before" },
];

export const PRIMARY_GOAL_OPTIONS: Option[] = [
  { value: "portfolio", label: "Build a strong resume / portfolio" },
  { value: "interview-prep", label: "Prepare for internship / placement interviews" },
  { value: "new-specialization", label: "Learn a new specialization" },
  { value: "academic-project", label: "Academic project requirement" },
];

export function labelFor(options: Option[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}
