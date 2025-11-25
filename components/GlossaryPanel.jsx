"use client"

import { useState } from "react"
import { extractTermsFromText, getDefinition } from "@/lib/glossary"

export default function GlossaryPanel({ content, onClose }) {
  const terms = extractTermsFromText(content)

  if (terms.length === 0) {
    return (
      <div className="border-t border-border bg-surface p-4">
        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 text-foreground">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Glossary Terms (0)
        </h4>
        <p className="text-xs text-muted-foreground">No glossary terms found in this note</p>
      </div>
    )
  }

  return (
    <div className="border-t border-border bg-surface p-4 max-h-48 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Glossary Terms ({terms.length})
        </h4>
        <button
          onClick={onClose}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        {terms.map((term, idx) => (
          <div key={idx} className="p-3 bg-blue-100 rounded-lg border-l-4 border-blue-500">
            <div className="font-semibold text-blue-900 capitalize text-sm">{term}</div>
            <div className="text-xs text-blue-800 mt-1">{getDefinition(term)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
