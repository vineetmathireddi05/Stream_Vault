import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
          <AlertTriangle size={48} className="text-primary mb-4" />
          <h2 className="font-display text-3xl mb-2">Something went wrong</h2>
          <p className="text-muted max-w-md">
            {this.state.error.message || 'An unexpected error occurred. Try refreshing the page.'}
          </p>
          <button
            onClick={() => this.setState({ error: null })}
            className="btn-primary mt-6"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
