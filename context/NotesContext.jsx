"use client"

import { createContext, useContext, useState, useEffect } from "react"
import CryptoJS from "crypto-js"

const NotesContext = createContext()

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([])
  const [currentNote, setCurrentNote] = useState(null)
  const [decryptRequestNoteId, setDecryptRequestNoteId] = useState(null)

  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = () => {
    try {
      const stored = localStorage.getItem("noteflow_notes")
      if (stored) {
        const parsedNotes = JSON.parse(stored)
        setNotes(parsedNotes.map((note) => new Note(note)))
      } else {
        createNote()
      }
    } catch (error) {
      console.error("Failed to load notes:", error)
      createNote()
    }
  }

  const saveNotes = (updatedNotes) => {
    try {
      const notesToSave = updatedNotes.map((n) => {
        if (n instanceof Note) {
          return n.toJSON()
        }
        return n
      })
      localStorage.setItem("noteflow_notes", JSON.stringify(notesToSave))
    } catch (error) {
      console.error("Failed to save notes:", error)
    }
  }

  const createNote = () => {
    const newNote = new Note({
      id: Date.now().toString(),
      title: "",
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      summary: "",
      isPinned: false,
      isEncrypted: false,
    })

    const updatedNotes = [newNote, ...notes]
    setNotes(updatedNotes)
    setCurrentNote(newNote)
    saveNotes(updatedNotes)
  }

  const updateNote = (noteId, updates) => {
    const updatedNotes = notes.map((note) => {
      if (note.id === noteId) {
        const noteData = note instanceof Note ? note.toJSON() : note
        const updated = new Note({
          ...noteData,
          ...updates,
          updatedAt: new Date().toISOString(),
        })

        if (noteId === currentNote?.id) {
          setCurrentNote(updated)
        }

        return updated
      }
      return note
    })

    setNotes(updatedNotes)
    saveNotes(updatedNotes)
  }

  const deleteNote = (noteId) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId)
    setNotes(updatedNotes)

    if (currentNote?.id === noteId) {
      setCurrentNote(updatedNotes[0] || null)
      if (updatedNotes.length === 0) {
        createNote()
      }
    }

    saveNotes(updatedNotes)
  }

  const selectNote = (noteId) => {
    if (
      currentNote &&
      currentNote.id !== noteId &&
      currentNote.isDecrypted &&
      currentNote.isEncrypted &&
      currentNote.encryptionPassword
    ) {
      const encryptedContent = currentNote.encryptContent(currentNote.encryptionPassword)
      const updatedNotes = notes.map((n) => {
        if (n.id === currentNote.id) {
          return new Note({
            ...n.toJSON(),
            content: encryptedContent,
            isDecrypted: false,
          })
        }
        return n
      })
      setNotes(updatedNotes)
      saveNotes(updatedNotes)
    }

    const note = notes.find((n) => n.id === noteId)
    if (note) {
      setCurrentNote(note)
    }
  }

  const togglePin = (noteId) => {
    const note = notes.find((n) => n.id === noteId)
    if (note) {
      updateNote(noteId, { isPinned: !note.isPinned })
    }
  }

  return (
    <NotesContext.Provider
      value={{
        notes,
        currentNote,
        createNote,
        updateNote,
        deleteNote,
        selectNote,
        togglePin,
        decryptRequestNoteId,
        setDecryptRequestNoteId,
      }}
    >
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes() {
  const context = useContext(NotesContext)
  if (!context) {
    throw new Error("useNotes must be used within NotesProvider")
  }
  return context
}

class Note {
  constructor(data) {
    this.id = data.id
    this.title = data.title || ""
    this.content = data.content || ""
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.tags = data.tags || []
    this.summary = data.summary || ""
    this.isPinned = data.isPinned || false
    this.isEncrypted = data.isEncrypted || false
    this.isDecrypted = data.isDecrypted || false
    this.encryptionPassword = data.encryptionPassword || null
  }

  encryptContent(password) {
    const encrypted = CryptoJS.AES.encrypt(this.content, password).toString()
    return encrypted
  }

  decryptContent(password) {
    if (!this.isEncrypted) {
      throw new Error("Note is not encrypted")
    }

    try {
      const decrypted = CryptoJS.AES.decrypt(this.content, password).toString(CryptoJS.enc.Utf8)

      // Check if decryption was successful by validating the output
      if (decrypted === null || decrypted === undefined || decrypted.length === 0) {
        throw new Error("Incorrect password")
      }

      return decrypted
    } catch (error) {
      if (error.message === "Incorrect password") {
        throw error
      }
      // If decryption failed completely, password was wrong
      throw new Error("Incorrect password")
    }
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      tags: this.tags,
      summary: this.summary,
      isPinned: this.isPinned,
      isEncrypted: this.isEncrypted,
      isDecrypted: this.isDecrypted,
      encryptionPassword: this.encryptionPassword,
    }
  }
}
