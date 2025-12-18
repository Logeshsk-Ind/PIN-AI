<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🎯 PIN AI - Personal Indian AI Studio

PIN AI is a sophisticated, multi-modal AI assistant built with React, TypeScript, and Google's Gemini API. It features advanced chat capabilities, media generation, office automation, and personalized recommendations—all with multilingual support for Indian languages.

## ✨ Features

### 🤖 Core Features
- **Chat Interface**: Smart chat with dual modes (General & Coding)
- **Image Generation**: Create images using AI
- **Video Generation**: Generate videos with advanced AI models
- **Text-to-Speech**: Convert text to natural speech
- **Media Studio**: All-in-one media generation hub
- **Office Assistant**: Formal reply drafting & presentation generation
- **Life Coach**: Personalized news, fitness, and developer digests

### 🌐 Multilingual Support
- English, Tamil, Telugu, Kannada, Malayalam, Hindi
- Auto-language detection
- Context-aware translations

### 🏗️ Architecture Highlights
- **Type-Safe**: Full TypeScript with strict mode
- **Component-Based**: Modular React components
- **Error Handling**: Comprehensive error boundaries and API error management
- **Performance**: Optimized builds with code splitting
- **Accessibility**: ARIA labels and semantic HTML

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/logeshsk-ind/PIN-AI.git
cd PIN-AI
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local and add your API key
# Get your API key from: https://aistudio.google.com/apikey
```

4. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to view your app.

## 📝 Environment Setup

Create a `.env.local` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_AI_STUDIO_API_KEY=optional_for_video_generation
```

## 🛠️ Available Scripts

```bash
# Development server (with hot reload)
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Preview production build locally
npm run preview
```

## 📁 Project Structure

```
PIN-AI/
├── components/
│   ├── ChatInterface.tsx    # Main chat UI with dual modes
│   ├── MediaStudio.tsx      # Image, video, audio generation
│   ├── OfficeAssistant.tsx  # Formal replies & presentations
│   ├── LifeCoach.tsx        # Personalized recommendations
│   └── Layout.tsx           # Navigation & layout
├── services/
│   └── geminiService.ts     # Gemini API integration
├── types.ts                 # TypeScript interfaces & enums
├── App.tsx                  # Main app with error boundary
├── index.tsx                # React entry point
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

## 🔑 Key Components

### ChatInterface
- Dual-mode chat (General & Coding focus)
- Real-time streaming responses
- Image generation support
- Syntax-highlighted code blocks
- Grounding URLs from web search

### MediaStudio
- Image generation from text
- Video generation (requires AI Studio)
- Text-to-speech audio generation
- Download and playback capabilities

### OfficeAssistant
- Formal reply generation (WhatsApp, LinkedIn, Email, Slack)
- Presentation outline generation
- Adjustable tone (Professional, Friendly, Direct, Apologetic, Persuasive)

### LifeCoach
- Daily news briefing
- Personalized fitness routines
- Developer digest with trending tech
- Text-to-speech playback
- Customizable interests

## 🎨 UI/UX Features

- **Dark Theme**: Easy on the eyes with teal, orange, and purple accents
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Accessibility**: Full keyboard navigation and screen reader support
- **Smooth Animations**: Subtle transitions and loading states
- **Real-time Feedback**: Immediate visual feedback for all interactions

## 🔐 Security & Best Practices

- **API Key Protection**: Never commit `.env.local` to git
- **Error Boundaries**: Graceful error handling
- **Rate Limiting**: Handled by service layer
- **Type Safety**: Strict TypeScript configuration
- **Input Validation**: All user inputs validated

## 🚀 Deployment

### Production Build
```bash
npm run build
```

The optimized build will be in the `dist/` folder.

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
# Install CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

## 📊 Performance

- **Code Splitting**: Separate chunks for core, UI, and Gemini modules
- **Lazy Loading**: Components load on-demand
- **Optimized Images**: Compressed and cached
- **Tree Shaking**: Unused code is removed in production
- **Minification**: Full production optimization

## 🐛 Troubleshooting

### API Key Issues
- Verify `VITE_GEMINI_API_KEY` is set correctly in `.env.local`
- Ensure API key has permissions for Gemini models
- Check rate limits at https://aistudio.google.com

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear cache: `npm run build -- --reset-cache`

### Runtime Errors
- Check browser console for detailed error messages
- Verify network connectivity
- Ensure all dependencies are installed: `npm install`

## 🤝 Contributing

Contributions are welcome! Please ensure:
- TypeScript types are properly defined
- Components follow the established patterns
- Error handling is comprehensive
- All changes are tested

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👨‍💻 Creator

**Logesh** - Personal Indian AI (PIN AI)
- Website: https://logeshsk-ind.github.io/Web/
- GitHub: https://github.com/logeshsk-ind

## 🙏 Acknowledgments

- Google Gemini API
- React Community
- TypeScript Team
- All contributors and testers

---

<div align="center">
  <p>
    <strong>Made with ❤️ for the Indian developer community</strong>
  </p>
  <p>
    <a href="https://logeshsk-ind.github.io/Web/">Visit Creator's Website</a> • 
    <a href="https://github.com/logeshsk-ind/PIN-AI">GitHub Repository</a>
  </p>
</div>
