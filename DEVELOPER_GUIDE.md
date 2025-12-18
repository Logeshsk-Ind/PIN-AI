# PIN AI Developer Guide

## 🎯 Project Overview

PIN AI is a sophisticated multi-modal AI assistant built with React, TypeScript, and Google's Gemini API. This guide helps developers understand and extend the codebase.

## 🏗️ Architecture

### Core Structure
```
services/
  └── geminiService.ts      # All Gemini API interactions
components/
  ├── App.tsx               # Main app with error boundary
  ├── ChatInterface.tsx     # Chat with dual modes
  ├── MediaStudio.tsx       # Image/Video/Audio generation
  ├── OfficeAssistant.tsx   # Replies & presentations
  ├── LifeCoach.tsx         # Personalized recommendations
  └── Layout.tsx            # Navigation & layout
types.ts                    # TypeScript definitions
```

## 🔑 Key Patterns Used

### 1. Error Handling
```typescript
// Service layer error handling
const handleApiError = (error: unknown, context: string): ApiError => {
  // Categorizes errors (API, Network, Rate Limit, etc.)
  // Returns structured error object
}

// Component error boundary
class ErrorBoundary extends React.Component {
  // Catches and handles React errors gracefully
}
```

### 2. Performance Optimization
```typescript
// Component-level optimization
const handleSend = useCallback(async (text) => {
  // Callback only recreated when dependencies change
}, [input, messages, focus]);

const suggestions = useMemo(() => [...], []); 
// Suggestions only recalculated when needed
```

### 3. Type Safety
```typescript
// Strict TypeScript with interfaces
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  // ...
}

// Enums for constants
export enum FocusMode {
  GENERAL = 'GENERAL',
  CODING = 'CODING'
}
```

## 🛠️ Working with Services

### Adding a New API Endpoint

1. **Add Types** (`types.ts`):
```typescript
export interface NewFeature {
  id: string;
  // ... fields
}
```

2. **Add Service Function** (`geminiService.ts`):
```typescript
export const generateNewFeature = async (prompt: string): Promise<NewFeature> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { /* ... */ }
    });
    logger.info('generateNewFeature', 'Success');
    return { /* ... */ };
  } catch (error) {
    logger.error('generateNewFeature', error);
    throw handleApiError(error, 'generateNewFeature');
  }
};
```

3. **Use in Component**:
```typescript
const MyComponent = () => {
  const [data, setData] = useState<NewFeature | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  const handleGenerate = async () => {
    try {
      const result = await generateNewFeature(prompt);
      setData(result);
    } catch (err) {
      setError(err as ApiError);
    }
  };

  // JSX...
};
```

## 📱 Component Development

### Creating a New Component

1. **File Naming**: `components/MyFeature.tsx`

2. **Component Template**:
```typescript
import React, { useState, useCallback } from 'react';
import { MyIcon } from 'lucide-react';
import { generateMyFeature } from '../services/geminiService';
import { MyFeatureType } from '../types';

interface MyFeatureProps {
  onSuccess?: (data: MyFeatureType) => void;
}

export const MyFeature: React.FC<MyFeatureProps> = ({ onSuccess }) => {
  const [data, setData] = useState<MyFeatureType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await generateMyFeature();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [onSuccess]);

  return (
    <div className="space-y-4">
      {/* Component JSX */}
    </div>
  );
};
```

3. **Add to App.tsx**:
```typescript
import { MyFeature } from './components/MyFeature';

export default function App() {
  const renderContent = () => {
    switch (mode) {
      case AppMode.MY_FEATURE:
        return <MyFeature />;
      // ...
    }
  };
}
```

## 🎨 Styling Guide

### Tailwind Classes Used
- **Colors**: `pin-orange`, `pin-blue`, `pin-green`, `pin-accent`
- **Backgrounds**: `bg-pin-darker`, `bg-pin-dark`, `bg-white/5`
- **Borders**: `border-white/10`, `border-pin-orange/30`
- **Text**: `text-gray-400`, `text-white`, `text-gray-200`

### Responsive Design
```typescript
// Mobile first approach
<div className="p-4 lg:p-6">           // Padding
<div className="flex-col lg:flex-row"> // Layout
<h1 className="text-2xl lg:text-4xl">  // Font size
```

## 🧪 Testing Guide

