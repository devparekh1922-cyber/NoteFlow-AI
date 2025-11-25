"use client"

import { useState } from "react"
import { getDefinition } from "@/lib/glossary"

export default function GlossaryTooltip({ term, children }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 })

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltipPos({
      top: rect.bottom + window.scrollY + 5,
      left: rect.left + window.scrollX,
    })
    setShowTooltip(true)
  }

  const handleMouseLeave = () => {
    setShowTooltip(false)
  }

  const definition = getDefinition(term)

  return (
    <>
      <mark
        className="glossary-highlight cursor-help"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setShowTooltip(!showTooltip)}
      >
        {children}
      </mark>

      {showTooltip && (
        <div
          className="fixed z-50 bg-blue-900 text-white px-4 py-3 rounded-lg shadow-lg max-w-xs text-sm border-2 border-blue-500"
          style={{
            top: `${tooltipPos.top}px`,
            left: `${tooltipPos.left}px`,
          }}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="font-bold text-blue-200 mb-1 capitalize">{term}</div>
          <div>{definition}</div>
          <div className="text-xs text-blue-300 mt-2 italic">Click to close</div>
        </div>
      )}
    </>
  )
}
