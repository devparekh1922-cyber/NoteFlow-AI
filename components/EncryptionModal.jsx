"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export default function EncryptionModal({ note, onClose, onEncrypt, onRemoveEncryption }) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleEncrypt = () => {
    if (!password) {
      setError("Please enter a password")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters")
      return
    }

    onEncrypt(password)
  }

  const handleRemoveEncryption = () => {
    if (confirm("Remove encryption from this note? It will be visible to anyone with access.")) {
      onRemoveEncryption()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-lg shadow-xl max-w-sm w-full p-6">
        <h3 className="text-lg font-bold mb-4 text-foreground">
          {note.isEncrypted ? "Manage Encryption" : "Encrypt Note"}
        </h3>

        {note.isEncrypted ? (
          <>
            <p className="text-sm text-muted-foreground mb-4">This note is encrypted and password-protected.</p>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-foreground"
              >
                Close
              </button>
              <button
                onClick={handleRemoveEncryption}
                className="flex-1 px-4 py-2 bg-destructive hover:bg-destructive/90 text-primary-foreground rounded-lg transition-colors"
              >
                Remove Encryption
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              Protect this note with a password. You'll need it to view the note later.
            </p>

            <div className="relative mb-3">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError("")
                }}
                className="w-full px-3 py-2 pr-10 border border-border rounded-lg focus:outline-none focus:border-primary bg-background text-foreground"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative mb-3">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password..."
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setError("")
                }}
                className="w-full px-3 py-2 pr-10 border border-border rounded-lg focus:outline-none focus:border-primary bg-background text-foreground"
              />
              <button
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <div className="p-2 bg-destructive/10 border border-destructive/50 rounded text-sm text-destructive mb-3">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleEncrypt}
                className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
              >
                Encrypt
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
