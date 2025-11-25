export async function POST(request) {
  try {
    const { content, title } = await request.json()

    if (!content) {
      return Response.json({ error: "Content is required" }, { status: 400 })
    }

    const fullText = `${title} ${content}`.toLowerCase().replace(/<[^>]*>/g, "")

    const keywords = extractKeywords(fullText)
    const tags = keywords.slice(0, 5)

    return Response.json({ tags })
  } catch (error) {
    return Response.json({ error: "Failed to generate tags" }, { status: 500 })
  }
}

function extractKeywords(text) {
  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "as",
    "is",
    "was",
    "are",
    "been",
    "be",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
  ])

  const words = text.match(/\b\w+\b/g) || []
  const wordFreq = {}

  words.forEach((word) => {
    if (word.length > 3 && !stopWords.has(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1
    }
  })

  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word)
}
