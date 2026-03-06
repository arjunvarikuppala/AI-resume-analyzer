import nspell from "nspell";

import { checkGrammar } from "./languageToolService.js";

const REQUIRED_SECTIONS = [
  {
    label: "Education",
    pattern: /(^|\n)\s*(education|academic background|qualifications)\s*$/im,
  },
  {
    label: "Skills",
    pattern: /(^|\n)\s*(skills|technical skills|core competencies)\s*$/im,
  },
  {
    label: "Projects",
    pattern: /(^|\n)\s*(projects|key projects|personal projects)\s*$/im,
  },
  {
    label: "Experience",
    pattern: /(^|\n)\s*(experience|work experience|professional experience)\s*$/im,
  },
  {
    label: "Contact",
    pattern: /(^|\n)\s*(contact|contact information)\s*$/im,
  },
];

const SKILL_DEFINITIONS = [
  { label: "React", pattern: /\breact(?:\.js)?\b/i },
  { label: "Node", pattern: /\bnode(?:\.js)?\b/i },
  { label: "MongoDB", pattern: /\bmongo(?:db)?\b/i },
  { label: "JavaScript", pattern: /\bjavascript\b|\bes6\b/i },
  { label: "REST API", pattern: /\brest(?:ful)?\s+api\b|\bapi development\b/i },
  { label: "Docker", pattern: /\bdocker\b/i },
];

const SPELLING_WHITELIST = [
  "react",
  "node",
  "mongodb",
  "javascript",
  "typescript",
  "tailwind",
  "vite",
  "express",
  "jwt",
  "rest",
  "api",
  "apis",
  "docker",
  "github",
  "linkedin",
  "aws",
  "gcp",
  "sql",
  "postgresql",
  "mysql",
  "html",
  "css",
  "ci",
  "cd",
  "kubernetes",
  "redux",
];

let spellCheckerPromise;

const getSpellChecker = async () => {
  if (!spellCheckerPromise) {
    spellCheckerPromise = import("dictionary-en").then((module) => {
      const spellChecker = nspell(module.default);
      SPELLING_WHITELIST.forEach((term) => spellChecker.add(term));
      return spellChecker;
    });
  }

  return spellCheckerPromise;
};

const clampScore = (score) => Math.max(0, Math.min(100, Math.round(score)));

const detectSections = (text) => {
  const emailFound = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text);
  const phoneFound = /(?:\+?\d[\d\s()-]{7,}\d)/.test(text);

  return REQUIRED_SECTIONS.map((section) => {
    if (section.label === "Contact") {
      return {
        label: section.label,
        present: section.pattern.test(text) || emailFound || phoneFound,
      };
    }

    return { label: section.label, present: section.pattern.test(text) };
  });
};

const detectSkills = (text) =>
  SKILL_DEFINITIONS.filter((skill) => skill.pattern.test(text)).map((skill) => skill.label);

const analyzeFormatting = (text) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const bulletTypes = new Set();
  const bulletEndings = new Set();
  const issues = [];

  for (const line of lines) {
    if (/^(?:\u2022|[*-])\s+/.test(line)) {
      bulletTypes.add(line[0]);
      bulletEndings.add(/[.!?]$/.test(line) ? "punctuated" : "plain");
      continue;
    }

    if (/^\d+[\.\)]\s+/.test(line)) {
      bulletTypes.add("numbered");
      bulletEndings.add(/[.!?]$/.test(line) ? "punctuated" : "plain");
    }
  }

  if (bulletTypes.size > 1) {
    issues.push("Use one bullet style consistently across the resume.");
  }

  if (bulletEndings.size > 1) {
    issues.push("Keep bullet endings consistent across experience and project sections.");
  }

  return issues;
};

