import "server-only";

/**
 * Submissions are URLs only (no file uploads), so "automated evaluation" here
 * means deterministic, network-verified heuristics rather than deep code
 * review: for GitHub links we call the public GitHub API to check the repo
 * is real, has commits, and has a README; for PDF/Drive/other links we check
 * the URL is actually reachable. Each course's evaluationCriteria entries are
 * bucketed by keyword into structure / docs / live-proof, then scored against
 * those signals. This is intentionally transparent and re-runnable, not a
 * black box — see the feedback strings for exactly why a score landed where
 * it did.
 */

export type UrlType = "github" | "pdf" | "drive" | "other";

export interface EvaluationCriterionInput {
  criterion: string;
  weight: number;
}

export interface RubricResult {
  criterion: string;
  scoreObtained: number;
  maxScore: number;
  feedback: string;
}

export interface EvaluationResult {
  totalScore: number;
  rubricBreakdown: RubricResult[];
  urlType: UrlType;
}

interface GithubSignals {
  repoExists: boolean;
  hasReadme: boolean;
  commitCount: number;
  sizeKb: number;
}

export function isValidProjectUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function detectUrlType(rawUrl: string): UrlType {
  try {
    const url = new URL(rawUrl);
    if (url.hostname.includes("github.com")) return "github";
    if (url.hostname.includes("drive.google.com") || url.hostname.includes("docs.google.com")) return "drive";
    if (url.pathname.toLowerCase().endsWith(".pdf")) return "pdf";
    return "other";
  } catch {
    return "other";
  }
}

async function checkReachable(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, { method: "GET", redirect: "follow", signal: controller.signal });
    clearTimeout(timeout);
    return res.status >= 200 && res.status < 400;
  } catch {
    return false;
  }
}

async function fetchGithubSignals(rawUrl: string): Promise<GithubSignals | null> {
  const match = rawUrl.match(/github\.com\/([^/]+)\/([^/#?]+)/i);
  if (!match) return null;

  const owner = match[1];
  const repo = match[2].replace(/\.git$/, "");
  const headers = { "User-Agent": "swaniki-lms-evaluator", Accept: "application/vnd.github+json" };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers,
      signal: controller.signal,
    });

    if (!repoRes.ok) {
      clearTimeout(timeout);
      return { repoExists: false, hasReadme: false, commitCount: 0, sizeKb: 0 };
    }
    const repoData = await repoRes.json();

    const [readmeRes, commitsRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=10`, { headers }),
    ]);
    clearTimeout(timeout);

    const hasReadme = readmeRes.ok;
    let commitCount = 0;
    if (commitsRes.ok) {
      const commits = await commitsRes.json();
      commitCount = Array.isArray(commits) ? commits.length : 0;
    }

    return { repoExists: true, hasReadme, commitCount, sizeKb: repoData.size ?? 0 };
  } catch {
    return null;
  }
}

function classifyCriterion(name: string): "structure" | "docs" | "live" {
  const lower = name.toLowerCase();
  if (
    lower.includes("live") ||
    lower.includes("proof") ||
    lower.includes("function") ||
    lower.includes("deploy") ||
    lower.includes("demo")
  ) {
    return "live";
  }
  if (lower.includes("architect") || lower.includes("document") || lower.includes("design")) {
    return "docs";
  }
  return "structure";
}

export async function evaluateSubmission(
  projectUrl: string,
  criteria: EvaluationCriterionInput[]
): Promise<EvaluationResult> {
  const urlType = detectUrlType(projectUrl);
  const github = urlType === "github" ? await fetchGithubSignals(projectUrl) : null;
  const reachable = urlType === "github" ? Boolean(github?.repoExists) : await checkReachable(projectUrl);

  const rubricBreakdown: RubricResult[] = criteria.map((c) => {
    const bucket = classifyCriterion(c.criterion);
    const maxScore = c.weight;
    let ratio = 0;
    let feedback = "";

    if (bucket === "structure") {
      if (github) {
        ratio = github.repoExists ? (github.commitCount >= 3 ? 1 : github.commitCount >= 1 ? 0.7 : 0.3) : 0;
        feedback = github.repoExists
          ? github.commitCount >= 3
            ? "Repository is public with a healthy commit history — good evidence of iterative development."
            : "Repository exists but has very few commits. Show your iterative process with more granular commits."
          : "GitHub repository could not be found or is private. Make sure the repo is public.";
      } else {
        ratio = reachable ? 0.6 : 0.1;
        feedback = reachable
          ? "Submission link is reachable, but code structure can't be verified without a GitHub repository. Link your source repo for a stronger structure score."
          : "Submission link is not reachable — code structure could not be assessed.";
      }
    } else if (bucket === "docs") {
      if (github) {
        ratio = github.repoExists ? (github.hasReadme ? 1 : 0.4) : 0;
        feedback = github.repoExists
          ? github.hasReadme
            ? "README documentation found — clear setup/architecture notes strengthen this submission."
            : "No README found in the repository. Add documentation covering architecture and setup instructions."
          : "Repository not found — documentation could not be assessed.";
      } else {
        ratio = reachable ? 0.7 : 0.1;
        feedback = reachable
          ? "Document link is reachable. Ensure it clearly covers architecture and design decisions."
          : "Document link is not reachable — documentation could not be assessed.";
      }
    } else {
      ratio = reachable ? (github ? Math.min(1, 0.6 + (github.sizeKb > 50 ? 0.4 : 0.2)) : 1) : 0;
      feedback = reachable
        ? "Live proof of work confirmed — the submission link is publicly accessible."
        : "Could not verify the submission link is live/accessible. Double-check the link is public and working.";
    }

    return {
      criterion: c.criterion,
      scoreObtained: Math.round(ratio * maxScore),
      maxScore,
      feedback,
    };
  });

  const totalScore = rubricBreakdown.reduce((sum, r) => sum + r.scoreObtained, 0);

  return { totalScore, rubricBreakdown, urlType };
}
