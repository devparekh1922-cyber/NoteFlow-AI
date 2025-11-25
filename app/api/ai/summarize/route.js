export async function POST(request) {
  try {
    const { content } = await request.json()

    if (!content || content.trim().length === 0) {
      return Response.json({ error: "Content is required" }, { status: 400 })
    }

    const plainText = content.replace(/<[^>]*>/g, "").trim()

    if (plainText.length < 50) {
      return Response.json({
        summary: "Note too short to summarize",
      })
    }

    // Try to use Groq API if key is available
    const groqApiKey = process.env.GROQ_API_KEY

    if (groqApiKey) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful assistant that summarizes notes concisely. Provide a summary in 1-2 sentences, capturing the main ideas.",
              },
              {
                role: "user",
                content: `Please summarize this note in 1-2 sentences:\n\n${plainText}`,
              },
            ],
            max_tokens: 150,
            temperature: 0.7,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const summary = data.choices[0].message.content.trim()
          return Response.json({ summary })
        }
      } catch (groqError) {
        console.error("Groq API error:", groqError)
        // Fall back to local algorithm if Groq fails
      }
    }

    // Fallback: Local summarization algorithm
    const sentences = plainText.match(/[^.!?]+[.!?]+/g) || []

    if (sentences.length === 0) {
      return Response.json({
        summary: plainText.substring(0, 200) + (plainText.length > 200 ? "..." : ""),
      })
    }

    // Select important sentences
    const keyIndices = new Set()
    keyIndices.add(0) // First sentence
    if (sentences.length > 1) keyIndices.add(Math.floor(sentences.length / 2)) // Middle
    if (sentences.length > 2) keyIndices.add(sentences.length - 1) // Last sentence

    const totalToAdd = Math.min(3, Math.ceil(sentences.length / 4))
    const step = Math.max(1, Math.floor(sentences.length / totalToAdd))
    for (let i = 0; i < sentences.length; i += step) {
      keyIndices.add(i)
    }

    const importantSentences = Array.from(keyIndices)
      .sort((a, b) => a - b)
      .map((i) => {
        const sentence = sentences[i].trim()
        return sentence.endsWith(".") || sentence.endsWith("!") || sentence.endsWith("?") ? sentence : sentence + "."
      })
      .filter((s) => s.length > 10)
      .slice(0, 2) // Limit to 2 sentences
      .join(" ")
      .trim()

    const summary =
      importantSentences.length > 0 ? importantSentences : "Unable to generate summary"

    return Response.json({
      summary: summary,
    })
  } catch (error) {
    console.error("Summarize error:", error)
    return Response.json({ error: "Failed to summarize" }, { status: 500 })
  }
}
