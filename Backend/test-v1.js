import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  try {
    console.log("Testing gemini-2.5-flash with default (v1beta)...");
    const modelBeta = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const resultBeta = await modelBeta.generateContent("Hello!");
    console.log("v1beta Success:", resultBeta.response.text().trim());
  } catch (err) {
    console.error("v1beta Error:", err.message);
  }

  try {
    console.log("\nTesting gemini-2.5-flash with apiVersion 'v1'...");
    // Let's pass apiVersion in the second parameter RequestOptions
    const modelV1 = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }, { apiVersion: "v1" });
    const resultV1 = await modelV1.generateContent("Hello!");
    console.log("v1 Success:", resultV1.response.text().trim());
  } catch (err) {
    console.error("v1 Error:", err.message);
  }
}

run();