const collectSpellingErrors = async (text) => {
  const spellChecker = await getSpellChecker();
  const tokens = text.match(/\b[A-Za-z][A-Za-z'-]{2,}\b/g) || [];
  const tokenMeta = new Map();

  for (const token of tokens) {
    const lower = token.toLowerCase();
    const current = tokenMeta.get(lower) || { count: 0, titleCaseOnly: true };

    current.count += 1;
    current.titleCaseOnly = current.titleCaseOnly && /^[A-Z][a-z'-]+$/.test(token);

    tokenMeta.set(lower, current);
  }

  return Array.from(tokenMeta.entries())
    .filter(([word, meta]) => {
      if (word.length < 3 || SPELLING_WHITELIST.includes(word)) {
        return false;
      }

      if (meta.titleCaseOnly && meta.count === 1) {
        return false;
      }

      return !spellChecker.correct(word);
    })
    .map(([word, meta]) => ({
      word,
      count: meta.count,
      suggestions: spellChecker.suggest(word).slice(0, 3),
    }))
    .slice(0, 20);
};

const buildSuggestions = ({
  missingSections,
  missingSkills,
  spellingErrors,
  grammarErrors,
  formattingIssues,
  analysisWarnings,
  score,
}) => {
  const suggestions = [];

  if (missingSections.length) {
    suggestions.push(`Add clear headings for: ${missingSections.join(", ")}.`);
  }

  if (missingSkills.length) {
    suggestions.push(`Add relevant keywords where accurate: ${missingSkills.join(", ")}.`);
  }

  if (spellingErrors.length) {
    suggestions.push("Correct spelling mistakes to improve professionalism and ATS parsing.");
  }

  if (grammarErrors.length) {
    suggestions.push("Rewrite the flagged sentences to improve grammar and readability.");
  }

  if (formattingIssues.length) {
    suggestions.push("Standardize bullets and punctuation so the layout reads consistently.");
  }

  analysisWarnings.forEach((warning) => suggestions.push(warning));

  if (score >= 85) {
    suggestions.push("Tailor the summary and skills section to each job description for a stronger match.");
  }

  return [...new Set(suggestions)].slice(0, 8);
};

export const analyzeResume = async (text) => {
  const [spellingErrors, grammarResult] = await Promise.all([
    collectSpellingErrors(text),
    checkGrammar(text),
  ]);

  const sectionResults = detectSections(text);
  const detectedSkills = detectSkills(text);
  const formattingIssues = analyzeFormatting(text);
  const missingSections = sectionResults
    .filter((section) => !section.present)
    .map((section) => section.label);
  const missingSkills = SKILL_DEFINITIONS
    .map((skill) => skill.label)
    .filter((skillLabel) => !detectedSkills.includes(skillLabel));

  const sectionScore = clampScore(
    (sectionResults.filter((section) => section.present).length / REQUIRED_SECTIONS.length) * 100
  );
  const grammarScore = grammarResult.unavailable
    ? 100
    : clampScore(100 - grammarResult.errors.length * 8);
  const spellingScore = clampScore(100 - spellingErrors.length * 8);
  const skillsScore = clampScore((detectedSkills.length / SKILL_DEFINITIONS.length) * 100);
  const formattingScore = formattingIssues.length
    ? clampScore(100 - formattingIssues.length * 25)
    : 100;

  const score = clampScore(
    (sectionScore + grammarScore + spellingScore + skillsScore + formattingScore) / 5
  );
  const atsScore = clampScore(sectionScore * 0.4 + skillsScore * 0.4 + formattingScore * 0.2);
  const analysisWarnings = grammarResult.unavailable
    ? ["Grammar analysis service was unavailable during this scan."]
    : [];

  return {
    score,
    atsScore,
    missingSkills,
    spellingErrors,
    grammarErrors: grammarResult.errors.slice(0, 20),
    missingSections,
    detectedSkills,
    formattingIssues,
    analysisWarnings,
    sectionScores: {
      sections: sectionScore,
      grammar: grammarScore,
      spelling: spellingScore,
      skills: skillsScore,
      formatting: formattingScore,
    },
    suggestions: buildSuggestions({
      missingSections,
      missingSkills,
      spellingErrors,
      grammarErrors: grammarResult.errors,
      formattingIssues,
      analysisWarnings,
      score,
    }),
  };
};
