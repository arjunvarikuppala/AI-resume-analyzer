import assert from "node:assert/strict";
import http from "node:http";
import { after, before, describe, it } from "node:test";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
process.env.CLIENT_URL = "http://localhost:5173";

const { default: app } = await import("../app.js");

let server;
let baseUrl;

const request = async (path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, options);
  const text = await response.text();

  return {
    status: response.status,
    headers: response.headers,
    body: text ? JSON.parse(text) : null,
  };
};

describe("backend api smoke tests", () => {
  before(async () => {
    server = http.createServer(app);

    await new Promise((resolve) => {
      server.listen(0, "127.0.0.1", resolve);
    });

    const address = server.address();
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    if (!server) {
      return;
    }

    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  });

  it("returns a production-friendly health payload", async () => {
    const response = await request("/api/health");

    assert.equal(response.status, 200);
    assert.equal(response.body.status, "ok");
    assert.equal(response.body.environment, "test");
    assert.equal(typeof response.body.timestamp, "string");
    assert.equal(typeof response.body.uptime, "number");
    assert.deepEqual(response.body.database, {
      readyState: 0,
      status: "disconnected",
    });
  });

  it("allows configured origins through cors", async () => {
    const response = await request("/api/health", {
      headers: {
        Origin: "http://localhost:5173",
      },
    });

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("access-control-allow-origin"), "http://localhost:5173");
    assert.equal(response.headers.get("access-control-allow-credentials"), "true");
  });

  it("rejects unknown origins through cors", async () => {
    const response = await request("/api/health", {
      headers: {
        Origin: "https://not-allowed.example",
      },
    });

    assert.equal(response.status, 403);
    assert.equal(response.body.message, "Origin is not allowed by CORS.");
  });

  it("validates registration payloads before hitting the database", async () => {
    const response = await request("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "invalid-email",
        password: 12345678,
      }),
    });

    assert.equal(response.status, 400);
    assert.equal(response.body.message, "Invalid registration payload.");
    assert.deepEqual(response.body.details, [
      "A valid email address is required.",
      "Password must be at least 8 characters long.",
    ]);
  });

  it("validates login payloads before hitting the database", async () => {
    const response = await request("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "user@example.com",
        password: "short",
      }),
    });

    assert.equal(response.status, 400);
    assert.equal(response.body.message, "Invalid login payload.");
    assert.deepEqual(response.body.details, ["Password must be at least 8 characters long."]);
  });

  it("protects resume routes without a bearer token", async () => {
    const response = await request("/api/resume/history");

    assert.equal(response.status, 401);
    assert.equal(response.body.message, "Authentication token is missing.");
  });

  it("returns a structured 404 response for unknown routes", async () => {
    const response = await request("/api/does-not-exist");

    assert.equal(response.status, 404);
    assert.equal(response.body.message, "Route not found: /api/does-not-exist");
  });
});
