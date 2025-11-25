"use client"

import { useState, useEffect, useRef } from "react"
import { useNotes } from "@/context/NotesContext"
import RichTextEditor from "./RichTextEditor"
import AIPanel from "./AIPanel"
import EncryptionModal from "./EncryptionModal"

export default function Editor() {
  const { currentNote, updateNote, deleteNote, selectNote, decryptRequestNoteId, setDecryptRequestNoteId } = useNotes()
  const [title, setTitle] = useState("")
  const [showEncryptionModal, setShowEncryptionModal] = useState(false)
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [isPasswordPromptOpen, setIsPasswordPromptOpen] = useState(false)
  const [decryptedContent, setDecryptedContent] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [saveStatus, setSaveStatus] = useState("saved") // "saving", "saved", "unsaved"
  const titleInputRef = useRef(null)
  const justEncryptedRef = useRef(false)

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title)

      if (currentNote.isEncrypted && !currentNote.isDecrypted) {
        // Only auto-open password prompt if:
        // 1. User clicked decrypt button (decryptRequestNoteId matches), OR
        // 2. User just selected an encrypted note but it's not from "just encrypted"
        const shouldPrompt = decryptRequestNoteId === currentNote.id || 
                            (!justEncryptedRef.current && decryptRequestNoteId === null)
        
        if (shouldPrompt) {
          setIsPasswordPromptOpen(true)
        }
        
        setDecryptRequestNoteId(null)
        justEncryptedRef.current = false
        setDecryptedContent("")
        setPasswordError("")
      } else {
        // Display content as-is
        setDecryptedContent(currentNote.content)
        setIsPasswordPromptOpen(false)
        setDecryptRequestNoteId(null)
      }
    }
  }, [currentNote, decryptRequestNoteId, setDecryptRequestNoteId])

  const handleTitleChange = (e) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    setSaveStatus("unsaved")
    if (currentNote) {
      updateNote(currentNote.id, { title: newTitle })
    }
  }

  const handleContentChange = (newContent) => {
    setSaveStatus("unsaved")
    if (currentNote) {
      updateNote(currentNote.id, { content: newContent })
      setDecryptedContent(newContent)
    }
  }

  const handleDecryptNote = (enteredPassword) => {
    try {
      const decrypted = currentNote.decryptContent(enteredPassword)

      setDecryptedContent(decrypted)
      setPasswordError("")
      setIsPasswordPromptOpen(false)

      updateNote(currentNote.id, {
        isDecrypted: true,
        encryptionPassword: enteredPassword,
        content: decrypted,
      })
    } catch (error) {
      console.log("[v0] Decryption error:", error.message)
      setPasswordError("Incorrect password")
    }
  }

  const handleDeleteNote = () => {
    if (currentNote) {
      deleteNote(currentNote.id)
      setShowDeleteConfirm(false)
      selectNote(null)
    }
  }

  const handleSaveNote = () => {
    setSaveStatus("saving")
    // Simulate save with a small delay for UX feedback
    setTimeout(() => {
      setSaveStatus("saved")
      // Auto-revert status after 2 seconds
      setTimeout(() => setSaveStatus("saved"), 2000)
    }, 300)
  }

  if (!currentNote) {
    return (
      <div className="flex items-center justify-center h-full text-text">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-lg font-medium">Select a note to start editing</p>
          <p className="text-sm opacity-70">or create a new one</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {isPasswordPromptOpen && (
        <PasswordPrompt
          onSubmit={handleDecryptNote}
          onCancel={() => {
            setIsPasswordPromptOpen(false)
            setDecryptedContent("")
            setPasswordError("")
          }}
          error={passwordError}
        />
      )}

      <div className="border-b border-border p-4 space-y-3">
        <input
          ref={titleInputRef}
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Note title..."
          className="w-full text-2xl font-bold bg-transparent focus:outline-none text-foreground placeholder:text-muted-foreground"
        />

        <div className="flex flex-wrap items-center gap-2">
          {currentNote.summary && (
            <div className="px-4 py-3 bg-blue-100 border-2 border-blue-500 text-blue-900 text-base rounded-lg font-semibold max-w-full shadow-sm">
              💡 {currentNote.summary}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleSaveNote}
            className={`px-3 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
              saveStatus === "saving"
                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                : saveStatus === "saved"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
            }`}
            title="Save note"
          >
            {saveStatus === "saving" ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 1119.414 2.614 1 1 0 01-1.414-1.414 5.002 5.002 0 10-8.546 2.914V5a1 1 0 01-2 0V3a1 1 0 011-1z" fillRule="evenodd" />
                </svg>
                Saving...
              </>
            ) : saveStatus === "saved" ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd" />
                </svg>
                Saved
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.82 1.573l-7 10.666A1 1 0 018 15H4a3 3 0 01-3-3v-6zm14.854-2.854a1 1 0 00-1.415 0L11 11.586 8.854 9.44a1 1 0 00-1.415 1.414l3 3a1 1 0 001.415 0l7-7a1 1 0 000-1.414z" fillRule="evenodd" />
                </svg>
                Save Changes
              </>
            )}
          </button>

          <button
            onClick={() => setShowAIPanel(!showAIPanel)}
            className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.343a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM15.657 14.657a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM11 17a1 1 0 102 0v-1a1 1 0 10-2 0v1zM5.343 15.657a1 1 0 00-1.414-1.414L6.05 3.222a1 1 0 001.414 1.414l.707.707z" />
            </svg>
            AI Tools
          </button>

          {/* Encryption Buttons */}
          {!currentNote.isEncrypted ? (
            // Not encrypted - show Encrypt button
            <button
              onClick={() => setShowEncryptionModal(true)}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
              </svg>
              Encrypt
            </button>
          ) : currentNote.isDecrypted ? (
            // Encrypted and decrypted - show 2 buttons
            <>
              <button
                onClick={() => setShowEncryptionModal(true)}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                title="Re-encrypt with new password"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
                </svg>
                Encrypt
              </button>
              <button
                onClick={() => setShowRemoveConfirm(true)}
                className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                title="Remove encryption from this note"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" fillRule="evenodd" />
                </svg>
                Remove Encryption
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                title="Delete this note permanently"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" fillRule="evenodd" />
                </svg>
                Delete
              </button>
            </>
          ) : (
            // Encrypted but not decrypted - show Decrypt message
            <div className="px-3 py-2 bg-yellow-600 text-white rounded-lg font-medium text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
              </svg>
              🔒 Locked
            </div>
          )}
        </div>
      </div>

      {showAIPanel && <AIPanel note={currentNote} onUpdateNote={updateNote} onClose={() => setShowAIPanel(false)} />}

      {showRemoveConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-lg shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold mb-4 text-foreground">Remove Encryption</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to remove the password protection from this note? Anyone with access will be able to read it.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowRemoveConfirm(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateNote(currentNote.id, {
                    isEncrypted: false,
                    isDecrypted: false,
                    encryptionPassword: null,
                  })
                  setShowRemoveConfirm(false)
                }}
                className="flex-1 px-4 py-2 bg-destructive hover:bg-destructive/90 text-primary-foreground rounded-lg transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

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
                onClick={handleDeleteNote}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {showEncryptionModal && (
        <EncryptionModal
          note={currentNote}
          onClose={() => setShowEncryptionModal(false)}
          onEncrypt={(password) => {
            const encryptedContent = currentNote.encryptContent(password)
            justEncryptedRef.current = true
            updateNote(currentNote.id, {
              encryptionPassword: password,
              isEncrypted: true,
              content: encryptedContent,
              isDecrypted: false,
            })
            setShowEncryptionModal(false)
          }}
          onRemoveEncryption={() => {
            updateNote(currentNote.id, {
              isEncrypted: false,
              isDecrypted: false,
              encryptionPassword: null,
            })
            setShowEncryptionModal(false)
          }}
        />
      )}

      <div className="flex-1 overflow-hidden">
        {!isPasswordPromptOpen && (
          <RichTextEditor
            content={decryptedContent}
            onChange={handleContentChange}
            isEncrypted={currentNote.isEncrypted && !currentNote.isDecrypted}
          />
        )}
      </div>
    </div>
  )
}

function PasswordPrompt({ onSubmit, onCancel, error }) {
  const [pwd, setPwd] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-lg shadow-xl max-w-sm w-full p-6">
        <h3 className="text-lg font-bold mb-4 text-foreground">Encrypted Note</h3>
        <p className="text-sm text-muted-foreground mb-4">
          This note is password-protected. Enter the password to view it.
        </p>

        {error && (
          <div className="p-2 bg-destructive/10 border border-destructive/50 rounded text-sm text-destructive mb-3">
            {error}
          </div>
        )}

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password..."
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit(pwd)}
            autoFocus
            className="w-full px-3 py-2 pr-10 border border-border rounded-lg focus:outline-none focus:border-primary bg-background text-foreground"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(pwd)}
            className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
          >
            Unlock
          </button>
        </div>
      </div>
    </div>
  )
}
