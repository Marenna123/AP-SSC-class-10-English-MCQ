var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_genai = require("@google/genai");
var import_vite = require("vite");
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var aiClient = null;
function getAI() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new import_genai.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "AP SSC Class 10 English MCQ Learning App",
    year: "2026-27",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY)
  });
});
app.post("/api/ai/explain", async (req, res) => {
  try {
    const { question_text, options, correct_option, explanation, category, subcategory, inTelugu } = req.body;
    if (!question_text || !correct_option) {
      return res.status(400).json({ error: "Missing question_text or correct_option" });
    }
    const ai = getAI();
    if (!ai) {
      const fallbackText = inTelugu ? `\u{1F4DA} **\u0C09\u0C2A\u0C3E\u0C27\u0C4D\u0C2F\u0C3E\u0C2F\u0C41\u0C32 \u0C35\u0C3F\u0C35\u0C30\u0C23:**
${explanation}

\u0C38\u0C30\u0C48\u0C28 \u0C38\u0C2E\u0C3E\u0C27\u0C3E\u0C28\u0C02 **${correct_option}**. \u0C08 \u0C38\u0C2E\u0C3E\u0C27\u0C3E\u0C28\u0C02 AP SSC \u0C15\u0C4D\u0C32\u0C3E\u0C38\u0C4D 10 \u0C07\u0C02\u0C17\u0C4D\u0C32\u0C40\u0C37\u0C4D \u0C38\u0C3F\u0C32\u0C2C\u0C38\u0C4D \u0C06\u0C27\u0C3E\u0C30\u0C02\u0C17\u0C3E \u0C38\u0C30\u0C48\u0C28\u0C26\u0C3F.` : `\u{1F4DA} **Teacher's Guide:**
${explanation}

The correct choice is **Option ${correct_option}**. This matches the AP SSC Class 10 textbook content.`;
      return res.json({ explanation: fallbackText, source: "curriculum_fallback" });
    }
    const correctText = options ? options[correct_option] || correct_option : correct_option;
    const systemPrompt = `You are a supportive, warm, and expert AP SSC Class 10 English teacher in Andhra Pradesh helping a student understand their Board Exam practice question.
Your goals:
1. Explain why the stored correct option (${correct_option}: "${correctText}") is correct based on the AP SSC Class 10 English 2026-27 syllabus.
2. CRITICAL CONSTRAINT: You MUST NOT change or invent a different answer from the stored correct answer. The stored answer (${correct_option}) is authoritative.
3. Keep your language simple, encouraging, and easy for a 15-year-old state board student to comprehend.
4. If inTelugu is TRUE, provide the primary explanation in simple, lucid Telugu (\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41 \u0C35\u0C3F\u0C35\u0C30\u0C23) alongside the English key terms.
5. Keep the explanation concise (2 to 3 short paragraphs).`;
    const userPrompt = `Question: "${question_text}"
Options:
A) ${options?.A || ""}
B) ${options?.B || ""}
C) ${options?.C || ""}
D) ${options?.D || ""}

Stored Official Correct Answer: Option ${correct_option}
Official Textbook Note: "${explanation || ""}"
Category/Topic: ${category} - ${subcategory}
Language Requested: ${inTelugu ? "Telugu & English (\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41 \u0C35\u0C3F\u0C35\u0C30\u0C23)" : "Simple Class 10 English"}

Please explain clearly why Option ${correct_option} is the right answer.`;
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3
      }
    });
    const aiText = response.text || explanation;
    return res.json({
      explanation: aiText,
      source: "gemini-3.8-flash"
    });
  } catch (error) {
    console.error("Error generating AI explanation:", error);
    return res.status(500).json({
      error: "Failed to generate AI explanation",
      fallback: req.body.explanation || "Option is correct as per textbook context."
    });
  }
});
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AP SSC Class 10 Learning App running on http://0.0.0.0:${PORT}`);
  });
}
setupViteOrStatic().catch((err) => {
  console.error("Server startup error:", err);
});
//# sourceMappingURL=server.cjs.map
