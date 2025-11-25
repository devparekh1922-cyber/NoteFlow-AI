# NoteFlow AI - Intelligent Note-Taking Application

A powerful, modern note-taking application with AI-powered features, encryption, and rich text editing capabilities. Built with Next.js 16, React 19, and TypeScript.

## 🌟 Features

### Core Features
- ✅ **Rich Text Editor** - Full-featured editor with formatting, colors, fonts, and lists
- ✅ **9 Font Options** - Arial, Times New Roman, Courier New, Georgia, Verdana, Comic Sans MS, Trebuchet MS, Impact, Lucida Console
- ✅ **Note Management** - Create, edit, delete, pin, search, and sort notes
- ✅ **Real-time Save** - Auto-save with explicit save button for confirmation
- ✅ **Dark/Light Theme** - Seamless theme switching with CSS variables

### AI-Powered Features
- 🤖 **Smart Summarization** - AI-powered note summarization using Groq API
- 🌍 **Multi-Language Translation** - Translate notes to 8 languages (Spanish, French, German, Italian, Portuguese, Japanese, Chinese, Korean)
- 🏷️ **Automatic Tag Generation** - AI-generated tags with keyword extraction
- ✨ **Grammar Checking** - Built-in grammar checking with pattern-based rules

### Security Features
- 🔐 **AES Password Encryption** - Military-grade encryption for sensitive notes
- 👁️ **Password Visibility Toggle** - Show/hide password while typing
- 🔒 **Encrypted Note Lock** - Locked encrypted notes require password to unlock
- 🛡️ **Remove Encryption** - Safely remove encryption from notes

### Smart Features
- 📚 **30+ Term Glossary** - Auto-highlighting of glossary terms with definitions
- 📌 **Pin Important Notes** - Pin notes to keep them at the top
- 🔍 **Smart Search** - Search across titles and content
- 📊 **Multiple Sort Options** - Sort by recent, oldest, or alphabetical

