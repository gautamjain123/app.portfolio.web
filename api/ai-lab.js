const setCors = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// ✅ Model list (fallback)
const MODELS = [
  "llama-3.1-8b-instant",   // ✅ fast + stable
  "llama-3.2-3b-preview"    // ✅ fallback (if available)
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
          temperature: 0.35 // ✅ more accurate + less hallucination
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

    // ✅ Action: Interview Style Code Review
    if (action === "codeInterviewReview") {
      if (!payload?.code?.trim()) {
        return res.status(400).json({ error: "Missing code" });
      }

      prompt = `
You are a Senior Frontend Engineer and Angular Interviewer.

Your task:
- Analyze the given input code ACCURATELY.
- Identify whether it is HTML / CSS / TypeScript / Angular component/service/template.
- Provide improvements WITHOUT hallucinating.

VERY IMPORTANT:
- If the user input is HTML, output better HTML.
- If CSS, output better CSS.
- If TypeScript, output better TypeScript.
- If Angular component/service, output complete updated code (TS + HTML + SCSS).
- If code is incomplete, assume minimal safe missing parts and mention assumptions briefly.

Return output with EXACT headings in this order:

### Code Type Detected
Explain what code type it is: HTML/CSS/TS/Angular and why.

### Issues
Bullet list of issues (real ones).

### Improvements
Bullet list of improvements.

### Better Code
Provide complete improved code.
Use code blocks like:

\`\`\`ts
...
\`\`\`

\`\`\`html
...
\`\`\`

\`\`\`scss
...
\`\`\`

### Quick Tips
Short quick wins (bullet list).

### Interview Questions
Give 8 interview questions based on this code + short expected answers.

CODE:
${payload.code}
      `;
    }

    // ✅ Optional: Keep Snippet generator
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
