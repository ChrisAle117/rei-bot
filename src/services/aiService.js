async function askAi(question) {
  const apiKey = process.env.AI_API_KEY;
  const apiUrl = process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions";
  const model = process.env.AI_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    return { ok: false, error: "Falta AI_API_KEY en variables de entorno." };
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: "Responde en español de forma útil, breve y clara."
        },
        {
          role: "user",
          content: question
        }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    return { ok: false, error: `Error IA HTTP ${response.status}` };
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content?.trim();

  if (!content) {
    return { ok: false, error: "La API IA no devolvió contenido." };
  }

  return { ok: true, content };
}

module.exports = { askAi };