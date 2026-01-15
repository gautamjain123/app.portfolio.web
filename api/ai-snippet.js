const setCors = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// ✅ fallback models
const MODELS = [
  "llama-3.1-8b-instant",
  "llama-3.2-3b-preview"
];

async function callGroq({ apiKey, prompt }) {
  let lastError = null;

  for (const model of MODELS) {
    try {
      const groqRes = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.45
        })
      });

      const data = await groqRes.json();

      if (groqRes.ok) {
        return { modelUsed: model, data };
      }

      const code = data?.error?.code;
      if (code === "model_decommissioned" || code === "model_not_found") {
        lastError = data;
        continue;
      }

      throw { status: groqRes.status, data };
    } catch (err) {
      lastError = err;
    }
  }

  throw {
    status: 500,
    data: { error: { message: "All Groq models failed", lastError } }
  };
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") return res.status(200).end();

  // ✅ health check
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      message: "AI Snippet API running ✅",
      modelsTried: MODELS
    });
  }

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        error: "GROQ_API_KEY is missing in environment variables"
      });
    }

    const { prompt } = req.body || {};

    if (!prompt?.trim()) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const finalPrompt = `
You are an Angular 17 expert.

Task:
Generate a FULL Angular standalone component using Bootstrap 5.

Rules:
- Bootstrap only (no Angular Material)
- Fully responsive
- Clean and production-ready
- Use modern UX styles (glass/premium)
- Must include a proper component name

Return output in EXACT format:

---COMPONENT_NAME---
<Example: PricingSectionComponent>

---TS---
<standalone component ts>

---HTML---
<html template>

---SCSS---
<scss styles>

---NOTES---
<short usage notes>

USER PROMPT:
${prompt}
    `;

    const result = await callGroq({
      apiKey: process.env.GROQ_API_KEY,
      prompt: finalPrompt
    });

    return res.status(200).json({
      output: result?.data?.choices?.[0]?.message?.content || "No response",
      modelUsed: result?.modelUsed
    });
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: "Server error",
      details: error?.data || error?.message || error
    });
  }
}
