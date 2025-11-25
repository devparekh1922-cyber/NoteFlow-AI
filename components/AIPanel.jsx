"use client"

import { useState } from "react"
import { X, Loader } from "lucide-react"

const LANGUAGES = [
  { code: "Spanish", label: "Spanish" },
  { code: "French", label: "French" },
  { code: "German", label: "German" },
  { code: "Italian", label: "Italian" },
  { code: "Portuguese", label: "Portuguese" },
  { code: "Russian", label: "Russian" },
  { code: "Japanese", label: "Japanese" },
  { code: "Chinese", label: "Chinese" },
]

export default function AIPanel({ note, onUpdateNote, onClose }) {
  const [loading, setLoading] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("Spanish")
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("summarize")
  const [summary, setSummary] = useState("")
  const [translation, setTranslation] = useState("")
  const [tags, setTags] = useState("")

  const handleSummarize = async () => {
    setLoading(true)
    setError("")
    setSummary("")
    try {
      const plainContent = note.content.replace(/<[^>]*>/g, "")
      if (plainContent.trim().length < 50) {
        setError("Content too short to summarize (minimum 50 characters)")
        setLoading(false)
        return
      }

      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: plainContent }),
      })
      const data = await response.json()
      if (data.summary) {
        setSummary(data.summary)
      } else {
        setError("Failed to generate summary")
      }
    } catch (err) {
      setError("Failed to generate summary")
    } finally {
      setLoading(false)
    }
  }

  const handleTranslate = async () => {
    setLoading(true)
    setError("")
    setTranslation("")
    try {
      const plainContent = note.content.replace(/<[^>]*>/g, "")
      if (plainContent.trim().length === 0) {
        setError("Add content to translate")
        setLoading(false)
        return
      }

      const response = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: plainContent,
          targetLanguage: selectedLanguage,
        }),
      })
      const data = await response.json()
      if (data.translation) {
        setTranslation(data.translation)
      } else {
        setError("Failed to translate")
      }
    } catch (err) {
      setError("Failed to translate")
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateTags = async () => {
    setLoading(true)
    setError("")
    setTags("")
    try {
      const plainContent = note.content.replace(/<[^>]*>/g, "")
      if (plainContent.trim().length === 0) {
        setError("Add content to generate tags")
        setLoading(false)
        return
      }

      const response = await fetch("/api/ai/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: plainContent,
          title: note.title,
        }),
      })
      const data = await response.json()
      if (data.tags && data.tags.length > 0) {
        setTags(data.tags.join(", "))
        onUpdateNote(note.id, { tags: data.tags })
      } else {
        setError("Could not generate tags from content")
      }
    } catch (err) {
      setError("Failed to generate tags")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-lg shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">AI Tools</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded text-foreground transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => {
              setActiveTab("summarize")
              setError("")
            }}
            className={`flex-1 py-3 px-4 font-medium text-sm transition ${
              activeTab === "summarize"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Summarize
          </button>
          <button
            onClick={() => {
              setActiveTab("translate")
              setError("")
            }}
            className={`flex-1 py-3 px-4 font-medium text-sm transition ${
              activeTab === "translate"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Translate
          </button>
          <button
            onClick={() => {
              setActiveTab("tags")
              setError("")
            }}
            className={`flex-1 py-3 px-4 font-medium text-sm transition ${
              activeTab === "tags"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Generate Tags
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/50 rounded text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Summarize Tab */}
          {activeTab === "summarize" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Create a concise 1-2 sentence summary of your note.
              </p>
              <button
                onClick={handleSummarize}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Summary"
                )}
              </button>

              {summary && (
                <div className="p-5 bg-card border-2 border-primary/30 rounded-lg shadow-sm">
                  <p className="text-xs font-bold text-primary mb-3 uppercase tracking-widest">📝 Summary Result</p>
                  <p className="text-base text-foreground leading-relaxed font-medium">{summary}</p>
                </div>
              )}
            </div>
          )}

          {/* Translate Tab */}
          {activeTab === "translate" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Translate your note to another language.
              </p>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Target Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2 focus:outline-none focus:border-primary text-foreground text-sm"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleTranslate}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Translating...
                  </>
                ) : (
                  "Translate to " + selectedLanguage
                )}
              </button>

              {translation && (
                <div className="p-5 bg-card border-2 border-primary/30 rounded-lg shadow-sm max-h-48 overflow-y-auto">
                  <p className="text-xs font-bold text-primary mb-3 uppercase tracking-widest">🌍 Translation Result</p>
                  <p className="text-base text-foreground leading-relaxed font-medium">{translation}</p>
                </div>
              )}
            </div>
          )}

          {/* Tags Tab */}
          {activeTab === "tags" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Automatically generate relevant tags for your note based on its content.
              </p>
              <button
                onClick={handleGenerateTags}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Tags"
                )}
              </button>

              {tags && (
                <div className="p-4 bg-card border border-border rounded-lg">
                  <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Generated Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.split(", ").map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
