export async function POST(request) {
  try {
    const { text, targetLanguage } = await request.json()

    if (!text || !targetLanguage) {
      return Response.json(
        { error: "Text and target language are required" },
        { status: 400 }
      )
    }

    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey) {
      // Fallback: return placeholder if no API key
      const translations = {
        Spanish: `[Spanish Translation] ${text.substring(0, 100)}...`,
        French: `[French Translation] ${text.substring(0, 100)}...`,
        German: `[German Translation] ${text.substring(0, 100)}...`,
        Italian: `[Italian Translation] ${text.substring(0, 100)}...`,
        Portuguese: `[Portuguese Translation] ${text.substring(0, 100)}...`,
        Russian: `[Russian Translation] ${text.substring(0, 100)}...`,
        Japanese: `[Japanese Translation] ${text.substring(0, 100)}...`,
        Chinese: `[Chinese Translation] ${text.substring(0, 100)}...`,
      }
      return Response.json({
        translation: translations[targetLanguage] || translations.Spanish,
      })
    }

    const prompt = `Translate the following text to ${targetLanguage}. Provide only the translation, nothing else:\n\nText: ${text}`

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 2048,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("Groq API error:", error)
      return Response.json(
        { error: "Translation failed", details: error },
        { status: 500 }
      )
    }

    const data = await response.json()
    const translation =
      data.choices[0]?.message?.content || "Translation unavailable"

    return Response.json({ translation })
  } catch (error) {
    console.error("Translation error:", error)
    return Response.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    )
  }
}
