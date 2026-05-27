import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  createOriginMatcher,
  isOriginAllowed,
  normalizeOrigin,
} from "../Config/cors.js";

describe("cors helpers", () => {
  it("normalizes trailing slashes in origins", () => {
    assert.equal(normalizeOrigin("https://frontend.example.com/"), "https://frontend.example.com");
    assert.equal(normalizeOrigin("https://frontend.example.com///"), "https://frontend.example.com");
  });

  it("matches exact origins after normalization", () => {
    const matcher = createOriginMatcher("https://frontend.example.com/");

    assert.equal(matcher("https://frontend.example.com"), true);
    assert.equal(matcher("https://frontend.example.com/"), true);
    assert.equal(matcher("https://other.example.com"), false);
  });

  it("matches wildcard subdomain patterns", () => {
    const matcher = createOriginMatcher("https://*.onrender.com");

    assert.equal(matcher("https://resume-ui.onrender.com"), true);
    assert.equal(matcher("https://resume-api.onrender.com"), true);
    assert.equal(matcher("https://onrender.com"), false);
    assert.equal(matcher("https://resume-ui.example.com"), false);
  });

  it("supports mixed exact and wildcard allowlists", () => {
    const patterns = ["https://frontend.example.com/", "https://*.vercel.app"];

    assert.equal(isOriginAllowed("https://frontend.example.com", patterns), true);
    assert.equal(isOriginAllowed("https://resume-preview.vercel.app", patterns), true);
    assert.equal(isOriginAllowed("https://resume-preview.netlify.app", patterns), false);
  });
});
