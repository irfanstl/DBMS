import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fffcf2] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-gray-100 text-center">
            <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Oops! Something went wrong.</h1>
            <p className="text-gray-500 font-medium mb-8">We're sorry, but the application encountered an unexpected error. Please try refreshing the page.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-gray-900/20 active:scale-95"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}
