"use client"

import { useEffect, useRef, useState } from "react"
import GrammarChecker from "./GrammarChecker"
import GlossaryPanel from "./GlossaryPanel"
import { extractTermsFromText } from "@/lib/glossary"

export default function RichTextEditor({ content, onChange, isEncrypted }) {
  const editorRef = useRef(null)
  const [grammarErrors, setGrammarErrors] = useState([])
  const [showGlossary, setShowGlossary] = useState(false)

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content
    }
  }, [content])

  useEffect(() => {
    // Apply highlighting when glossary is shown/hidden
    if (editorRef.current) {
      if (showGlossary) {
        highlightTermsInEditor()
      } else {
        removeHighlighting()
      }
    }
  }, [showGlossary])

  const highlightTermsInEditor = () => {
    if (!editorRef.current) return

    const terms = extractTermsFromText(content)
    
    // Work with plain text, then replace with highlighted versions
    let html = editorRef.current.innerHTML
    
    // First, unescape any previously highlighted marks
    html = html.replace(/<mark class="glossary-highlight-active"[^>]*>(.*?)<\/mark>/gi, "$1")

    terms.forEach((term) => {
      // Create case-insensitive regex that matches whole words only
      // Only match in plain text, not in HTML tags
      const regex = new RegExp(`(?<![<>])\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b(?![^<]*>)`, "gi")
      html = html.replace(
        regex,
        `<mark class="glossary-highlight-active" data-term="${term}">${term}</mark>`
      )
    })

    editorRef.current.innerHTML = html
  }

  const removeHighlighting = () => {
    if (!editorRef.current) return
    
    // Remove all glossary highlights but keep the text
    const html = editorRef.current.innerHTML
    const cleaned = html.replace(/<mark class="glossary-highlight-active"[^>]*>(.*?)<\/mark>/gi, "$1")
    editorRef.current.innerHTML = cleaned
  }

  const handleInput = () => {
    if (editorRef.current) {
      // Save content without glossary highlights
      let contentToSave = editorRef.current.innerHTML
      contentToSave = contentToSave.replace(/<mark class="glossary-highlight-active"[^>]*>(.*?)<\/mark>/gi, "$1")
      onChange(contentToSave)
      checkGrammar(editorRef.current.innerText)
    }
  }

  const checkGrammar = (text) => {
    const errors = GrammarChecker.check(text)
    setGrammarErrors(errors)
  }

  const applyFormat = (command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus()
    }
    document.execCommand(command, false, value)
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus()
      }
    }, 0)
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <Toolbar onApplyFormat={applyFormat} isEncrypted={isEncrypted} editorRef={editorRef} showGlossary={showGlossary} onToggleGlossary={() => setShowGlossary(!showGlossary)} />

      <div className="flex-1 overflow-hidden flex flex-col">
        <div
          ref={editorRef}
          onInput={handleInput}
          contentEditable={!isEncrypted}
          suppressContentEditableWarning
          className="flex-1 overflow-y-auto p-6 focus:outline-none prose prose-invert max-w-none bg-background text-foreground list-inside"
          style={{
            lineHeight: "1.6",
            minHeight: "300px",
          }}
        />
      </div>

      {grammarErrors.length > 0 && (
        <div className="border-t border-border bg-surface p-4 max-h-32 overflow-y-auto">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 text-foreground">
            <span className="w-2 h-2 bg-destructive rounded-full"></span>
            Grammar Issues ({grammarErrors.length})
          </h4>
          <div className="space-y-1">
            {grammarErrors.map((error, idx) => (
              <div key={idx} className="text-xs text-muted-foreground">
                <span className="font-medium text-destructive">{error.type}:</span> {error.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {showGlossary && (
        <GlossaryPanel content={content} onClose={() => setShowGlossary(false)} />
      )}
    </div>
  )
}

function Toolbar({ onApplyFormat, isEncrypted, editorRef, showGlossary, onToggleGlossary }) {
  const handleBulletList = () => {
    if (editorRef.current) {
      editorRef.current.focus()
      setTimeout(() => {
        document.execCommand("insertUnorderedList", false, null)
      }, 10)
    }
  }

  const handleNumberedList = () => {
    if (editorRef.current) {
      editorRef.current.focus()
      setTimeout(() => {
        document.execCommand("insertOrderedList", false, null)
      }, 10)
    }
  }

  const handleFontChange = (e) => {
    const font = e.target.value
    if (font) {
      if (editorRef.current) {
        editorRef.current.focus()
      }
      document.execCommand("fontName", false, font)
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.focus()
        }
      }, 0)
    }
    e.target.value = ""
  }

  return (
    <div className="border-b border-border bg-surface p-3 flex flex-wrap gap-1 overflow-x-auto">
      <select
        onChange={handleFontChange}
        className="px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:border-primary text-foreground disabled:opacity-50"
        disabled={isEncrypted}
        defaultValue=""
      >
        <option value="">Font</option>
        <option value="Arial">Arial</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Courier New">Courier New</option>
        <option value="Georgia">Georgia</option>
        <option value="Verdana">Verdana</option>
        <option value="Comic Sans MS">Comic Sans MS</option>
        <option value="Trebuchet MS">Trebuchet MS</option>
        <option value="Impact">Impact</option>
        <option value="Lucida Console">Lucida Console</option>
      </select>

      <div className="w-px bg-border mx-1"></div>

      <ToolbarButton title="Bold" onClick={() => onApplyFormat("bold")} disabled={isEncrypted}>
        <strong>B</strong>
      </ToolbarButton>

      <ToolbarButton title="Italic" onClick={() => onApplyFormat("italic")} disabled={isEncrypted}>
        <em>I</em>
      </ToolbarButton>

      <ToolbarButton title="Underline" onClick={() => onApplyFormat("underline")} disabled={isEncrypted}>
        <u>U</u>
      </ToolbarButton>

      <ToolbarButton title="Strikethrough" onClick={() => onApplyFormat("strikethrough")} disabled={isEncrypted}>
        <s>S</s>
      </ToolbarButton>

      <div className="w-px bg-border mx-1"></div>

      <ToolbarButton title="Align Left" onClick={() => onApplyFormat("justifyLeft")} disabled={isEncrypted}>
        ⬅
      </ToolbarButton>

      <ToolbarButton title="Align Center" onClick={() => onApplyFormat("justifyCenter")} disabled={isEncrypted}>
        ⬌
      </ToolbarButton>

      <ToolbarButton title="Align Right" onClick={() => onApplyFormat("justifyRight")} disabled={isEncrypted}>
        ➡
      </ToolbarButton>

      <div className="w-px bg-border mx-1"></div>

      <ToolbarButton title="Bullet List" onClick={handleBulletList} disabled={isEncrypted}>
        • List
      </ToolbarButton>

      <ToolbarButton title="Numbered List" onClick={handleNumberedList} disabled={isEncrypted}>
        1. List
      </ToolbarButton>

      <div className="w-px bg-border mx-1"></div>

      <ToolbarButton title="Glossary Terms" onClick={onToggleGlossary} disabled={isEncrypted}>
        📚
      </ToolbarButton>

      <input
        type="color"
        onChange={(e) => onApplyFormat("foreColor", e.target.value)}
        className="w-8 h-8 border border-border rounded cursor-pointer disabled:opacity-50"
        disabled={isEncrypted}
        title="Text Color"
      />

      <select
        onChange={(e) => onApplyFormat("fontSize", e.target.value)}
        className="px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:border-primary text-foreground disabled:opacity-50"
        disabled={isEncrypted}
      >
        <option value="">Font Size</option>
        <option value="1">Small</option>
        <option value="3">Normal</option>
        <option value="5">Large</option>
        <option value="7">Huge</option>
      </select>

      <ToolbarButton title="Remove Formatting" onClick={() => onApplyFormat("removeFormat")} disabled={isEncrypted}>
        ⌫
      </ToolbarButton>
    </div>
  )
}

function ToolbarButton({ title, onClick, children, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="px-2 py-1 bg-muted hover:bg-muted/80 border border-border rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-muted text-foreground"
    >
      {children}
    </button>
  )
}
