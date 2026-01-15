const setCors = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODELS = ["llama-3.1-8b-instant", "llama-3.2-3b-preview"];

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
          temperature: 0.35
        })
      });

      const data = await groqRes.json();

      if (groqRes.ok) return { modelUsed: model, data };

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

  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      message: "AI Interview API running ✅",
      modelsTried: MODELS
    });
  }

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "GROQ_API_KEY missing" });
    }

    const { action, payload } = req.body || {};
    if (!action) return res.status(400).json({ error: "Missing action" });

    let prompt = "";

    if (action === "generate") {
      const topic = payload?.topic || "Angular";
      const difficulty = payload?.difficulty || "medium";

      prompt = `
You are a Senior Angular interviewer.

Generate ONE interview question based on topic and difficulty.

Return ONLY in exact format:

---QUESTION---
(text)

---KEY_POINTS---
- point 1
- point 2
- point 3

---FOLLOW_UPS---
- follow up 1
- follow up 2

Topic: ${topic}
Difficulty: ${difficulty}
`;
    } else if (action === "evaluate") {
      const question = payload?.question;
      const answer = payload?.answer;

      if (!question?.trim()) return res.status(400).json({ error: "Missing question" });
      if (!answer?.trim()) return res.status(400).json({ error: "Missing answer" });

      prompt = `
You are a strict Angular interviewer.

Evaluate the candidate answer.

Return ONLY in exact format:

---SCORE---
x/10

---FEEDBACK---
(text)

---MISSING_POINTS---
- ...

---IDEAL_ANSWER---
(text)

---NEXT_QUESTION---
(one follow-up question)

QUESTION:
${question}

ANSWER:
${answer}
`;
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    const result = await callGroq({
      apiKey: process.env.GROQ_API_KEY,
      prompt
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
