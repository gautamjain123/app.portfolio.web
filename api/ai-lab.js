const setCors = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // ✅ for dev
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

export default async function handler(req, res) {
  setCors(res);

  // ✅ Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { action, payload } = req.body;

    let prompt = "";

    if (action === "codeRoast") {
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
      prompt = `
You are an Angular 17 expert.
Generate clean Angular standalone component code + HTML + CSS.

USER PROMPT:
${payload.prompt}
      `;
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6
      })
    });

    const data = await response.json();

    return res.status(200).json({
      output: data?.choices?.[0]?.message?.content || "No response"
    });
  } catch (error) {
    return res.status(500).json({
      error: error?.message || "Server error"
    });
  }
}
