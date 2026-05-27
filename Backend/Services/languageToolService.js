import axios from "axios";

const mapGrammarIssue = (match) => ({
  message: match.message,
  shortMessage: match.shortMessage || "",
  sentence: match.context?.text || "",
  ruleId: match.rule?.id || "",
  replacements: (match.replacements || []).slice(0, 4).map((item) => item.value),
  offset: match.offset || 0,
  length: match.length || 0,
});

export const checkGrammar = async (text) => {
  const trimmed = String(text || "").trim();

  if (!trimmed) {
    return { errors: [], unavailable: false };
  }

  const endpoint = process.env.LANGUAGE_TOOL_API_URL || "https://api.languagetool.org/v2/check";
  const payload = new URLSearchParams({
    text: trimmed.slice(0, 3000),
    language: process.env.LANGUAGE_TOOL_LANGUAGE || "en-US",
  });

  try {
    const response = await axios.post(endpoint, payload.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      timeout: 3000,
    });

    return {
      errors: (response.data.matches || []).map(mapGrammarIssue),
      unavailable: false,
    };
  } catch (error) {
    console.error("LanguageTool request failed:", error.message);

    return {
      errors: [],
      unavailable: true,
    };
  }
};
