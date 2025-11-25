"use client"

import { useState } from "react"
import { useNotes } from "@/context/NotesContext"
import MobileMenu from "./MobileMenu"

export default function Header() {
  const { notes } = useNotes()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="bg-surface border-b border-border px-4 py-4 md:px-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">NoteFlow AI</h1>
            <p className="text-xs text-text-light">Intelligent note-taking</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 text-sm">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
            {notes.length} note{notes.length !== 1 ? "s" : ""}
          </span>
        </div>

        <button
          className="md:hidden p-2 hover:bg-border rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {isMobileMenuOpen && <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />}
      </div>
    </header>
  )
}
