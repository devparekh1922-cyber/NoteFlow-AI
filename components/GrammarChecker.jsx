const commonGrammarPatterns = [
  {
    pattern: /\bi\s/gi,
    message: 'Use capital "I"',
    type: "Capitalization",
  },
  {
    pattern: /\b(its|it's)\b/gi,
    check: (match) => {
      if (match.toLowerCase() === "it's") return false
      return true
    },
    message: 'Did you mean "it\'s"?',
    type: "Spelling",
  },
  {
    pattern: /\b(your|you're)\b/gi,
    message: "Check your/you're usage",
    type: "Grammar",
  },
  {
    pattern: /\.{2,}/g,
    message: "Use proper punctuation (... for ellipsis)",
    type: "Punctuation",
  },
  {
    pattern: /\s{2,}/g,
    message: "Remove extra spaces",
    type: "Spacing",
  },
]

export default class GrammarChecker {
  static check(text) {
    const errors = []

    commonGrammarPatterns.forEach(({ pattern, check: customCheck, message, type }) => {
      let match
      const regex = new RegExp(pattern)
      while ((match = regex.exec(text)) !== null) {
        if (!customCheck || !customCheck(match[0])) {
          errors.push({
            message,
            type,
            position: match.index,
          })
        }
      }
    })

    return errors.slice(0, 5)
  }
}
