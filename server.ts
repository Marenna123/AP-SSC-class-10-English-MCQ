import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'AP SSC Class 10 English MCQ Learning App',
    year: '2026-27',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Ask AI Explanation Endpoint
// Requirements:
// 1. Explain existing question & answer in simple Class 10 English
// 2. Optional Telugu explanation: "Explain in Telugu"
// 3. AI must NOT invent a different answer from the stored correct answer
app.post('/api/ai/explain', async (req, res) => {
  try {
    const { question_text, options, correct_option, explanation, category, subcategory, inTelugu } = req.body;

    if (!question_text || !correct_option) {
      return res.status(400).json({ error: 'Missing question_text or correct_option' });
    }

    const ai = getAI();
    if (!ai) {
      // Graceful pedagogical fallback when Gemini key is not configured
      const fallbackText = inTelugu
        ? `📚 **ఉపాధ్యాయుల వివరణ:**\n${explanation}\n\nసరైన సమాధానం **${correct_option}**. ఈ సమాధానం AP SSC క్లాస్ 10 ఇంగ్లీష్ సిలబస్ ఆధారంగా సరైనది.`
        : `📚 **Teacher's Guide:**\n${explanation}\n\nThe correct choice is **Option ${correct_option}**. This matches the AP SSC Class 10 textbook content.`;

      return res.json({ explanation: fallbackText, source: 'curriculum_fallback' });
    }

    const correctText = options ? options[correct_option] || correct_option : correct_option;

    const systemPrompt = `You are a supportive, warm, and expert AP SSC Class 10 English teacher in Andhra Pradesh helping a student understand their Board Exam practice question.
Your goals:
1. Explain why the stored correct option (${correct_option}: "${correctText}") is correct based on the AP SSC Class 10 English 2026-27 syllabus.
2. CRITICAL CONSTRAINT: You MUST NOT change or invent a different answer from the stored correct answer. The stored answer (${correct_option}) is authoritative.
3. Keep your language simple, encouraging, and easy for a 15-year-old state board student to comprehend.
4. If inTelugu is TRUE, provide the primary explanation in simple, lucid Telugu (తెలుగు వివరణ) alongside the English key terms.
5. Keep the explanation concise (2 to 3 short paragraphs).`;

    const userPrompt = `Question: "${question_text}"
Options:
A) ${options?.A || ''}
B) ${options?.B || ''}
C) ${options?.C || ''}
D) ${options?.D || ''}

Stored Official Correct Answer: Option ${correct_option}
Official Textbook Note: "${explanation || ''}"
Category/Topic: ${category} - ${subcategory}
Language Requested: ${inTelugu ? 'Telugu & English (తెలుగు వివరణ)' : 'Simple Class 10 English'}

Please explain clearly why Option ${correct_option} is the right answer.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
      },
    });

    const aiText = response.text || explanation;
    return res.json({
      explanation: aiText,
      source: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Error generating AI explanation:', error);
    return res.status(500).json({
      error: 'Failed to generate AI explanation',
      fallback: req.body.explanation || 'Option is correct as per textbook context.',
    });
  }
});

// Vite middleware in dev / static in prod
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AP SSC Class 10 Learning App running on http://0.0.0.0:${PORT}`);
  });
}

setupViteOrStatic().catch((err) => {
  console.error('Server startup error:', err);
});
