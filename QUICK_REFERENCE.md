# ⚡ QUICK REFERENCE - 5 Minute Read

**Project**: NoteFlow-AI  
**Status**: Fully deployed (Vercel) + working locally  
**Duration to explain**: 3-5 minutes

---

## The Elevator Pitch

"NoteFlow-AI is a Next.js web app for encrypted note-taking with AI features. Users write notes, optionally encrypt them with passwords (client-side AES encryption), and can use AI to summarize, translate, or tag their content. Built with React Context API, localStorage persistence, and integrated with Groq API for AI."

---

## Quick Facts

| Aspect | Answer |
|--------|--------|
| **Frontend Framework** | React 19.2 with Next.js 16.0.3 |
| **State Management** | React Context API + localStorage |
| **Encryption** | CryptoJS AES (client-side, password never leaves browser) |
| **AI Integration** | Groq API (llama-3.1-8b-instant model) |
| **Styling** | Tailwind CSS + Radix UI components |
| **Backend** | Next.js API routes (/api/ai/*) |
| **Deployment** | Vercel (auto-deploys from GitHub) |
| **Data Storage** | Browser localStorage (~5-10MB) |

---

## Core Features

1. **Create/Edit Notes**
   - Rich text editor
   - Auto-save to localStorage
   - Real-time save status indicator

2. **Encryption**
   - Optional password protection
   - AES encryption (CryptoJS)
   - Password prompt on decrypt
   - Wrong password = "Invalid password" error

3. **AI Features** (via Groq API)
   - **Summarize**: Condense long notes to 2-3 sentences
   - **Translate**: Convert to Spanish, French, German, etc.
   - **Generate Tags**: Auto-create tags for categorization

4. **Persistence**
   - All data saved to localStorage
   - Survives browser refresh
   - ~5-10MB storage limit

---

## Architecture in 3 Diagrams

### Data Flow
```
User Input → Editor Component → NotesContext (state management)
    ↓
localStorage (persistence) + Groq API (AI features)
    ↓
AIPanel Component (displays results)
```

### Encryption Flow
```
Note Content + Password
    ↓
CryptoJS.AES.encrypt() [client-side]
    ↓
Encrypted string saved to localStorage
    ↓
[On read] Prompt for password → Decrypt → Display
```

### File Structure
```
note-flow-ai-app/
├── app/
│   └── api/ai/
│       ├── summarize/route.js
│       ├── translate/route.js
│       └── generate-tags/route.js
├── components/
│   ├── AIPanel.jsx
│   ├── Editor.jsx
│   └── ...
├── context/
│   └── NotesContext.jsx (global state)
├── .env.local (GROQ_API_KEY)
└── package.json
```

---

## Key Technologies Explained

**Why React Context API?**
- Only 3-4 pieces of global state (notes, currentNote, password, isEncrypted)
- Redux would be overkill for MVP
- Lightweight, built-in to React

**Why Client-Side Encryption?**
- Password never sent to server (security best practice)
- User data remains private even from server
- No backend database needed

**Why Groq API?**
- Free tier available for development
- Fast, cheap inference for note summarization/translation
- API key stored in .env.local (localhost) and Vercel dashboard (production)

**Why localStorage?**
- MVP simplicity - no backend database setup needed
- Immediate persistence without network calls
- Acknowledged limitation: ~5-10MB per domain

---

## Common Interview Questions - Quick Answers

**Q: "How do you handle state?"**  
A: React Context API. I have a NotesContext that manages notes array, currentNote, and encryption state. It uses localStorage for persistence, so all changes auto-save. Context is overkill-free for this MVP.

**Q: "How is the app secured?"**  
A: Passwords never leave the browser - I use CryptoJS for client-side AES encryption. The API key for Groq is stored in environment variables. User data in localStorage is encrypted if the user chooses to encrypt notes.

**Q: "Why Next.js?"**  
A: It provides both frontend (React) and backend (API routes) in one framework. I use API routes for server-side Groq API calls so the API key isn't exposed to the client.

**Q: "What's your deployment setup?"**  
A: Deployed on Vercel. GitHub integration means code pushes auto-trigger deployments. Environment variables (like GROQ_API_KEY) are set in Vercel dashboard.

**Q: "What would you do differently at scale?"**  
A: Replace localStorage with a real database (PostgreSQL), add user authentication, move AI features to a backend service for cost control, add caching, implement proper error tracking (Sentry).

---

## Top 3 Things to Emphasize

1. **Full-Stack**: You built frontend (React) AND backend (API routes) - not just UI
2. **Security-First**: Client-side encryption is a deliberate architectural choice
3. **AI Integration**: You integrated a real AI API - shows ability to work with external services

---

## If They Ask "Show Me the Code"

Key files to navigate to:
- **Global State**: `/context/NotesContext.jsx` - shows your state management pattern
- **Main UI**: `/components/Editor.jsx` - shows how components interact
- **Encryption**: In `Note` class inside `NotesContext.jsx` - shows security implementation
- **API Integration**: `/app/api/ai/summarize/route.js` - shows backend logic

---

## Potential Red Flags to Avoid

❌ **Don't say**: "I just followed a tutorial"  
✅ **Do say**: "I architected this with Context API because..."

❌ **Don't say**: "I don't know how to explain encryption"  
✅ **Do say**: "I use CryptoJS to encrypt client-side so passwords never leave the browser"

❌ **Don't say**: "I stored the API key on the frontend"  
✅ **Do say**: "I store it in .env.local locally and Vercel environment variables in production"

---

## Numbers to Remember

- **React Version**: 19.2
- **Next.js Version**: 16.0.3
- **Local Storage Limit**: ~5-10MB per domain
- **AI Model**: llama-3.1-8b-instant (Groq)
- **Deployment**: Vercel

---

## Your Confidence Statement

Say this to yourself:
> "I built a full-stack application with React, Next.js, client-side encryption, AI integration, and deployed it to production. I understand every file and can explain architectural decisions. I'm ready."

---

**Next**: If time permits, read INTERVIEW_PREP.md for deeper knowledge.