### User Experience
- 📱 **Responsive Design** - Perfect on desktop, tablet, and mobile
- ⚡ **Instant Load** - Fast performance with optimized React components
- 💾 **Persistent Storage** - All data saved to browser localStorage
- 🎨 **Modern UI** - Clean, intuitive interface with Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (download from [nodejs.org](https://nodejs.org))
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd note-flow-ai-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables**
   ```bash
   # Create .env.local file in the root directory
   echo NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here > .env.local
   ```

4. **Get Groq API Key**
   - Visit [console.groq.com](https://console.groq.com)
   - Sign up for free (no credit card required)
   - Create an API key
   - Copy it to `.env.local`

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   - Navigate to http://localhost:3000
   - Start taking notes!

## 📦 Project Structure

```
note-flow-ai-app/
├── app/
│   ├── api/
│   │   └── ai/
│   │       ├── summarize/route.js      # Summarization API
│   │       └── translate/route.js      # Translation API
│   ├── page.jsx                        # Main page
│   └── layout.jsx                      # Root layout
├── components/
│   ├── Editor.jsx                      # Main editor with controls
│   ├── RichTextEditor.jsx              # Rich text editing component
│   ├── NotesList.jsx                   # Notes list with search
│   ├── AIPanel.jsx                     # AI tools modal
│   ├── EncryptionModal.jsx             # Encryption management
│   ├── Header.jsx                      # App header
│   ├── GrammarChecker.jsx              # Grammar checking
│   ├── GlossaryPanel.jsx               # Glossary display
│   └── ui/
│       └── button.tsx                  # UI components
├── context/
│   └── NotesContext.jsx                # Global state management
├── lib/
│   └── glossary.js                     # Glossary database
├── styles/
│   └── globals.css                     # Global styles
└── public/                             # Static assets

```

## 🛠️ Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS with CSS Variables
- **State Management**: React Context API
- **Encryption**: CryptoJS (AES)
- **AI**: Groq API (Llama 3.1)
- **Icons**: Lucide React
- **Storage**: Browser localStorage

## 📝 How to Use

### Creating Notes
1. Click **"+ New Note"** button in the left sidebar
2. Enter a title in the editor
3. Start typing your content in the rich text editor
4. Changes auto-save to your browser

### Editing & Formatting
- **Bold/Italic/Underline**: Use toolbar buttons
- **Font Selection**: Choose from 9 different fonts
- **Colors**: Change text and background colors
- **Lists**: Create bullet points or numbered lists
- **Links/Headers**: Full HTML support

### Using AI Features
1. Click **"AI Tools"** button
2. Choose a tab:
   - **Summarize** - Get a quick summary of your note
   - **Translate** - Translate to another language
   - **Generate Tags** - Auto-generate tags for your note
3. View results in the modal

### Encrypting Notes
1. Click **"Encrypt"** button
2. Enter a secure password
3. Click **"Confirm"** to encrypt
4. Note is now password-protected
5. To decrypt: Click note → Enter password

### Searching & Sorting
- Use the **search bar** to find notes by title or content
- Select a **sort option**: Most Recent, Oldest First, or By Title
- **Pin notes** to keep important ones at the top

### Grammar & Glossary
- Grammar errors are highlighted in the editor
- Toggle **"Glossary"** to highlight important terms
- Hover over glossary terms to see definitions

### Saving
- Notes auto-save as you type
- Click **"Save Changes"** button for explicit save confirmation
- Button changes color:
  - 🔴 Red = Unsaved changes
  - 🟡 Yellow = Currently saving
  - 🟢 Green = Saved successfully

## 🔐 Security & Privacy

- **All data is stored locally** in your browser
- **No data is sent to servers** (except AI API calls)
- **Passwords are never stored** - only used to encrypt/decrypt
- **Encryption is client-side** - we never see your data
- **Clear browser data** to completely delete all notes

## 🌍 Supported Languages

- Spanish (Español)
- French (Français)
- German (Deutsch)
- Italian (Italiano)
- Portuguese (Português)
- Japanese (日本語)
- Chinese (中文)
- Korean (한국어)

## 📚 Glossary Terms

The app includes 30+ technical and general terms with auto-highlighting:
- **Technology**: AI, Machine Learning, Algorithm, API, Database, Cloud, Encryption
- **Science**: Photosynthesis, Ecosystem, Coral Reef, Biodiversity, Climate Change
- **Business**: Revenue, Profit, Investment, Startup, Market
- **General**: Sustainable, Innovation, Strategy, Solution, Challenge

## 🚀 Deployment

### Deploy to Vercel (Recommended)

**Easiest Option - 1 Click Deploy**

1. **Connect Repository**
   - Push your code to GitHub
   - Visit [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository

2. **Add Environment Variables**
   - In Vercel dashboard → Project Settings → Environment Variables
   - Add: `NEXT_PUBLIC_GROQ_API_KEY` = your Groq API key
   - Deploy

3. **Done!**
   - Your app is live at `your-project.vercel.app`

### Deploy to Other Platforms

**Netlify**
```bash
npm run build
# Upload `out` folder to Netlify
```

**Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Traditional VPS/Server**
```bash
# Build production version
npm run build

# Start production server
npm start

# Use PM2 for process management
npm install -g pm2
pm2 start npm --name "noteflow" -- start
```

## 🔧 Environment Setup

### Development
```bash
npm run dev
# App runs on http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
# App runs on http://localhost:3000
```

### Environment Variables
Create `.env.local` file:
```
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
```

## 📊 API Endpoints

All API endpoints are local to your app:

- `POST /api/ai/summarize` - Summarize note content
- `POST /api/ai/translate` - Translate text to target language

Example:
```bash
curl -X POST http://localhost:3000/api/ai/summarize \
  -H "Content-Type: application/json" \
  -d '{"content": "your note content"}'
```

## 🐛 Troubleshooting

### Issue: "API key not found"
- Check `.env.local` file exists in root directory
- Verify `NEXT_PUBLIC_GROQ_API_KEY` is set correctly
- Restart dev server after adding env variable

### Issue: Notes not saving
- Check browser localStorage isn't disabled
- Clear browser cache and try again
- Check browser console for errors

### Issue: Encryption not working
- Ensure password is entered correctly (case-sensitive)
- Try a different browser
- Clear browser cache

### Issue: AI features returning errors
- Check internet connection
- Verify Groq API key is valid
- Check Groq API status at [status.groq.com](https://status.groq.com)

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 Customization

### Change Theme Colors
Edit `globals.css`:
```css
:root {
  --primary: #3b82f6;
  --background: #ffffff;
  /* ... other variables */
}
```

### Modify Glossary Terms
Edit `lib/glossary.js` to add/remove terms and definitions.

### Add Custom Fonts
Edit `RichTextEditor.jsx` font dropdown to include more fonts.

## 📄 License

This project is open source. Feel free to use, modify, and distribute.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## 📞 Support

- Check existing issues on GitHub
- Create a new issue with detailed description
- Include screenshots/error messages when reporting bugs

## 🎯 Roadmap

- [ ] Cloud sync across devices
- [ ] Collaborative editing
- [ ] Mobile app (React Native)
- [ ] Custom themes
- [ ] Voice-to-text
- [ ] Export to PDF/Word
- [ ] Dark mode improvements
- [ ] Offline support with PWA

## 🎉 Getting Started

1. Install Node.js 18+
2. Clone repository
3. Run `npm install`
4. Create `.env.local` with Groq API key
5. Run `npm run dev`
6. Open http://localhost:3000
7. Start taking intelligent notes!

---

**Made with ❤️ by NoteFlow AI Team**

Last Updated: November 25, 2025
