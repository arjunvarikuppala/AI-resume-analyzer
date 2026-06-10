const escapeRegex = (value) => value.replace(/[|\\{}()[\]^$+?.*]/g, "\\$&");
const normalizeOrigin = (origin) => String(origin || "").trim().replace(/\/+$/, "");

const pattern = "https://*.vercel.app";
const normalizedPattern = normalizeOrigin(pattern);

console.log("Original pattern:", pattern);
console.log("Normalized pattern:", normalizedPattern);

const escaped = escapeRegex(normalizedPattern);
console.log("Escaped pattern:", escaped);

const regexString = `^${escaped.replace(/\\\*/g, "[^/]+")}$`;
console.log("Regex string:", regexString);

const wildcardRegex = new RegExp(regexString);
console.log("Regex object:", wildcardRegex);

const testUrl = "https://ai-resume-analyzer-backe-git-a962dd-arjun-varikuppalas-projects.vercel.app";
console.log("Test URL:", testUrl);
console.log("Test result:", wildcardRegex.test(testUrl));