### Manual Testing Checklist
- [ ] Component renders without errors
- [ ] Loading states work correctly
- [ ] Error states display properly
- [ ] Mobile responsive layout works
- [ ] Keyboard navigation works
- [ ] Touch interactions work on mobile
- [ ] Error boundary catches errors

### Testing a New Feature
```bash
# 1. Start dev server
npm run dev

# 2. Test in browser
# - Check console for errors
# - Test all interactions
# - Test mobile responsiveness

# 3. Check types
npm run type-check

# 4. Build production
npm run build
```

## 📊 Performance Considerations

### Bundle Size
- Current: ~150KB (gzipped)
- Target: Keep under 200KB
- Monitor with: `npm run build` output

### Optimization Tips
1. **Use lazy loading** for routes
2. **Memoize** expensive computations
3. **Avoid** unnecessary re-renders
4. **Code split** large features
5. **Optimize** images with compression

### Common Bottlenecks
- Large component trees (use memoization)
- Frequent re-renders (use useCallback)
- Inline object creation (use useMemo)
- Heavy API calls (use caching)

## 🐛 Debugging

### Using Console Logs
```typescript
// Service layer
logger.info('functionName', 'Success message');
logger.error('functionName', error);

// Component layer
console.log('Render with data:', data);
console.error('Error state:', error);
```

### Chrome DevTools
- **Console**: Check for errors and logs
- **Network**: Monitor API calls
- **Performance**: Check rendering performance
- **Memory**: Look for memory leaks

### Type Checking
```bash
npm run type-check
```

## 🔐 Security Best Practices

1. **API Keys**: Never commit `.env.local`
   - Use `.env.local.example` template
   - Add `.env.local` to `.gitignore`

2. **Input Validation**: Always validate user input
   ```typescript
   if (!input.trim()) return;
   ```

3. **Error Messages**: Don't expose sensitive info
   ```typescript
   // Good
   setError('Failed to load data');
   
   // Bad
   setError(error.message); // May expose sensitive details
   ```

4. **XSS Prevention**: React escapes by default
   - Avoid `dangerouslySetInnerHTML`
   - Use `react-markdown` for markdown

## 🚀 Deployment Checklist

- [ ] Run type check: `npm run type-check`
- [ ] Build production: `npm run build`
- [ ] Test build locally: `npm run preview`
- [ ] Check for console errors
- [ ] Test on mobile device
- [ ] Verify API keys are set
- [ ] Check environment variables
- [ ] Run performance audit

## 📚 Resources

### Gemini API Docs
- https://ai.google.dev/docs
- https://ai.google.dev/api/rest

### React Docs
- https://react.dev
- https://react.dev/reference/hooks

### TypeScript Docs
- https://www.typescriptlang.org/docs

### Tailwind CSS
- https://tailwindcss.com/docs

## 💡 Common Tasks

### Adding a New API Model
1. Update `generateChatResponse` model selection
2. Add config options for the new model
3. Test thoroughly with different inputs
4. Update documentation

### Changing Color Scheme
1. Update `index.html` Tailwind config
2. Update all class names using `pin-*` colors
3. Test contrast for accessibility
4. Verify on mobile

### Adding New Language Support
1. Update system prompts in `geminiService.ts`
2. Test with samples in that language
3. Update documentation
4. Add language to keywords in `index.html`

## 🎓 Learning Path

**Start Here**:
1. Read this guide
2. Review `types.ts` for data structures
3. Explore `ChatInterface.tsx` for component patterns
4. Study `geminiService.ts` for API patterns

**Then**:
1. Add a small feature
2. Add a new component
3. Extend an existing service
4. Deploy to production

## ❓ FAQ

**Q: How do I add a new chat mode?**
A: Add a new enum value to `FocusMode`, update service prompts, and add UI toggle.

**Q: How do I handle API rate limits?**
A: The error handler already catches 429 errors and returns a rate limit error type.

**Q: Can I use different Gemini models?**
A: Yes, update model name in service functions and test thoroughly.

**Q: How do I add real-time features?**
A: Consider using Gemini's streaming API for real-time responses.

**Q: Where should I add authentication?**
A: Implement in a new auth service and wrap components with auth guard.

---

**Last Updated**: 2025-12-18
**Version**: 1.3.3
**Maintainer**: Logesh
