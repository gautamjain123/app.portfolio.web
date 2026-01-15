const setCors = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// ✅ Model list (fallback)
const MODELS = [
  "llama-3.1-8b-instant",       // ✅ FAST + stable
  "llama-3.2-3b-preview",       // ✅ another fallback (if available)
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
          temperature: 0.6
        })
      });

      const data = await groqRes.json();

      // ✅ If success return immediately
      if (groqRes.ok) {
        return {
          modelUsed: model,
          data
        };
      }

      // ❌ Model decommissioned -> try next model
      const code = data?.error?.code;
      if (code === "model_decommissioned" || code === "model_not_found") {
        lastError = data;
        continue;
      }

      // ❌ Any other error -> stop and throw
      throw {
        status: groqRes.status,
        data
      };
    } catch (err) {
      lastError = err;
    }
  }

  throw {
    status: 500,
    data: {
      error: {
        message: "All Groq models failed",
        lastError
      }
    }
  };
}

export default async function handler(req, res) {
  setCors(res);

  // ✅ Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ✅ Health check
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      message: "AI Lab API running ✅",
      modelsTried: MODELS
    });
  }

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { action, payload } = req.body || {};

    if (!action) {
      return res.status(400).json({ error: "Missing action" });
    }

    // ✅ Key must exist
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        error: "GROQ_API_KEY is missing in environment variables"
      });
    }

    let prompt = "";

    // ✅ Action 1: Code Roast
    if (action === "codeRoast") {
      if (!payload?.code?.trim()) {
        return res.status(400).json({ error: "Missing code" });
      }

      prompt = `
You are an expert Angular reviewer.

Rules:
- Give practical improvements only.
- Keep it short and useful.
- If user asks bad code, still help politely.

Output format:
1) Issues
2) Improvements
3) Better Code (optional)
4) Quick Tips

Mode: ${payload?.mode || "senior"}

CODE:
${payload.code}
      `;
    }

    // ✅ Action 2: Snippet Generator
    else if (action === "snippet") {
      if (!payload?.prompt?.trim()) {
        return res.status(400).json({ error: "Missing prompt" });
      }

      prompt = `
You are an Angular 17 expert.

Generate:
- Standalone Component TS
- HTML template
- SCSS/CSS styles
- Short explanation

Return in this structure:

---TS---
(code)
---HTML---
(code)
---SCSS---
(code)
---NOTES---
(text)

USER PROMPT:
${payload.prompt}
      `;
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    // ✅ Call Groq with fallback models
    const result = await callGroq({
      apiKey: process.env.GROQ_API_KEY,
      prompt
    });

    return res.status(200).json({
      output: result?.data?.choices?.[0]?.message?.content || "No response from Groq",
      modelUsed: result?.modelUsed
    });
  } catch (error) {
    return res.status(error?.status || 500).json({
      error: "Server error",
      details: error?.data || error?.message || error
    });
  }
}
