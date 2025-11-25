"use client"

import { useState } from "react"
import { useNotes } from "@/context/NotesContext"

export default function NotesList({ onSelectNote }) {
  const { notes, currentNote, createNote, deleteNote, selectNote, togglePin, setDecryptRequestNoteId } = useNotes()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recent")

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.updatedAt) - new Date(a.updatedAt)
    } else if (sortBy === "oldest") {
      return new Date(a.updatedAt) - new Date(b.updatedAt)
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title)
    }
    return 0
  })

  const pinnedNotes = sortedNotes.filter((n) => n.isPinned)
  const unpinnedNotes = sortedNotes.filter((n) => !n.isPinned)

  const handleSelectNote = (noteId) => {
    selectNote(noteId)
    onSelectNote && onSelectNote()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border space-y-3">
        <input
          type="text"
          placeholder="Search notes..."
          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="recent">Most Recent</option>
          <option value="oldest">Oldest First</option>
          <option value="title">By Title</option>
        </select>

        <button
          onClick={() => createNote()}
          className="w-full px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors text-sm"
        >
          + New Note
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {pinnedNotes.length > 0 && (
          <div>
            <div className="px-4 py-2 text-xs font-semibold text-text-light uppercase tracking-wider">Pinned</div>
            {pinnedNotes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                isActive={currentNote?.id === note.id}
                onSelect={handleSelectNote}
                onTogglePin={togglePin}
                onDelete={deleteNote}
                selectNote={selectNote}
                setDecryptRequestNoteId={setDecryptRequestNoteId}
              />
            ))}
          </div>
        )}

        {unpinnedNotes.length > 0 && (
          <div>
            <div className="px-4 py-2 text-xs font-semibold text-text-light uppercase tracking-wider">Notes</div>
            {unpinnedNotes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                isActive={currentNote?.id === note.id}
                onSelect={handleSelectNote}
                onTogglePin={togglePin}
                onDelete={deleteNote}
                selectNote={selectNote}
                setDecryptRequestNoteId={setDecryptRequestNoteId}
              />
            ))}
          </div>
        )}

        {filteredNotes.length === 0 && (
          <div className="p-4 text-center text-text-light text-sm">
            {searchTerm ? "No notes found" : "No notes yet. Create one!"}
          </div>
        )}
      </div>
    </div>
  )
}

function NoteItem({ note, isActive, onSelect, onTogglePin, onDelete, selectNote, setDecryptRequestNoteId }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  // Clean up HTML tags and &nbsp; entities
  const cleanContent = note.content
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  
  const preview = note.isEncrypted && !note.isDecrypted ? "🔒 Click to unlock" : cleanContent.substring(0, 50)
  const date = new Date(note.updatedAt).toLocaleDateString()

  // When decrypt button is clicked, set the flag and select the note
  const handleDecryptClick = (e) => {
    e.stopPropagation()
    setDecryptRequestNoteId(note.id)
    selectNote(note.id)
  }

  const handleNoteSelect = (noteId) => {
    // Regular selection - don't trigger password prompt
    onSelect(noteId)
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    onDelete(note.id)
    setShowDeleteConfirm(false)
  }

  return (
    <>
      <div
        className={`px-4 py-3 border-l-4 cursor-pointer transition-colors hover:bg-background/50 ${
          isActive ? "border-l-primary bg-background/50" : "border-l-transparent"
        }`}
        onClick={() => handleNoteSelect(note.id)}
      >
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{note.title || "Untitled"}</h3>
          <p className="text-xs text-text-light truncate">{preview || "Empty note"}</p>
          <p className="text-xs text-text-light mt-1">{date}</p>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onTogglePin(note.id)
            }}
            className={`p-1.5 rounded transition-all ${
              note.isPinned 
                ? "bg-primary/20 hover:bg-primary/30 text-primary shadow-sm" 
                : "hover:bg-primary/10 text-muted-foreground hover:text-primary"
            }`}
            title={note.isPinned ? "Unpin" : "Pin"}
          >
            {note.isPinned ? (
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.429 5.951 1.429a1 1 0 001.169-1.409l-7-14z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h6a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            )}
          </button>
          {note.isEncrypted && !note.isDecrypted && (
            <button
              onClick={handleDecryptClick}
              className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors text-blue-600 dark:text-blue-400"
              title="Decrypt and view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          )}
          <button
            onClick={handleDeleteClick}
            className="p-1 hover:bg-error/10 rounded transition-colors text-error"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
      {note.isEncrypted && (
        <div className="flex items-center gap-1 mt-2 text-xs text-primary">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            />
          </svg>
          Encrypted
        </div>
      )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-lg shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold mb-4 text-foreground">Delete Note</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete this note? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
