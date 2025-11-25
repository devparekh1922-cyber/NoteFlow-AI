"use client"

import { useState, useEffect } from "react"
import NotesList from "@/components/NotesList"
import Editor from "@/components/Editor"
import Header from "@/components/Header"
import { NotesProvider } from "@/context/NotesContext"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <NotesProvider>
      <div className="flex flex-col h-screen bg-background text-text">
        <Header />
        <div className="flex flex-1 overflow-hidden gap-0 md:gap-4 md:p-4">
          <aside className="hidden md:flex md:flex-col md:w-64 lg:w-72 bg-surface border border-border rounded-lg overflow-hidden">
            <NotesList />
          </aside>

          <main className="flex-1 flex flex-col md:rounded-lg md:border md:border-border md:bg-surface overflow-hidden">
            <Editor />
          </main>
        </div>
      </div>
    </NotesProvider>
  )
}
