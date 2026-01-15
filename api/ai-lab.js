const setCors = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ✅ Quick check endpoint
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, message: "AI Lab API running ✅" });
  }

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { action, payload } = req.body || {};

    if (!action) {
      return res.status(400).json({ error: "Missing action" });
    }

    let prompt = "";

    if (action === "codeRoast") {
      if (!payload?.code) return res.status(400).json({ error: "Missing code" });

      prompt = `
You are an expert Angular reviewer.
Give output in this format:
1) Issues
2) Improvements
3) Better Code
4) Quick Tips

Mode: ${payload?.mode || "senior"}

CODE:
${payload.code}
      `;
    } else if (action === "snippet") {
      if (!payload?.prompt) return res.status(400).json({ error: "Missing prompt" });

      prompt = `
You are an Angular 17 expert.
Generate clean Angular standalone component code + HTML + CSS.

USER PROMPT:
${payload.prompt}
      `;
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    // ✅ If key missing
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "GROQ_API_KEY is missing in environment variables" });
    }

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-70b-8192", // ✅ use stable model
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6
      })
    });

    const data = await groqRes.json();

    // ✅ show actual error if any
    if (!groqRes.ok) {
      return res.status(groqRes.status).json({
        error: "Groq API error",
        details: data
      });
    }

    return res.status(200).json({
      output: data?.choices?.[0]?.message?.content || "No response from Groq"
    });
  } catch (error) {
    return res.status(500).json({
      error: error?.message || "Server error"
    });
  }
}
