import React, { useState, ReactNode } from 'react';
import { Layout } from './components/Layout';
import { ChatInterface } from './components/ChatInterface';
import { MediaStudio } from './components/MediaStudio';
import { OfficeAssistant } from './components/OfficeAssistant';
import { LifeCoach } from './components/LifeCoach';
import { AppMode } from './types';

// ==================== Error Boundary ====================

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-pin-darker text-white p-4">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-bold mb-4 text-pin-orange">⚠️ Something went wrong</h1>
            <p className="text-gray-400 mb-6">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-pin-orange hover:bg-yellow-600 text-white font-bold rounded-lg transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ==================== Main App Component ====================

export default function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.CHAT);

  const renderContent = () => {
    switch (mode) {
      case AppMode.CHAT:
        return <ChatInterface />;
      case AppMode.MEDIA_STUDIO:
        return <MediaStudio />;
      case AppMode.OFFICE_ASSISTANT:
        return <OfficeAssistant />;
      case AppMode.LIFE_COACH:
        return <LifeCoach />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <ErrorBoundary>
      <Layout currentMode={mode} onModeChange={setMode}>        
        {renderContent()}
      </Layout>
    </ErrorBoundary>
  );
}
