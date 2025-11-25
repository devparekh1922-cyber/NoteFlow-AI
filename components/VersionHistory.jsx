"use client"

import { useState } from "react"

export default function VersionHistory({ note, onClose, onRestore }) {
  const [selectedVersion, setSelectedVersion] = useState(null)

  const versions = note.versions || []

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-300 rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-hidden flex flex-col">
        <div className="border-b border-gray-300 p-4 flex items-center justify-between bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Version History</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded text-sm text-gray-600">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-white">
          {versions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No version history yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {versions.map((version, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedVersion(idx)}
                  className={`p-4 cursor-pointer hover:bg-blue-50 transition-colors ${
                    selectedVersion === idx ? "bg-blue-100 border-l-4 border-l-blue-600" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">v{versions.length - idx}</span>
                    <span className="text-xs text-gray-500">{new Date(version.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-700 truncate">{version.title || "Untitled"}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedVersion !== null && (
          <div className="border-t border-gray-300 p-4 flex gap-2 bg-gray-50">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-900 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => onRestore(versions[selectedVersion])}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Restore Selected Version
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
